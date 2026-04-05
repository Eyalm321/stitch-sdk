import * as fs from "fs";

/**
 * Extracts a Tailwind v3 config from Stitch HTML and converts it to Tailwind v4 @theme CSS.
 */
function extractTheme(htmlPath: string): string {
  const html = fs.readFileSync(htmlPath, "utf-8");
  const configMatch = html.match(/<script id="tailwind-config">([\s\S]*?)<\/script>/);

  if (!configMatch) {
    console.error("No tailwind-config script found in the HTML.");
    process.exit(1);
  }

  const scriptContent = configMatch[1];
  const configObjMatch = scriptContent.match(/tailwind\.config\s*=\s*({[\s\S]*?});/);

  if (!configObjMatch) {
    console.error("Could not parse tailwind.config object.");
    process.exit(1);
  }

  let config: any;
  try {
    // The config is a JS object literal, not strict JSON. Use a safe eval-like approach or relaxed parser.
    // For simplicity in this example, we'll try evaluating it in a sandbox or cleaning it up.
    // Since it's from a trusted source (Stitch), eval is a quick way to parse JS object literals.
    config = new Function(`return ${configObjMatch[1]}`)();
  } catch (e) {
    console.error("Failed to parse tailwind config:", e);
    process.exit(1);
  }

  let themeCss = "@theme {\n";

  if (config?.theme?.extend?.colors) {
    for (const [colorName, colorValue] of Object.entries(config.theme.extend.colors)) {
      if (typeof colorValue === "string") {
        themeCss += `  --color-${colorName}: ${colorValue};\n`;
      } else if (typeof colorValue === "object" && colorValue !== null) {
         for (const [shade, hex] of Object.entries(colorValue)) {
            themeCss += `  --color-${colorName}-${shade}: ${hex};\n`;
         }
      }
    }
  }

  if (config?.theme?.extend?.fontFamily) {
    for (const [fontName, fontValue] of Object.entries(config.theme.extend.fontFamily)) {
      if (typeof fontValue === "string") {
        themeCss += `  --font-${fontName}: ${fontValue};\n`;
      } else if (Array.isArray(fontValue)) {
         themeCss += `  --font-${fontName}: ${fontValue.join(", ")};\n`;
      }
    }
  }

  themeCss += "}\n";
  return themeCss;
}

if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: bun run extract-theme.ts <path-to-html>");
    process.exit(1);
  }
  const css = extractTheme(file);
  console.log(css);
}

export { extractTheme };
