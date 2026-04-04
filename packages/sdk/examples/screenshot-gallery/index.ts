import { stitch } from "@google/stitch-sdk";
import fs from "fs/promises";
import path from "path";
import "../_require-key.js";

async function run() {
  const projects = await stitch.projects();
  if (projects.length === 0) {
    console.log("No projects found.");
    return;
  }

  // Use the first project for demonstration
  const project = projects[0];
  console.log(`Loading screens for project: ${project.id}...`);

  const screens = await project.screens();
  if (screens.length === 0) {
    console.log("No screens found in this project.");
    return;
  }

  console.log(`Found ${screens.length} screens. Collecting image URLs...`);

  const galleryItems = [];
  for (const screen of screens) {
    try {
      const imageUrl = await screen.getImage();
      if (imageUrl) {
        galleryItems.push({
          id: screen.id,
          imageUrl
        });
      }
    } catch (err) {
      console.warn(`Failed to get image for screen ${screen.id}:`, err);
    }
  }

  if (galleryItems.length === 0) {
    console.log("No image URLs could be retrieved.");
    return;
  }

  console.log(`Collected ${galleryItems.length} screenshots. Generating HTML...`);

  // Generate a simple HTML gallery
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Screenshot Gallery - ${project.id}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 2rem;
      background-color: #f3f4f6;
      color: #1f2937;
    }
    h1 {
      text-align: center;
      margin-bottom: 2rem;
    }
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }
    .gallery-item {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: transform 0.2s;
    }
    .gallery-item:hover {
      transform: translateY(-4px);
    }
    .gallery-image {
      width: 100%;
      height: 250px;
      object-fit: cover;
      object-position: top;
      border-bottom: 1px solid #e5e7eb;
    }
    .gallery-caption {
      padding: 1rem;
      text-align: center;
      font-size: 0.875rem;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <h1>Project Screenshot Gallery</h1>
  <div class="gallery">
    ${galleryItems.map(item => `
    <div class="gallery-item">
      <a href="${item.imageUrl}" target="_blank">
        <img class="gallery-image" src="${item.imageUrl}" alt="Screenshot of screen ${item.id}" loading="lazy">
      </a>
      <div class="gallery-caption">Screen: ${item.id}</div>
    </div>
    `).join("")}
  </div>
</body>
</html>
`;

  const outputPath = path.join(process.cwd(), "gallery.html");
  await fs.writeFile(outputPath, html, "utf-8");

  console.log(`\nSuccess! Generated gallery with ${galleryItems.length} screenshots.`);
  console.log(`Open ${outputPath} in your browser to view it.`);
}

run().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
