import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("Bundling event video...");
const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (config) => config,
});

console.log("Opening browser...");
const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/nix/var/nix/profiles/sandbox/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

const composition = await selectComposition({
  serveUrl: bundled,
  id: "event",
  puppeteerInstance: browser,
});

console.log(`Rendering ${composition.durationInFrames} frames (muted)...`);
const videoOnly = "/tmp/event-video-only.mp4";
await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: videoOnly,
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
});

await browser.close({ silent: false });
console.log("Video rendered. Muxing background music...");

const audioPath = path.resolve(__dirname, "../public/audio/event-bgm.mp3");
const outputPath = "/mnt/documents/karloshaadi-wedding-event-promo.mp4";

execSync(`ffmpeg -y -i '${videoOnly}' -i '${audioPath}' -c:v copy -c:a aac -b:a 192k -shortest '${outputPath}'`, { stdio: "inherit" });

console.log(`Done! ${outputPath}`);
