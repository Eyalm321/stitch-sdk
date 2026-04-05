# Skill: Next.js Integration from Stitch Designs

This skill teaches an agent how to adapt a Stitch SDK generated UI screen into a Next.js App Router project.

## Workflow

When tasked with generating a Next.js application from a prompt:

1. **Generate the Design**: Use the Stitch SDK to generate the screen (e.g. via `project.generate(prompt)` or `generate_screen_from_text` tool).
2. **Extract Assets**:
   - Fetch the HTML string using `screen.getHtml()`.
   - The HTML will contain:
     - A `<script id="tailwind-config">` block with theme variables (colors, fonts).
     - Google Fonts `<link>` tags in the `<head>`.
     - Raw HTML with Tailwind CSS classes in the `<body>`.
3. **Scaffold Next.js Structure**:
   - Create a standard Next.js App Router skeleton (`app/layout.tsx`, `app/page.tsx`).
4. **Map Tailwind Configuration**:
   - Extract the JSON-like object from the `<script id="tailwind-config">` block.
   - Write it to `tailwind.config.ts`.
5. **Map Fonts**:
   - Extract the font families from the Google Fonts tags.
   - Use `next/font/google` in `app/layout.tsx` to inject them, or add standard `<link>` tags if preferred in the raw layout.
6. **Adapt HTML to JSX**:
   - Convert the `<body>` HTML into valid JSX in `app/page.tsx`.
   - Replace `class=` with `className=`.
   - Replace self-closing tags to conform to JSX (e.g., `<img>` -> `<img />`, `<input>` -> `<input />`).
   - Replace inline styles to React-compatible objects (e.g., `style="background-image: url(...)"` -> `style={{ backgroundImage: "url(...)" }}`).
   - **Next.js specifics**:
     - Convert standard `<img>` tags to `<Image>` components from `next/image`, updating `src`, `width`, and `height` props.
     - Convert standard `<a>` tags for internal routing to `<Link>` components from `next/link`.

## Using the Helper Script

This directory contains a helper script `scripts/scaffold-nextjs.ts` which automates steps 1-4.

You can run it from the root of a Next.js project to automatically pull down the design and scaffold the necessary configurations:

```bash
cd my-next-app
bun run /path/to/packages/sdk/examples/nextjs-integration/scripts/scaffold-nextjs.ts "<your project id>" "<your screen id>"
```

The script will write:
- `tailwind.config.extracted.js` (You need to manually merge this with `tailwind.config.ts`)
- `extracted-fonts.txt` (List of fonts to add to `app/layout.tsx`)
- `extracted-page.html` (The raw HTML to convert to JSX)
