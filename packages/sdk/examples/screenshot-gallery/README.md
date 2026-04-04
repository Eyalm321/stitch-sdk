# Screenshot Gallery

This example demonstrates how to iterate over screens in a Stitch project, retrieve their screenshot URLs, and generate a simple HTML gallery page to view them.

This is a deterministic **Script** example (no agent needed) that shows how to batch-process screen data.

## Features demonstrated

* Listing projects with `stitch.projects()`
* Listing screens in a project with `project.screens()`
* Fetching screenshot CDN URLs with `screen.getImage()`
* Generating static HTML from SDK data

## Prerequisites

1. Set your `STITCH_API_KEY` environment variable
2. You must have at least one project with generated screens in your account

## Run the example

```bash
cd packages/sdk/examples/screenshot-gallery
bun index.ts
```

This will create a `gallery.html` file in your current directory. Open it in any web browser to see the gallery.
