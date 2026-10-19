import type { ImageMetadata } from "astro";

const modules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/images/recipes/**/*.{jpg,jpeg,png,webp,avif}",
  { eager: true },
);

const byFilename = new Map<string, ImageMetadata>();

for (const [filePath, mod] of Object.entries(modules)) {
  const filename = filePath.split("/").pop();
  if (filename) byFilename.set(filename, mod.default);
}

export function getRecipeImage(image?: string): ImageMetadata | undefined {
  if (!image) return undefined;
  return byFilename.get(image) ?? byFilename.get(image.split("/").pop() ?? "");
}

export function publicRecipeImagePath(image?: string): string | undefined {
  if (!image) return undefined;
  const filename = image.split("/").pop();
  return filename ? `/images/recipes/${filename}` : undefined;
}
