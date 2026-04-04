# Basic Design Generation Example

This is a Tier 1 (Script) example demonstrating the most basic usage of the Stitch SDK:
1. Creating a project (`stitch.callTool("create_project", ...)`)
2. Generating a screen from a text prompt (`project.generate`)
3. Retrieving the generated HTML and screenshot URLs (`screen.getHtml()`, `screen.getImage()`)

## Usage

```bash
STITCH_API_KEY=your_api_key bun index.ts
```
