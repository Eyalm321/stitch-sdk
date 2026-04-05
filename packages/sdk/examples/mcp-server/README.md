# MCP Server Example

This example demonstrates how to wrap the Stitch SDK (`@google/stitch-sdk`) into an MCP server that exposes compound tools.

## Why Compound Tools?

The raw Stitch MCP tools are granular (e.g., generate a screen, fetch HTML). Agents often need to perform multiple steps to get a usable result. Compound tools reduce round-trips by combining these steps on the server side.

For example, `generate_and_extract` generates a screen, fetches the HTML, extracts the Tailwind theme and body, and returns them in one call.

## Prerequisites

- `STITCH_API_KEY` environment variable must be set.
- Install dependencies: `bun install`

## Running the Server

Since this is an MCP server, it communicates over stdio. You can run it directly:

```bash
bun index.ts
```

Then type a JSON-RPC request like:

```json
{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}
```

Or configure it in an MCP client (like Claude Desktop) with the command:

```json
{
  "mcpServers": {
    "stitch-design": {
      "command": "bun",
      "args": ["run", "/path/to/packages/sdk/examples/mcp-server/index.ts"],
      "env": {
        "STITCH_API_KEY": "your-api-key"
      }
    }
  }
}
```
