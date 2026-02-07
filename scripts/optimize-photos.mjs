import sharp from "sharp";
import { readdirSync, mkdirSync } from "fs";
import { join } from "path";

const inputDir = "public/photos";
const thumbDir = "public/photos/thumb";
const fullDir = "public/photos/full";

mkdirSync(thumbDir, { recursive: true });
mkdirSync(fullDir, { recursive: true });

const files = readdirSync(inputDir).filter((f) => f.endsWith(".jpg"));

for (const file of files) {
  const name = file.replace(".jpg", ".webp");
  const input = join(inputDir, file);

  // Thumbnail: 640px wide
  await sharp(input)
    .resize(640)
    .webp({ quality: 80 })
    .toFile(join(thumbDir, name));

  // Full-res: 1920px wide
  await sharp(input)
    .resize(1920)
    .webp({ quality: 85 })
    .toFile(join(fullDir, name));

  const thumbStat = (await import("fs")).statSync(join(thumbDir, name));
  const fullStat = (await import("fs")).statSync(join(fullDir, name));
  console.log(
    `${file} → thumb: ${(thumbStat.size / 1024).toFixed(0)}KB, full: ${(fullStat.size / 1024).toFixed(0)}KB`
  );
}

console.log("\nDone!");
