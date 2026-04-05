# Next.js Integration Agent Skill

This example provides a **Skill** and a **Helper Script** that teach an agent how to scaffold a Next.js application from a Stitch-generated design.

## Purpose

The Stitch SDK outputs HTML containing Tailwind CSS, embedded configuration, and Google Fonts. This skill demonstrates how to bridge the gap between that raw HTML output and a functional React/Next.js App Router project.

## Files

- `SKILL.md`: The markdown instructions to provide to an autonomous agent.
- `scripts/scaffold-nextjs.ts`: A script the agent can run to automate the extraction of assets from a specific Stitch screen.

## Running the Script

Ensure you have your API key set:
```bash
export STITCH_API_KEY="your-api-key"
```

To run the script:
```bash
bun run scripts/scaffold-nextjs.ts <projectId> <screenId>
```

This will produce three files in your current directory:
- `tailwind.config.extracted.js`
- `extracted-fonts.txt`
- `extracted-page.html`
