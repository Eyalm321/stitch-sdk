# Stitch CLI Skill

## Overview
The Stitch CLI provides a machine-readable, agent-first interface for generating and exporting UI screens. It allows agents to use the Stitch SDK safely and efficiently through command-line operations with `--json` outputs.

## Features
- Introspection: Fetch JSON schemas for expected input using `schema generate`
- Clean Output: Pass `--json` to all commands for easily parsable responses
- Sandboxed Errors: Avoid runtime stack traces; errors are formatted explicitly as JSON

## Usage
```bash
# Find out schema details
bun packages/sdk/examples/stitch-cli/src/cli.ts schema generate

# Generate a screen
bun packages/sdk/examples/stitch-cli/src/cli.ts generate --json '{"projectId": "...", "prompt": "..."}'

# Export URLs
bun packages/sdk/examples/stitch-cli/src/cli.ts export --json '{"projectId": "...", "screenId": "..."}'

# Extract Theme
bun packages/sdk/examples/stitch-cli/src/cli.ts extract-theme --json '{"projectId": "...", "screenId": "..."}'
```
