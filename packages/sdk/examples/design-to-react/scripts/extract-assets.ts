/**
 * Fetch HTML from a screen and parse out the Tailwind configuration
 * and Google Fonts links to prepare for React component conversion.
 *
 * Usage:
 *   STITCH_API_KEY=your-key bun packages/sdk/examples/design-to-react/scripts/extract-assets.ts <projectId> <screenId>
 */
import "../../_require-key.js";
import { stitch } from "@google/stitch-sdk";

const projectId = process.argv[2];
const screenId = process.argv[3];

if (!projectId || !screenId) {
  console.error("Usage: bun extract-assets.ts <projectId> <screenId>");
  process.exit(1);
}

const project = stitch.project(projectId);

// Fetch all screens and filter by ID as per standard usage
const screens = await project.screens();
const screen = screens.find(s => s.id === screenId);

if (!screen) {
  console.error(`Screen ${screenId} not found in project ${projectId}`);
  process.exit(1);
}

console.log(`🎨 Fetching assets for screen ${screen.id}...`);

const htmlOrUrl = await screen.getHtml();
let html = htmlOrUrl;

if (htmlOrUrl.startsWith("http")) {
  const response = await fetch(htmlOrUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch HTML: ${response.statusText}`);
  }
  html = await response.text();
}

const configMatch = html.match(/<script id="tailwind-config">([\s\S]*?)<\/script>/);
if (configMatch) {
  console.log("✅ Tailwind Config Extracted:");
  console.log(configMatch[1].trim());
} else {
  console.log("❌ No Tailwind config found.");
}

const fontsMatches = html.match(/<link[^>]*fonts\.googleapis\.com[^>]*>/g) || [];
if (fontsMatches.length > 0) {
  console.log(`✅ Google Fonts (${fontsMatches.length} found):`);
  fontsMatches.forEach(link => console.log(`  - ${link}`));
} else {
  console.log("❌ No Google Fonts links found.");
}

console.log("✅ Asset extraction complete. Ready for React component mapping.");
