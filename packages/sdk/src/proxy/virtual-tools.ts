// Copyright 2026 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { forwardToStitch } from './client.js';
import { Project } from '../project-ext.js';
import type { ProxyContext } from './client.js';

export const VIRTUAL_TOOLS: Tool[] = [
  {
    name: 'infer_theme',
    description: 'Infer theme tokens from a screen HTML',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
        screenId: { type: 'string', description: 'Screen ID' }
      },
      required: ['projectId', 'screenId']
    }
  },
  {
    name: 'theme_prompt',
    description: 'Inject theme tokens into a prompt',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'Original prompt' },
        theme: { type: 'object', description: 'Theme tokens' }
      },
      required: ['prompt', 'theme']
    }
  },
  {
    name: 'sync_theme',
    description: 'Sync theme tokens to a design system',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
        theme: { type: 'object', description: 'Theme tokens' }
      },
      required: ['projectId', 'theme']
    }
  },
  {
    name: 'download_assets',
    description: 'Download screens and assets to a local directory',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
        outputDir: { type: 'string', description: 'Output directory' }
      },
      required: ['projectId', 'outputDir']
    }
  }
];

async function createProject(projectId: string, ctx: ProxyContext) {
  const dummyClient = {
    callTool: async (tool: string, args: any) => {
      return forwardToStitch(ctx.config, 'tools/call', {
        name: tool,
        arguments: args,
      });
    },
    fetch: async (url: string) => {
      return fetch(url, {
        headers: {
          'X-Goog-Api-Key': ctx.config.apiKey!,
        },
      });
    }
  };
  // We cast dummyClient to any to satisfy Project constructor which expects StitchToolClient
  return new Project(dummyClient as any, projectId);
}

export function isVirtualTool(name: string): boolean {
  return VIRTUAL_TOOLS.some(t => t.name === name);
}

export async function handleVirtualTool(name: string, args: any, ctx: ProxyContext): Promise<any> {
  switch (name) {
    case 'infer_theme': {
      const { projectId, screenId } = args;
      const project = await createProject(projectId, ctx);
      const theme = await project.inferTheme(screenId);
      return {
        content: [{ type: 'text', text: JSON.stringify(theme, null, 2) }]
      };
    }
    case 'theme_prompt': {
      const { prompt, theme } = args;
      // We need a Project instance just to call themePrompt, but it doesn't use any instance state except maybe projectId if we changed it, but currently it doesn't.
      // Let's use a dummy project with empty ID.
      const project = new Project(null as any, '');
      const enhancedPrompt = project.themePrompt(prompt, theme);
      return {
        content: [{ type: 'text', text: enhancedPrompt }]
      };
    }
    case 'sync_theme': {
      const { projectId, theme } = args;
      const project = await createProject(projectId, ctx);
      const result = await project.syncTheme(theme);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    }
    case 'download_assets': {
      const { projectId, outputDir } = args;
      const project = await createProject(projectId, ctx);
      await project.downloadAssets(outputDir);
      return {
        content: [{ type: 'text', text: `Assets downloaded to ${outputDir}` }]
      };
    }
    default:
      throw new Error(`Unknown virtual tool: ${name}`);
  }
}
