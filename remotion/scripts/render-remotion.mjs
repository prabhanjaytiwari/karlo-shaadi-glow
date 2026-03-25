import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("Bundling...");
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
  id: "main",
  puppeteerInstance: browser,
});

console.log(`Rendering ${composition.durationInFrames} frames...`);
const videoPath = "/tmp/video-only.mp4";
await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: videoPath,
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
});

await browser.close({ silent: false });
console.log("Video rendered. Muxing audio...");

const audioFiles = ["scene1-hook-v3","scene2-pain-v3","scene3-solution-v3","scene4-pricing-v3","scene5-cta-v3"];
const sceneDurations = [420, 345, 355, 350, 215];
const fps = 30;

let offset = 0;
const inputs = ["-i", videoPath];
const filters = [];
const amerge = [];

for (let i = 0; i < audioFiles.length; i++) {
  const audioPath = path.resolve(__dirname, `../public/voiceover/${audioFiles[i]}.mp3`);
  inputs.push("-i", audioPath);
  const delayMs = Math.round((offset / fps) * 1000);
  filters.push(`[${i + 1}:a]adelay=${delayMs}|${delayMs}[a${i}]`);
  amerge.push(`[a${i}]`);
  offset += sceneDurations[i];
}

const filterComplex = filters.join(";") + ";" + amerge.join("") + `amix=inputs=${audioFiles.length}:normalize=0[aout]`;
const outputPath = "/mnt/documents/karloshaadi-vendor-promo-v3.mp4";

execSync([
  "ffmpeg", "-y", ...inputs,
  "-filter_complex", filterComplex,
  "-map", "0:v", "-map", "[aout]",
  "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
  "-shortest", outputPath,
].map(a => `'${a}'`).join(" "), { stdio: "inherit", shell: true });

console.log(`Done! ${outputPath}`);
