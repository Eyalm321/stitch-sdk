/**
 * Demonstrates how to use Vercel AI SDK with a filtered list of Stitch tools.
 *
 * In a real scenario, you would pass `tools` to `generateText()` along with a
 * Vercel AI SDK language model. This example logs the filtered tool configuration.
 *
 * Usage:
 *   STITCH_API_KEY=your-key bun packages/sdk/examples/tool-filtering/index.ts
 */
import { stitchTools } from "@google/stitch-sdk/ai";

import "../_require-key.js";

console.log("🔍 Demonstrating Vercel AI SDK tool filtering...");

// Generate tools but ONLY provide the tools that allow reading projects/screens.
// This prevents the LLM from creating or modifying data.
const readOnlyTools = stitchTools({
  include: ["list_projects", "list_screens", "get_screen"],
});

console.log(`\n✅ Generated ${Object.keys(readOnlyTools).length} read-only tools:`);
for (const [name, tool] of Object.entries(readOnlyTools)) {
  console.log(`  - ${name}: ${tool.description?.slice(0, 80)}...`);
}

// Generate tools but ONLY provide tools related to design iteration.
const iterationTools = stitchTools({
  include: ["edit_screen", "generate_screen_variants_from_text"],
});

console.log(`\n✅ Generated ${Object.keys(iterationTools).length} iteration tools:`);
for (const [name, tool] of Object.entries(iterationTools)) {
  console.log(`  - ${name}: ${tool.description?.slice(0, 80)}...`);
}

console.log("\n💡 Usage with Vercel AI SDK:");
console.log(`
import { generateText } from "ai";

const { text } = await generateText({
  model: yourModel,
  tools: readOnlyTools, // LLM can only read, not write!
  prompt: "What projects do I have?",
  maxSteps: 5,
});
`);
