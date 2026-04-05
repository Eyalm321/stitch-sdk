# Design System Extraction Skill

## Overview

This skill teaches an agent how to extract a unified design system (colors, fonts, etc.) from multiple Stitch-generated screens.
Stitch generates a `<script id="tailwind-config">` block in its HTML output.
The agent must parse these config blocks from multiple screens, reconcile conflicting properties (e.g., matching color tokens from different screens), and output a unified design token file.

## Instructions

1. Retrieve the HTML for multiple screens using the Stitch SDK.
2. Use `extract-tokens.ts` (or similar logic) to parse the `tailwind-config` block from each HTML document.
3. Identify all tokens (colors, font families, shadows, etc.).
4. When two screens define a token with the same name but different values (e.g., `primary: "#FF0000"` vs `primary: "#E60000"`), reconcile the differences. You can:
   - Keep the most commonly used value.
   - Use the value from a designated "primary" screen.
   - Present the conflict to the user.
5. Generate a final, merged output format such as W3C Design Tokens JSON or CSS Variables.

## Helper Scripts

See `scripts/extract-tokens.ts` for a utility to parse the tailwind configs from an array of HTML strings.
