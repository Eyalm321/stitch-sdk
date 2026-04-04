# Skill: Astro Multipage Site Generation

This document teaches you how to use the `@google/stitch-sdk` to generate a multi-page Astro website from text prompts.

## The Workflow

When asked to generate a multi-page site, follow these steps:

1.  **Generate Screens:** Use the Stitch SDK (e.g., `create_project` and `generate_screen_from_text` tools) to generate a screen for each required page (e.g., "Landing page", "About page", "Pricing page"). Make sure they are all in the same project.
2.  **Extract Shared Theme:** Choose one of the generated screens (usually the first one) to be the "canonical" theme source.
    *   Fetch its HTML.
    *   Extract the `<script id="tailwind-config">` block.
    *   Convert this JS object into a format suitable for Astro's Tailwind integration (e.g., a `tailwind.config.mjs` file or Astro's new Tailwind v4 integration).
3.  **Extract Shared Assets:**
    *   Extract any Google Fonts `<link>` tags from the HTML.
    *   Place these in a shared Astro Layout component (`src/layouts/Layout.astro`).
4.  **Create Pages:**
    *   For each generated screen, fetch its HTML.
    *   Extract the body content (everything inside `<body>`).
    *   Create an Astro page component (e.g., `src/pages/index.astro`, `src/pages/about.astro`) using the shared Layout.
    *   Paste the body content into the page component. Since Astro supports raw HTML with standard class attributes, you don't need to do extensive JSX conversion like you would for React.

## Astro Specifics

*   **Routing:** Astro uses file-based routing in the `src/pages/` directory. A file named `src/pages/about.astro` becomes the `/about` route.
*   **Layouts:** Create a base layout that accepts a `title` prop and includes the global CSS and font links.
*   **Tailwind:** Astro has a first-party Tailwind integration. Follow standard Astro documentation for setting it up.

## Example Layout Structure

```astro
---
// src/layouts/Layout.astro
interface Props {
	title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="description" content="Astro description" />
		<meta name="viewport" content="width=device-width" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="generator" content={Astro.generator} />
		<title>{title}</title>
        <!-- Inject extracted Google Fonts links here -->
	</head>
	<body>
		<slot />
	</body>
</html>
```

## Example Page Structure

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
---

<Layout title="Welcome to Astro.">
    <!-- Paste extracted Stitch HTML body here -->
	<main class="bg-gray-100 min-h-screen p-8">
        <h1 class="text-4xl font-bold text-primary">Hello from Stitch</h1>
    </main>
</Layout>
```
