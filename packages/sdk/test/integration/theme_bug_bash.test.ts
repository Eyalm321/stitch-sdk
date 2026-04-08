import { describe, it, expect, beforeAll } from "vitest";
import { Stitch } from "../../generated/src/stitch.js";
import { StitchToolClient } from "../../src/client.js";
import { Project } from "../../src/project-ext.js";
import * as fs from "node:fs";
import * as path from "node:path";

// Load .env if missing
if (!process.env.STITCH_API_KEY) {
  const envPath = path.resolve(import.meta.dirname, "../../../../.env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const parts = line.split("=");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join("=").trim();
        process.env[key] = value;
      }
    }
  }
}

const runIfApiKey = process.env.STITCH_API_KEY ? describe : describe.skip;

runIfApiKey("Design System Tools Bug Bash", () => {
  let sdk: Stitch;
  let client: StitchToolClient;
  let project: Project;

  beforeAll(async () => {
    client = new StitchToolClient({ apiKey: process.env.STITCH_API_KEY });
    await client.connect();
    sdk = new Stitch(client);

    // Use existing project
    const existingProjectId = "3142715389778135900";
    project = new Project(client, existingProjectId);
    console.log("Bug Bash Project ID:", project.id);
  }, 30000);

  it("should run full theme workflow", async () => {
    // Skipping generation as requested, using existing screens.
    console.log("Skipping generation, using existing screens in project.");
    
    const screens = await project.screens();
    console.log(`Found ${screens.length} screens`);
    
    let screenWithHtml;
    for (const s of screens) {
      const htmlUrl = await s.getHtml();
      if (htmlUrl) {
        screenWithHtml = s;
        break;
      }
    }

    if (!screenWithHtml && screens.length > 0) {
      console.log("Screens found but none have HTML yet. Waiting 10 seconds...");
      await new Promise(resolve => setTimeout(resolve, 10000));
      const screens2 = await project.screens();
      for (const s of screens2) {
        const htmlUrl = await s.getHtml();
        if (htmlUrl) {
          screenWithHtml = s;
          break;
        }
      }
    }
    
    if (!screenWithHtml) {
      console.log("No screens with HTML found, creating one via upload to proceed with test.");
      // Fallback to upload
      const FIXTURE_PNG = path.resolve(import.meta.dirname, "../fixtures/real-image.png");
      if (fs.existsSync(FIXTURE_PNG)) {
        const [uploadedScreen] = await project.uploadImage(FIXTURE_PNG, { title: "Fallback Screen" });
        screenWithHtml = uploadedScreen;
      } else {
        throw new Error("No screens with HTML available and fixture missing!");
      }
    }

    expect(screenWithHtml).toBeDefined();
    const screen = screenWithHtml;
    console.log("Testing with screen:", screen.id);

    console.log("Waiting for HTML to be ready...");
    let htmlUrl = await screen.getHtml();
    let attempts = 0;
    while (!htmlUrl && attempts < 20) {
      console.log(`HTML not ready yet, waiting 10 seconds (attempt ${attempts + 1}/20)...`);
      await new Promise(resolve => setTimeout(resolve, 10000));
      htmlUrl = await screen.getHtml();
      attempts++;
    }
    expect(htmlUrl).toBeTruthy();

    // 2. Infer Theme
    console.log("Inferring theme...");
    const theme = await project.inferTheme(screen.id);
    console.log("Inferred theme:", theme);
    
    expect(theme).toBeDefined();

    // 3. Theme Prompt
    console.log("Testing theme prompt...");
    const prompt = await project.themePrompt("Create a contact page", theme);
    console.log("Theme prompt:", prompt);
    expect(prompt).toContain("Create a contact page");

    // 4. Sync Theme
    console.log("Syncing theme...");
    const ds = await project.syncTheme(theme);
    console.log("Synced Design System:", ds.id);
    expect(ds.id).toBeDefined();

    // 5. Download Assets
    console.log("Downloading assets...");
    const outputDir = path.resolve(import.meta.dirname, "../temp_bash_assets");
    await project.downloadAssets(outputDir);
    console.log("Assets downloaded to:", outputDir);
    expect(fs.existsSync(outputDir)).toBe(true);
    
    // Cleanup
    fs.rmSync(outputDir, { recursive: true, force: true });
  }, 300000); // Long timeout for generation and downloads
});
