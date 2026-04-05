# HTML Email from Design

This Agent CLI tool generates an email-ready HTML design using the Stitch SDK. It takes a prompt and generates a design, then uses `juice` to inline the CSS making it suitable for email clients.

## Overview

The agent is responsible for crafting an email-specific prompt (single column, simple layout). The CLI handles the deterministic aspects: generating the design, fetching the HTML, and inlining CSS using `juice`.

## Installation

Ensure you have the required dependencies:

```bash
bun add @google/stitch-sdk juice
bun add -d @types/juice
```

## Example CLI Usage

You can implement this CLI tool in your agent ecosystem by using the following code. Save it as `index.ts` and run it via `bun index.ts`.

```typescript
import { stitch } from "@google/stitch-sdk";
import juice from "juice";

async function main() {
  const args = process.argv.slice(2);
  let input;

  try {
    input = JSON.parse(args[0] || '{}');
  } catch (e) {
    console.error("Invalid JSON input");
    process.exit(1);
  }

  const projectId = input.projectId;
  const prompt = input.prompt;

  if (!projectId || !prompt) {
    console.error("Usage: stitch email --json '{\"projectId\": \"...\", \"prompt\": \"...\"}'");
    process.exit(1);
  }

  console.log(`Generating email design in project ${projectId}...`);
  const project = stitch.project(projectId);

  // Generate the screen using the prompt
  const screen = await project.generate(prompt);
  const htmlUrl = await screen.getHtml();

  console.log(`Fetching HTML...`);
  const response = await fetch(htmlUrl);
  const htmlContent = await response.text();

  console.log(`Inlining CSS with juice...`);
  const inlinedHtml = juice(htmlContent);

  // Output the final email-ready HTML
  console.log("\nEmail-ready HTML:\n");
  console.log(inlinedHtml);
}

main().catch(console.error);
```
