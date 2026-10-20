# Our Recipe Box

A static, phone-first cookbook for recipes made and loved at home. There is no database, account, or editor. Each recipe is a structured file in Git. Search, filters, favorites, checklists, and serving scaling run in the browser.

This is Stage 1: the site, design system, and pages, with **Banana Cake**, **Jenthikulu**, and **Soft Mysore Pak** as the real household recipes. A few clearly labelled DEMO recipes exist only so filters can be tried. Recipe import from Apple Notes is Stage 2; the workflow is documented below.

## Stack

- Astro + TypeScript (strict)
- Custom CSS with design tokens
- Lightweight client JavaScript
- Zod-validated content collections
- Vitest unit tests and Playwright browser tests
- Static hosting on Vercel

No runtime third-party APIs, analytics, or tracking.

## Branding

Change the cookbook name, subtitle, and colors in one place:

- `src/data/site.ts`

Type, spacing, borders, and shadows live in `src/styles/tokens.css`. The layout reads those CSS variables.

## Scripts

```bash
npm install
npm run icons          # generate apple-touch-icon and PWA icons
npm run dev            # http://localhost:4321
npm run check          # astro check / TypeScript
npm run lint
npm test               # Vitest
npm run build
npm run preview
npm run test:e2e       # Playwright, builds first
```

## Adding a recipe

1. Copy `src/data/recipes/_example.yml` to `src/data/recipes/your-slug.yml`.
2. Fill in only what you know. Leave servings, times, difficulty, and similar fields out if the note does not have them. Do not invent quantities.
3. Put a photo at `src/assets/images/recipes/your-photo.jpg` and the same file at `public/images/recipes/your-photo.jpg`. Set `image` to the filename.
4. Run `npm run check` and `npm run build`. The build fails on missing slugs, duplicate ids, bad ingredients, or broken local image paths.
5. Commit and push. Vercel rebuilds the static site.

Files that start with `_` are templates and are not published.

## Demo recipes

Three labelled DEMO recipes live in `src/data/recipes/demo/`. They are trivial on purpose.

To remove them:

1. Delete `src/data/recipes/demo/`.
2. Set `includeDemoRecipes: false` in `src/data/site.ts`.

## Apple Notes import (Stage 2)

There is no import button on the site. The content model is written to tolerate informal notes: missing quantities, paragraph instructions, “to taste”, personal comments, substitutions, mixed English and Indian names, alternate spellings, and a source URL.

Suggested workflow when Stage 2 begins:

1. Copy or export the note from Apple Notes.
2. Map it onto `_example.yml`. Keep the original wording.
3. If a line has no amount, leave `quantity` empty and set `scalable: false`.
4. Review anything ambiguous — ranges, “some”, “a bit” — and flag it in a tip rather than guessing.
5. Add a photo if you have one.
6. Commit the YAML and photo.

## Features

- Home with featured recipe, category tiles, recently added, quick meals, and favorites when they exist
- `/recipes/` search and combined filters, shareable query params, no reload
- Static `/recipes/[slug]/` pages with checklist, scaling, share, print, related recipes, and an optional cook mode
- Category pages from `src/data/categories.ts`
- `/favorites/` stored in this browser only
- Custom 404
- Installable from an iPhone home screen (manifest, apple-touch-icon, standalone display). Offline caching is not claimed.

Favorites, checklists, and scaling still leave the recipes readable if JavaScript or `localStorage` is unavailable.

## Deploy

The site is static. On Vercel, connect the GitHub repo and leave the framework as Astro. Nested recipe URLs are real HTML files, so a refresh of `/recipes/banana-cake/` works.

Production URL is picked up from Vercel (`VERCEL_PROJECT_PRODUCTION_URL`) for canonical links and the sitemap.

## Tests

- Unit tests cover quantity parsing, scaling, search, filters, sort, URL state, validation, and favorites storage failure.
- Playwright covers recipe URLs, nav, filters, search, favorites, checklists, scaling, print, and the listed viewport widths.

## License

Recipe text in this repo is for the family’s home cookbook. The Banana Cake photo is a homemade loaf from the family kitchen. Other recipe photos are credited on each recipe page.
