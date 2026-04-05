# Tool Filtering Example

This example demonstrates how to use `stitchTools({ include: [...] })` to restrict which tools an LLM can call when using the Vercel AI SDK adapter.

## Why Filter Tools?

By default, `stitchTools()` provides all available Stitch MCP tools to the LLM. In many workflows, you want to restrict the LLM's capabilities to prevent unintended actions. For example:
- **Read-only Agent**: Only provide `list_projects`, `list_screens`, and `get_screen` to prevent the agent from creating or editing designs.
- **Iteration Agent**: Only provide `edit_screen` and `generate_screen_variants` if the agent's only job is to refine an existing design.

## Usage

Run the example script:

```bash
cd packages/sdk
STITCH_API_KEY=your-api-key bun examples/tool-filtering/index.ts
```

The script will output the filtered list of tools to demonstrate that the output is successfully constrained.
