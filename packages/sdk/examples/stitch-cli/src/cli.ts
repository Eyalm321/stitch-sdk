#!/usr/bin/env bun
import { stitch } from "@google/stitch-sdk";

if (!process.env.STITCH_API_KEY) {
  console.error("Error: STITCH_API_KEY environment variable is required.");
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
  console.log(`
Stitch CLI Tool

Usage:
  stitch-cli <command> [options]

Commands:
  generate      Generate a new screen
  export        Export an existing screen's HTML or image
  extract-theme Extract the Tailwind config from a screen
  schema        Print JSON schemas for inputs

Global Options:
  --json        Output result as JSON for agents
`);
  process.exit(0);
}

const command = args[0];
const isJson = args.includes("--json");

function getJsonPayload(argsList: string[]): string {
  // Find the first argument that looks like JSON after trimming whitespace
  const match = argsList.find(a => a.trim().startsWith("{"));
  if (!match) {
    throw new Error(`Missing JSON payload for ${command}`);
  }
  return match.trim();
}

async function main() {
  try {
    if (command === "generate") {
      const inputArg = getJsonPayload(args);
      const input = JSON.parse(inputArg);

      if (!input.projectId || !input.prompt) throw new Error("Missing projectId or prompt");
      const project = stitch.project(input.projectId);
      const screen = await project.generate(input.prompt);

      if (isJson) {
        console.log(JSON.stringify({
          screenId: screen.id,
          projectId: screen.projectId
        }, null, 2));
      } else {
        console.log(`Generated screen ${screen.id} in project ${screen.projectId}`);
      }
    } else if (command === "export") {
      const inputArg = getJsonPayload(args);
      const input = JSON.parse(inputArg);

      if (!input.projectId || !input.screenId) throw new Error("Missing projectId or screenId");
      const project = stitch.project(input.projectId);
      const screens = await project.screens();
      const screen = screens.find((s: any) => s.id === input.screenId);
      if (!screen) throw new Error("Screen not found");

      const htmlUrl = await screen.getHtml();
      const imageUrl = await screen.getImage();

      if (isJson) {
        console.log(JSON.stringify({
          htmlUrl,
          imageUrl
        }, null, 2));
      } else {
        console.log(`HTML: ${htmlUrl}\nImage: ${imageUrl}`);
      }
    } else if (command === "extract-theme") {
       const inputArg = getJsonPayload(args);
       const input = JSON.parse(inputArg);

       if (!input.projectId || !input.screenId) throw new Error("Missing projectId or screenId");
       const project = stitch.project(input.projectId);
       const screens = await project.screens();
       const screen = screens.find((s: any) => s.id === input.screenId);
       if (!screen) throw new Error("Screen not found");

       const htmlData = await screen.getHtml();
       let html = "";
       if (htmlData && htmlData.startsWith("http")) {
         const resp = await fetch(htmlData);
         html = await resp.text();
       } else {
         html = htmlData;
       }

       const configMatch = html.match(/<script id="tailwind-config">([\s\S]*?)<\/script>/);
       const theme = configMatch ? configMatch[1] : null;

       if (isJson) {
         console.log(JSON.stringify({ theme }, null, 2));
       } else {
         console.log(theme ?? "No theme found.");
       }
    } else if (command === "schema") {
       const subCommand = args[1];
       if (subCommand === "generate") {
         console.log(JSON.stringify({
            type: "object",
            properties: {
              projectId: { type: "string" },
              prompt: { type: "string" }
            },
            required: ["projectId", "prompt"]
         }, null, 2));
       } else {
         console.log(JSON.stringify({
            commands: ["generate", "export", "extract-theme"]
         }, null, 2));
       }
    } else {
      throw new Error(`Unknown command: ${command}`);
    }
  } catch (error: any) {
    if (isJson) {
      console.error(JSON.stringify({ error: error.message }));
    } else {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
}

await main();
