import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="72" fill="#2c4a3e"/>
  <text x="256" y="340" text-anchor="middle" font-family="Georgia, serif" font-size="280" fill="#f6f1e8">R</text>
</svg>`;

const out = path.resolve("public");
await mkdir(out, { recursive: true });

async function writePng(file, size) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(out, file));
}

await writePng("apple-touch-icon.png", 180);
await writePng("icon-192.png", 192);
await writePng("icon-512.png", 512);
console.log("Wrote app icons to public/");
