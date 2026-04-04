# Design to React Component Agent Skill

This example provides an Agent Skill (`SKILL.md`) and an accompanying script to demonstrate how an agent can translate a Stitch UI design into a modular React component.

## What this does
The included `SKILL.md` file teaches an agent how to:
1. Interpret Stitch HTML output.
2. Use the provided script to extract the embedded Tailwind configuration and Google Fonts.
3. Convert the HTML structure into JSX.
4. Create a TypeScript `Props` interface for dynamic content mapping.

## Prerequisites
Set your Stitch API key:
```bash
export STITCH_API_KEY="your_api_key_here"
```

## Usage
Agents should read the `SKILL.md` file for full instructions. To run the asset extraction script manually:
```bash
bun scripts/extract-assets.ts <projectId> <screenId>
```
