// Copyright 2026 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import * as cheerio from 'cheerio';
import { Element } from 'domhandler';
import type { StitchToolClientSpec } from './spec/client.js';
import { DownloadAssetsInputSchema } from './spec/download.js';
import type { DownloadAssetsSpec, DownloadAssetsInput, DownloadAssetsResult } from './spec/download.js';

/** Atomically rename src → dest, falling back to copy+delete on EXDEV. */
async function atomicRename(src: string, dest: string): Promise<void> {
  try {
    await fs.rename(src, dest);
  } catch (err: any) {
    if (err?.code === 'EXDEV') {
      // Cross-device: tempDir and outputDir are on different filesystems.
      await fs.copyFile(src, dest);
      await fs.unlink(src);
    } else {
      throw err;
    }
  }
}

export class DownloadAssetsHandler implements DownloadAssetsSpec {
  constructor(private client: StitchToolClientSpec) {}

  async execute(rawInput: DownloadAssetsInput): Promise<DownloadAssetsResult> {
    try {
      const input = DownloadAssetsInputSchema.parse(rawInput);
      const {
        projectId,
        outputDir,
        fileMode,
        tempDir,
        assetsSubdir,
      } = input;
      const resolvedTempDir = tempDir ?? outputDir;
      // Guard assetsSubdir: strip any path separators — only use the basename.
      const safeSubdir = path.basename(assetsSubdir) || 'assets';
      const assetsDir = path.join(outputDir, safeSubdir);
      await fs.mkdir(assetsDir, { recursive: true });

      // 1. List screens
      const response = await this.client.callTool('list_screens', { projectId });
      const screens = (response as any).screens || [];

      const downloadedScreens: string[] = [];

      for (const screen of screens) {
        let htmlUrl = screen.htmlCode?.downloadUrl;
        if (!htmlUrl) {
          try {
            const raw = await this.client.callTool('get_screen', {
              projectId,
              screenId: screen.id,
              name: `projects/${projectId}/screens/${screen.id}`,
            });
            htmlUrl = (raw as any)?.htmlCode?.downloadUrl;
          } catch (error) {
            // Skip if we can't get full screen details
            continue;
          }
        }
        if (!htmlUrl) continue;

        const html = await fetch(htmlUrl).then((r) => r.text());
        const $ = cheerio.load(html);

        const assetPromises: Promise<void>[] = [];

        $('img').each((_, el) => {
          const src = $(el).attr('src');
          if (src && src.startsWith('http')) {
            assetPromises.push(this._downloadAndRewrite($, el, 'src', src, assetsDir, safeSubdir, resolvedTempDir, fileMode));
          }
        });

        $('link[rel="stylesheet"]').each((_, el) => {
          const href = $(el).attr('href');
          if (href && href.startsWith('http')) {
            assetPromises.push(this._downloadAndRewrite($, el, 'href', href, assetsDir, safeSubdir, resolvedTempDir, fileMode));
          }
        });

        await Promise.all(assetPromises);

        const rewrittenHtml = $.html();
        const filename = `${screen.id}.html`;
        const tempFilename = `.tmp-${crypto.randomBytes(8).toString('hex')}-${filename}`;
        const tempPath = path.join(resolvedTempDir, tempFilename);
        const targetPath = path.join(outputDir, filename);

        await fs.writeFile(tempPath, rewrittenHtml, { flag: 'wx', mode: fileMode });
        await atomicRename(tempPath, targetPath);

        downloadedScreens.push(screen.id);
      }

      return { success: true, downloadedScreens };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: error instanceof Error ? error.message : String(error),
          recoverable: false,
        },
      };
    }
  }

  private async _downloadAndRewrite(
    $: cheerio.CheerioAPI,
    el: Element,
    attr: string,
    url: string,
    assetsDir: string,
    relativePrefix: string,
    resolvedTempDir: string,
    fileMode: number,
  ): Promise<void> {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();

    const urlObj = new URL(url);
    const decodedPath = decodeURIComponent(urlObj.pathname);
    const rawFilename = path.basename(decodedPath);
    const ext = path.extname(rawFilename);
    const hash = crypto.createHash('md5').update(url).digest('hex');

    // SANITIZATION: Only allow alphanumeric, hyphen, underscore
    const sanitizedBase = sanitizeFilename(rawFilename, ext);

    const filename = sanitizedBase ? `${sanitizedBase}-${hash}${ext}` : `${hash}${ext}`;
    const fullPath = path.join(assetsDir, filename);
    const tempFilename = `.tmp-${crypto.randomBytes(8).toString('hex')}-${filename}`;
    const tempFullPath = path.join(resolvedTempDir, tempFilename);

    await fs.writeFile(tempFullPath, Buffer.from(buffer), { flag: 'wx', mode: fileMode });
    await atomicRename(tempFullPath, fullPath);

    $(el).attr(attr, `${relativePrefix}/${filename}`);
  }
}

export function sanitizeFilename(rawFilename: string, ext: string): string {
  const base = path.basename(rawFilename, ext).slice(0, 100);
  const allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
  return base
    .split('')
    .filter((c) => allowedChars.includes(c))
    .join('');
}
