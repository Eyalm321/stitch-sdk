import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { stitch } from "@google/stitch-sdk";

const server = new Server(
  {
    name: "stitch-design-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "generate_and_extract",
        description:
          "Generate a screen and return extracted theme + HTML body + screenshot URL in one call",
        inputSchema: {
          type: "object",
          properties: {
            projectId: {
              type: "string",
              description: "The ID of the Stitch project",
            },
            prompt: {
              type: "string",
              description: "The prompt to generate the screen",
            },
          },
          required: ["projectId", "prompt"],
        },
      },
      {
        name: "compare_themes",
        description: "Generate variants of a screen and diff their configs",
        inputSchema: {
          type: "object",
          properties: {
            projectId: {
              type: "string",
              description: "The ID of the Stitch project",
            },
            screenId: {
              type: "string",
              description: "The ID of the base screen",
            },
            prompt: {
              type: "string",
              description: "The prompt for the variants",
            },
          },
          required: ["projectId", "screenId", "prompt"],
        },
      },
      {
        name: "scaffold_project",
        description: "Generate multiple screens and return them as a page manifest",
        inputSchema: {
          type: "object",
          properties: {
            projectId: {
              type: "string",
              description: "The ID of the Stitch project",
            },
            prompts: {
              type: "array",
              items: {
                type: "string"
              },
              description: "An array of prompts to generate screens",
            },
          },
          required: ["projectId", "prompts"],
        },
      },
    ],
  };
});

async function extractTheme(htmlUrl: string): Promise<string> {
  let html = "";
  if (htmlUrl.startsWith("http")) {
    const res = await fetch(htmlUrl);
    html = await res.text();
  } else {
    html = htmlUrl;
  }
  const themeMatch = html.match(
    /<script id="tailwind-config">([\s\S]*?)<\/script>/
  );
  return themeMatch ? themeMatch[1].trim() : "No theme found";
}

async function extractBody(htmlUrl: string): Promise<string> {
  let html = "";
  if (htmlUrl.startsWith("http")) {
    const res = await fetch(htmlUrl);
    html = await res.text();
  } else {
    html = htmlUrl;
  }
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  return bodyMatch ? bodyMatch[1].trim() : "No body found";
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "generate_and_extract") {
    const { projectId, prompt } = request.params.arguments as any;
    try {
      const project = stitch.project(projectId);
      const screen = await project.generate(prompt);
      const htmlUrl = await screen.getHtml();
      const imageUrl = await screen.getImage();
      const theme = await extractTheme(htmlUrl);
      const body = await extractBody(htmlUrl);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                theme,
                body,
                imageUrl,
                screenId: screen.id,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (e: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error generating screen: ${e.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  if (request.params.name === "compare_themes") {
    const { projectId, screenId, prompt } = request.params.arguments as any;
    try {
      const project = stitch.project(projectId);
      const screen = await project.getScreen(screenId);
      const variants = await screen.variants(prompt, { variantCount: 2 });

      const configs = await Promise.all(
        variants.map(async (v) => {
          const htmlUrl = await v.getHtml();
          return await extractTheme(htmlUrl);
        })
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                variants: variants.map((v, i) => ({
                  screenId: v.id,
                  theme: configs[i],
                })),
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (e: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error comparing themes: ${e.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  if (request.params.name === "scaffold_project") {
    const { projectId, prompts } = request.params.arguments as { projectId: string, prompts: string[] };
    try {
      const project = stitch.project(projectId);

      const results = await Promise.allSettled(
        prompts.map(p => project.generate(p))
      );

      const manifest = [];
      for (const [index, result] of results.entries()) {
        if (result.status === "fulfilled") {
           const screen = result.value;
           manifest.push({
             prompt: prompts[index],
             screenId: screen.id,
             imageUrl: await screen.getImage()
           });
        } else {
           manifest.push({
             prompt: prompts[index],
             error: result.reason.message
           });
        }
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ manifest }, null, 2),
          },
        ],
      };
    } catch (e: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error scaffolding project: ${e.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error(`Tool not found: ${request.params.name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Stitch Design MCP Server running on stdio");
}

main().catch(console.error);
