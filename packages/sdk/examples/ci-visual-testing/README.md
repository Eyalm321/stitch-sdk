# CI Visual Testing Example

This example demonstrates how to integrate the Stitch SDK into a Continuous Integration (CI) pipeline to automatically regenerate UI designs and perform visual testing against baseline screenshots.

## Overview

Visual regression testing is crucial for ensuring that code changes do not inadvertently break the user interface. This example shows how to use Stitch to:

1. Regenerate a design in a CI environment.
2. Capture the updated screenshot URL provided by the Stitch SDK.
3. Compare the new screenshot against a known baseline to detect visual differences.

## Structure

- **`SKILL.md`**: Instructions for an agent on how to set up and run the visual testing workflow.
- **`scripts/ci-runner.ts`**: The actual TypeScript script that runs the regeneration and comparison logic.

## Running the Example

1. Ensure your `STITCH_API_KEY` is set in your environment.
2. Provide a valid `PROJECT_ID` and `SCREEN_ID` in the script.
3. Run the script:

```bash
bun scripts/ci-runner.ts
```
