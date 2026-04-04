import '../_require-key.js';
import { stitch } from '@google/stitch-sdk';
import fs from 'fs/promises';
import path from 'path';

const EXPORT_DIR = path.join(process.cwd(), 'exports');

console.log('Fetching projects...');
const projects = await stitch.projects();

if (projects.length === 0) {
  console.log('No projects found.');
  process.exit(0);
}

const project = projects[0];
console.log(`Using project: ${project.id}`);

console.log('Fetching screens...');
const screens = await project.screens();

if (screens.length === 0) {
  console.log('No screens found in this project.');
  process.exit(0);
}

await fs.mkdir(EXPORT_DIR, { recursive: true });

for (let i = 0; i < Math.min(screens.length, 3); i++) {
  const screen = screens[i];
  console.log(`\nExporting screen ${screen.id}...`);

  try {
    const htmlUrl = await screen.getHtml();
    if (htmlUrl) {
      let html = htmlUrl;
      if (htmlUrl.startsWith('http')) {
        const htmlResp = await fetch(htmlUrl);
        html = await htmlResp.text();
      }
      const htmlPath = path.join(EXPORT_DIR, `${screen.id}.html`);
      await fs.writeFile(htmlPath, html, 'utf-8');
      console.log(`Saved HTML to ${htmlPath}`);
    } else {
      console.log('No HTML available for this screen.');
    }
  } catch (err) {
    console.error(`Failed to export HTML for ${screen.id}:`, err);
  }

  try {
    const imageUrl = await screen.getImage();
    if (imageUrl) {
      let imgBuffer;
      if (imageUrl.startsWith('http')) {
        const imgResp = await fetch(imageUrl);
        imgBuffer = Buffer.from(await imgResp.arrayBuffer());
      } else {
        imgBuffer = Buffer.from(imageUrl, 'base64');
      }
      const imgPath = path.join(EXPORT_DIR, `${screen.id}.png`);
      await fs.writeFile(imgPath, imgBuffer);
      console.log(`Saved screenshot to ${imgPath}`);
    } else {
      console.log('No Image URL available for this screen.');
    }
  } catch (err) {
    console.error(`Failed to export screenshot for ${screen.id}:`, err);
  }
}
console.log('\nExport complete.');
