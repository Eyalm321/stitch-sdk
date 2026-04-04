import { stitch } from "@google/stitch-sdk";
import "../../_require-key.js";

async function run() {
  console.log("Fetching projects...");
  const projects = await stitch.projects();
  if (projects.length === 0) {
    console.log("No projects found. Create one first.");
    return;
  }

  const project = projects[0];
  console.log(`Using project: ${project.id}`);

  const screens = await project.screens();
  if (screens.length === 0) {
    console.log("No screens found in this project.");
    return;
  }

  console.log(`Found ${screens.length} screens. Extracting configs...`);

  const configs: any[] = [];

  for (const screen of screens.slice(0, 3)) {
    const htmlUrl = await screen.getHtml();
    if (!htmlUrl) continue;

    let html = "";
    if (htmlUrl.startsWith("http")) {
      const resp = await fetch(htmlUrl);
      html = await resp.text();
    } else {
      html = htmlUrl;
    }

    const configMatch = html.match(
      /<script id="tailwind-config">([\s\S]*?)<\/script>/,
    );
    if (configMatch && configMatch[1]) {
      try {
        // Simple extraction of the object inside the script
        const scriptContent = configMatch[1].trim();
        const objStrMatch = scriptContent.match(
          /tailwind\.config\s*=\s*({[\s\S]*});?/,
        );
        if (objStrMatch && objStrMatch[1]) {
          // We use a simple evaluation to parse the JS object literal,
          // since it's not strictly JSON.
          const configObj = new Function("return " + objStrMatch[1])();
          configs.push({ screenId: screen.id, config: configObj });
        }
      } catch (e) {
        console.error(`Failed to parse config for screen ${screen.id}:`, e);
      }
    }
  }

  console.log("\nExtracted Configs:");
  configs.forEach((c) => {
    console.log(`\n--- Screen ${c.screenId} Theme ---`);
    console.log(JSON.stringify(c.config?.theme?.extend?.colors || {}, null, 2));
  });

  console.log(
    "\n(An agent would now reconcile these into a unified design system)",
  );
}

run().catch(console.error);
