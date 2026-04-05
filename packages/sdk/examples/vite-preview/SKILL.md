# Skill: Vite + Tailwind v4 Preview App

This skill teaches how to convert Stitch's CDN Tailwind config to Tailwind v4 `@theme` syntax and set up a Vite preview app.

## Capabilities

1.  **Extract Theme:** Use the provided script to extract the embedded Tailwind configuration from a Stitch HTML file and convert it to a Tailwind v4 `@theme` CSS block.
2.  **Scaffold App:** Set up a Vite project with React and `@tailwindcss/vite`.
3.  **Integrate Design:** Take the HTML body and Google Fonts links from Stitch and put them into the React app.

## Using the Theme Extractor

To extract the theme from an HTML string or file:

```bash
bun run scripts/extract-theme.ts "path/to/stitch-output.html" > src/theme.css
```

This takes the `tailwind.config` JSON-like object from the HTML and converts fields like `theme.extend.colors` into `@theme { --color-*: *; }` variables for Tailwind v4.

## Manual Steps (for an Agent)

1.  Generate a design with Stitch and download the HTML.
2.  Initialize Vite: `bun create vite my-preview --template react-ts`
3.  Install Tailwind v4: `cd my-preview && bun add tailwindcss @tailwindcss/vite`
4.  Configure `vite.config.ts`:
    ```ts
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    import tailwindcss from '@tailwindcss/vite'

    export default defineConfig({
      plugins: [tailwindcss(), react()],
    })
    ```
5.  Extract the theme from the HTML using the script in `scripts/extract-theme.ts` and save it to `src/index.css`.
6.  Prepend `@import "tailwindcss";` to the top of `src/index.css`.
7.  Copy the `<body>` content from the Stitch HTML into `src/App.tsx`, converting it to JSX (e.g., `class` -> `className`, closing self-closing tags).
8.  Copy the Google Fonts `<link>` tags from the Stitch HTML `<head>` into `index.html`.
9.  Run the app: `bun run dev`
