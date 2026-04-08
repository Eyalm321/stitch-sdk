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

import { z } from 'zod';
import type { StitchToolClientSpec } from './client.js';

// ── Input ──────────────────────────────────────────────────────────────────────

export const DownloadAssetsInputSchema = z.object({
  /** The ID of the project to download assets for. */
  projectId: z.string().min(1),
  /** Absolute path to the directory where screens and assets should be saved. */
  outputDir: z.string().min(1),
});

export type DownloadAssetsInput = z.infer<typeof DownloadAssetsInputSchema>;

// ── Error Codes ────────────────────────────────────────────────────────────────

export const DownloadAssetsErrorCode = z.enum([
  'PROJECT_NOT_FOUND',
  'FETCH_FAILED',
  'WRITE_FAILED',
  'PATH_TRAVERSAL_ATTEMPT',
  'UNKNOWN_ERROR',
]);

export type DownloadAssetsErrorCode = z.infer<typeof DownloadAssetsErrorCode>;

// ── Result ─────────────────────────────────────────────────────────────────────

export type DownloadAssetsResult =
  | { success: true; downloadedScreens: string[] }
  | {
      success: false;
      error: {
        code: DownloadAssetsErrorCode;
        message: string;
        recoverable: boolean;
      };
    };

// ── Interface ──────────────────────────────────────────────────────────────────

/**
 * Contract for the downloadAssets operation.
 * Implementations must never throw — all failures return DownloadAssetsResult.
 */
export interface DownloadAssetsSpec {
  execute(input: DownloadAssetsInput): Promise<DownloadAssetsResult>;
}
