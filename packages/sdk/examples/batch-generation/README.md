# Batch Design Generation

This script demonstrates how to read a list of prompts from a JSON file and generate Stitch UI screens in parallel using `Promise.allSettled`.

This is a Tier 1 (Script) example because it is deterministic and requires no agentic decision-making.

## Prerequisites

1. Set your `STITCH_API_KEY` environment variable.
2. Build the SDK first (from the root directory):
   ```bash
   npm run build
   ```

## Running the Example

Run this script directly from this directory:

```bash
cd packages/sdk/examples/batch-generation
STITCH_API_KEY=your_key bun index.ts
```

The script will read prompts from `prompts.json`, create a single project, generate all designs in parallel, and output a summary report with the generated screen IDs and image URLs.
