# Design System Extraction

This example demonstrates how an agent can use the Stitch SDK to generate multiple UI screens and extract a unified design system (design tokens) from them.

## Form Factor: Agent Skill

This directory contains a `SKILL.md` file that teaches an agent how to retrieve HTML from multiple Stitch screens, extract their Tailwind configurations, reconcile conflicting tokens, and output a cohesive set of design tokens (like W3C Design Tokens JSON or CSS custom properties).

## Scripts

- `scripts/extract-tokens.ts`: A helper script that parses the `tailwind-config` script tags from multiple HTML strings and performs basic extraction.

## Prerequisites

- Node.js (via Bun)
- `@google/stitch-sdk` installed
- `STITCH_API_KEY` set in the environment

## Running the Script

```bash
bun run scripts/extract-tokens.ts
```
