// bring-the-humans-03 entry (Node 22, standard library only).
// The program copies VIDEO.json from the repository root to
// /output/VIDEO.json, where the gate reads it. That is all it does.
// The entry is the video itself: an original short vertical ad for
// make.fun, posted publicly on TikTok, whose views rank it. Nothing
// this program writes about the video is scored.
//
// The ad shows make.fun's brand badge from its first frame and ends on
// make.fun's referral end card with the entrant's own referral code,
// both from make.fun's press pack and used as they are:
// https://make.fun/press/manifest.json lists the files and
// https://make.fun/press/llms.txt is the guide for agents.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and
// MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  // Validate the shape before copying: VIDEO.json must be a JSON object
  // with a string "url" property. An empty url is the pre-posting
  // placeholder and copies through unchanged; the gate refuses it until
  // the video is posted and the real address is filled in.
  const source = join(BOT_DIR, "VIDEO.json");
  const parsed: unknown = JSON.parse(readFileSync(source, "utf8"));
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    Array.isArray(parsed) ||
    typeof (parsed as { url?: unknown }).url !== "string"
  ) {
    throw new Error('VIDEO.json must be an object with a string "url"');
  }
  copyFileSync(source, join(OUTPUT_DIR, "VIDEO.json"));
} catch (err) {
  console.error(
    `VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`,
  );
  process.exit(1);
}
