# Skill: CI Visual Testing with Stitch SDK

## Context

Visual testing in CI ensures that UI designs remain consistent. The Stitch SDK generates UI screens and provides direct access to screenshot URLs via a content delivery network (CDN). This skill teaches an agent how to evaluate visual diffs from these screenshot URLs to determine if a design regression has occurred.

## Objective

The goal is to automate the visual verification of UI components in a CI pipeline using the `@google/stitch-sdk`.

## Workflow

1.  **Regenerate Design**: Fetch the latest configuration or prompt and regenerate the screen using the Stitch SDK.
2.  **Fetch Screenshot**: Obtain the screenshot URL using `screen.getImage()`.
3.  **Visual Evaluation**: The agent should fetch the image from the URL and compare it against a baseline image.
    - _Note_: Since direct pixel-by-pixel comparison might be complex in this specific script, the agent should simulate or use a mock visual comparison logic, or output the URLs for manual or external tool review.
4.  **Reporting**: Output the status (Pass/Fail) based on the visual comparison.

## Example Script Structure

The script `scripts/ci-runner.ts` provides a starting point for this workflow.

```typescript
import { stitch } from "@google/stitch-sdk";

// 1. Fetch project and screen
// 2. Obtain current image URL
// 3. Compare with baseline (mock implementation provided in script)
```

## Agent Evaluation Guidelines

When evaluating the visual diff, consider:

- Are the core layout structures identical?
- Are the primary brand colors maintained?
- Is the typography consistent?
- _Crucially_, the agent must recognize that `getImage()` returns a URL, not the raw image bytes.
