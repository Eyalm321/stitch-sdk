# Skill: HTML Email from Design

This skill teaches an agent how to generate UI designs specifically for email constraints.

## Guidelines for Prompt Crafting
When crafting prompts for the Stitch SDK to generate email designs:
1. Request a single-column layout.
2. Ensure inline styles are emphasized (the CLI tool will handle `juice` inline translation, but semantic simplicity helps).
3. Avoid complex grid or flex layouts that do not render well in standard email clients.
4. Do not rely on external CDN resources besides images.

## Using the CLI
Once you have crafted the prompt, you would typically pass the prompt and other parameters to the email CLI tool.
