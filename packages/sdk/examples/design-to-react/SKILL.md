# Skill: Design to React Component

This skill teaches an agent how to interpret Stitch HTML (which varies in structure per design), extract the necessary assets, identify semantic sections, and produce a modular React component with a Props interface.

## Prerequisites
You need a `projectId` and `screenId` from the Stitch SDK.

## Steps for the Agent

1. **Extract Assets**
   Run the included extraction script to pull out the Tailwind configuration and Google Fonts from the design's HTML.
   ```bash
   bun packages/sdk/examples/design-to-react/scripts/extract-assets.ts <projectId> <screenId>
   ```
   - Save the Tailwind config object (if present) to your target `tailwind.config.ts`.
   - Place any Google Fonts `<link>` tags in your React application's root (e.g., `index.html` or Next.js `_document.tsx`/`layout.tsx`).

2. **Analyze the HTML Body**
   - Inspect the remaining HTML structure.
   - Identify the major semantic sections (e.g., Header, Hero, Main Content, Footer).

3. **Convert HTML to JSX**
   - Transform `class="..."` to `className="..."`.
   - Convert self-closing tags to JSX format (e.g., `<img>` to `<img />`, `<input>` to `<input />`).
   - Apply the extracted Tailwind classes directly to your JSX elements.

4. **Define Props Interface**
   - Review the textual content and images within the generated design.
   - Abstract hardcoded values into a TypeScript `Props` interface.
   - Replace hardcoded text/images with the corresponding props in your component.

## Example Output
Your final React component should look something like this:
```tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  imageUrl: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, imageUrl }) => {
  return (
    <div className="bg-primary text-secondary p-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <img src={imageUrl} alt={title} className="rounded-lg shadow-md" />
    </div>
  );
};
```
