# Skill: Using the Stitch Design MCP Server

This skill demonstrates how to expose the Stitch SDK as an MCP server with compound tools that combine multiple Stitch operations into single calls.

## Overview

The Stitch SDK provides granular tools (e.g., generate a screen, fetch HTML, edit a screen). While powerful, agents often need compound tools to reduce round-trips.

This MCP server exposes compound tools like:
- `generate_and_extract`: Generates a screen and returns the extracted Tailwind theme, HTML body, and screenshot URL in a single call.
- `compare_themes`: Generates variants and diffs their configs.
- `scaffold_project`: Generates multiple screens and returns them as a page manifest.

## Usage

This is a standard MCP server running over stdio.

1. Ensure `STITCH_API_KEY` is set in your environment.
2. Run the server using an MCP client (e.g., Claude Desktop, Cursor, or another agent):
```bash
bun run packages/sdk/examples/mcp-server/index.ts
```

## Example: `generate_and_extract`

When you call `generate_and_extract` with `{ "projectId": "...", "prompt": "..." }`, the server will:
1. Call `project.generate(prompt)` to create the screen.
2. Fetch the HTML content.
3. Parse the HTML to extract the Tailwind `<script>` block and the `<body>` content.
4. Return a JSON object with `theme`, `body`, `imageUrl`, and `screenId`.
