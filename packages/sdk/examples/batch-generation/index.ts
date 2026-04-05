import { stitch } from "@google/stitch-sdk";
import fs from "fs/promises";
import path from "path";
import "../_require-key.js";

console.log("Reading prompts from prompts.json...");
const promptsPath = path.join(process.cwd(), "prompts.json");
let promptsFile;
try {
  promptsFile = await fs.readFile(promptsPath, "utf-8");
} catch (error) {
  console.error(
    "Could not read prompts.json. Ensure you run this from the batch-generation directory.",
  );
  process.exit(1);
}

const prompts: string[] = JSON.parse(promptsFile);
console.log(
  `Found ${prompts.length} prompts. Generating designs in parallel...`,
);

const project = await stitch.createProject("Batch Generation Example");
console.log(`Created project ${project.id}`);

const results = await Promise.allSettled(
  prompts.map(async (prompt, index) => {
    console.log(
      `[${index + 1}/${prompts.length}] Starting: "${prompt.slice(0, 30)}..."`,
    );
    const screen = await project.generate(prompt);
    const htmlUrl = await screen.getHtml();
    const imageUrl = await screen.getImage();
    return { prompt, screenId: screen.id, htmlUrl, imageUrl };
  }),
);

console.log("\n=== Generation Results ===");
const successful = results
  .filter((r) => r.status === "fulfilled")
  .map((r) => (r as PromiseFulfilledResult<any>).value);
const failed = results
  .filter((r) => r.status === "rejected")
  .map((r) => (r as PromiseRejectedResult).reason);

console.log(`✅ Successfully generated: ${successful.length}`);
console.log(`❌ Failed: ${failed.length}`);

for (const success of successful) {
  console.log(`\n- Prompt: "${success.prompt}"`);
  console.log(`  Screen ID: ${success.screenId}`);
  console.log(`  Image URL: ${success.imageUrl}`);
}

if (failed.length > 0) {
  console.log("\nErrors:");
  for (const error of failed) {
    console.error("  ", error);
  }
}
