# Stitch CLI Example

This example demonstrates an Agent CLI, wrapping the `@google/stitch-sdk` into an agent-friendly command-line interface.

## Agent Ergonomics
- Every command accepts a `--json` flag to output machine-readable JSON.
- Inputs are passed as serialized JSON strings.
- Input validation and schema introspection via `schema` commands.

## Prerequisites
Set your API key before running the CLI:
```bash
export STITCH_API_KEY="your-api-key"
```

## Run
```bash
bun src/cli.ts --help
```
