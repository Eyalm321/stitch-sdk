import '../_require-key.js';
import { stitch } from '@google/stitch-sdk';

const projectResponse = await stitch.callTool<any>('create_project', { title: 'Basic Design Example Project' });
const project = stitch.project(projectResponse.name);
console.log('Project created:', project.id);

const prompt = 'A simple landing page with a hero section, feature highlights, and a footer.';
console.log('Generating screen with prompt:', prompt);
const screen = await project.generate(prompt);
console.log('Screen generated:', screen.id);

const htmlUrl = await screen.getHtml();
console.log('HTML URL:', htmlUrl);

const imageUrl = await screen.getImage();
console.log('Image URL:', imageUrl);

console.log('Done!');
