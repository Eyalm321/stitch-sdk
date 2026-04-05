# Astro Site from Screens

This is an **Agent Skill** example that demonstrates how an agent can use the Stitch SDK to generate a multi-page Astro website.

## Overview

Unlike a basic generation script, building a multi-page site requires agent intelligence to:
1. Generate multiple related screens (e.g., landing, pricing, about).
2. Map each generated screen to an Astro page route.
3. Extract a shared Tailwind theme from one of the screens (the canonical theme) to use across the whole site.
4. Build a shared Astro layout that includes the necessary Google Fonts.

This directory provides instructions (`SKILL.md`) for an agent to perform this workflow.

## Running

This is not a standalone script. It is a set of instructions for an agent. To use this, provide the `SKILL.md` to an agent with access to the Stitch SDK tools.
