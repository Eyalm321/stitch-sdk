import { stitch } from "@google/stitch-sdk";
import * as fs from "fs";
import * as path from "path";
import "../../../_require-key.js";

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: bun run scaffold-nextjs.ts <projectId> <screenId>");
    process.exit(1);
  }

  const projectId = args[0];
  const screenId = args[1];

  console.log(`Fetching design from project ${projectId}, screen ${screenId}...`);

  const project = stitch.project(projectId);
  // Using screens() because getScreen() is not available
  const screens = await project.screens();
  const screen = screens.find((s: any) => s.id === screenId || s.screenId === screenId);

  if (!screen) {
    console.error(`Screen ${screenId} not found in project ${projectId}`);
    process.exit(1);
  }

  const htmlUrl = await screen.getHtml();
  let html = htmlUrl;
  if (htmlUrl.startsWith("http")) {
    const resp = await fetch(htmlUrl);
    html = await resp.text();
  }

  // 1. Extract Tailwind Config
  const configMatch = html.match(/<script id="tailwind-config">([\s\S]*?)<\/script>/);
  if (configMatch && configMatch[1]) {
    const configContent = configMatch[1].trim();
    const cleanConfig = configContent.replace(/^tailwind\.config\s*=\s*/, "").replace(/;$/, "");
    const outputConfig = `/** @type {import('tailwindcss').Config} */\nmodule.exports = ${cleanConfig};\n`;
    fs.writeFileSync("tailwind.config.extracted.js", outputConfig);
    console.log("✅ Extracted Tailwind config to tailwind.config.extracted.js");
  } else {
    console.warn("⚠️ No tailwind-config block found in HTML.");
  }

  // 2. Extract Google Fonts
  const fonts = html.match(/<link[^>]*fonts\.googleapis\.com[^>]*>/g) || [];
  if (fonts.length > 0) {
    fs.writeFileSync("extracted-fonts.txt", fonts.join("\n") + "\n");
    console.log("✅ Extracted Google Fonts to extracted-fonts.txt");
  } else {
    console.warn("⚠️ No Google Fonts found in HTML.");
  }

  // 3. Extract Body HTML
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch && bodyMatch[1]) {
    fs.writeFileSync("extracted-page.html", bodyMatch[1].trim() + "\n");
    console.log("✅ Extracted body HTML to extracted-page.html");
  } else {
    console.warn("⚠️ No <body> tag found in HTML.");
  }

  console.log("\nNext Steps:");
  console.log("1. Merge tailwind.config.extracted.js into your Next.js tailwind.config.ts");
  console.log("2. Use next/font/google to load the fonts listed in extracted-fonts.txt in your layout.tsx");
  console.log("3. Convert the HTML in extracted-page.html to JSX (className, self-closing tags) in your page.tsx");
}

main().catch(console.error);
