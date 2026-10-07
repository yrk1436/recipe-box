# Recipe Collection

A beautiful, mobile-friendly static recipe website. Recipes are stored as content files in the repository — no database needed. Just add a file, push, and the site rebuilds.

## Features

- **Magazine-style recipe pages** with hero images, structured ingredients/steps, embedded YouTube videos
- **Fast client-side search** using Fuse.js fuzzy search across titles, ingredients, and tags
- **Category-based filtering** with tags organized by: Meal, Cuisine, Diet, Main Ingredient, Time, Occasion
- **Favorites** highlighting
- **Mobile-first design** with large tap targets and readable text
- **Fully static** — deploys to Vercel, GitHub Pages, Netlify, etc.
- **No database, no API, no env vars** — everything is in the repo

## Tech Stack

- **Next.js 14** (App Router, TypeScript, Static Export)
- **Tailwind CSS** + **shadcn/ui** for styling
- **Fuse.js** for client-side search
- **Zod** for build-time schema validation

---

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd recipe-collection
npm install
```

### 2. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Build for Production

```bash
npm run build
```

The static site is output to the `out/` directory.

---

## Adding a Recipe

### 1. Create the Recipe File

Copy the template:

```bash
cp content/recipes/_template.mdx content/recipes/my-new-recipe.mdx
```

The filename should match your slug (e.g., `garlic-butter-shrimp.mdx` for slug `garlic-butter-shrimp`).

### 2. Add an Image

Create a folder for your recipe's images:

```bash
mkdir -p public/recipes/my-new-recipe
```

Add your hero image (recommended: 800x600 or similar 4:3 aspect ratio):

```
public/recipes/my-new-recipe/hero.jpg
```

Reference it in your recipe frontmatter:

```yaml
image: "/recipes/my-new-recipe/hero.jpg"
```

### 3. Fill in the Recipe

Edit your `.mdx` file with the recipe details. See the template below for all available fields.

### 4. Build and Deploy

```bash
npm run build  # Validates all recipes
git add .
git commit -m "Add garlic butter shrimp recipe"
git push
```

The site automatically rebuilds on push (if using Vercel/Netlify).

---

## Recipe Template

```yaml
---
title: "Recipe Title"
slug: "recipe-slug"
description: "A brief, enticing description."

image: "/recipes/recipe-slug/hero.jpg"

source_url: null  # Original recipe URL (optional)
video_url: null   # YouTube URL for embedded video (optional)

prep_time: "15 min"
cook_time: "30 min"
total_time: "45 min"
servings: "4 servings"
difficulty: easy  # easy, medium, or hard
cuisine: "Italian"

date_added: "2024-10-07"
is_favorite: false

tags:
  meal:
    - dinner
  cuisine:
    - italian
  diet: []
  main_ingredient:
    - pasta
  time:
    - under-1-hour
  occasion:
    - weeknight

ingredients:
  - section: null  # null for no section header
    items:
      - "1 lb pasta"
      - "2 tbsp olive oil"
  - section: "For the Sauce"
    items:
      - "3 cloves garlic"
      - "1 cup tomatoes"

steps:
  - "First step."
  - "Second step."
  - "Third step."

tips:
  - "Helpful tip"
  - "Another tip"
---

Optional content below frontmatter appears at bottom of recipe page.
```

---

## Full Recipe Example

Here's a complete example you can copy:

```yaml
---
title: "Garlic Butter Shrimp Pasta"
slug: "garlic-butter-shrimp-pasta"
description: "Quick, flavorful weeknight pasta with succulent garlic butter shrimp. Ready in under 30 minutes!"

image: "/recipes/garlic-butter-shrimp-pasta/hero.jpg"

source_url: "https://example.com/shrimp-pasta"
video_url: null

prep_time: "10 min"
cook_time: "20 min"
total_time: "30 min"
servings: "4 servings"
difficulty: easy
cuisine: "Italian"

date_added: "2024-10-07"
is_favorite: true

tags:
  meal:
    - dinner
  cuisine:
    - italian
  diet: []
  main_ingredient:
    - shrimp
    - pasta
  time:
    - under-30-min
  occasion:
    - weeknight
    - date-night

ingredients:
  - section: null
    items:
      - "1 lb linguine"
      - "1 lb large shrimp, peeled and deveined"
      - "6 cloves garlic, minced"
      - "4 tbsp butter"
      - "1/4 cup white wine"
      - "Juice of 1 lemon"
      - "Red pepper flakes to taste"
      - "Fresh parsley, chopped"
      - "Salt and pepper"

steps:
  - "Cook pasta according to package directions. Reserve 1 cup pasta water before draining."
  - "Season shrimp with salt and pepper. In a large skillet, melt 2 tbsp butter over medium-high heat."
  - "Add shrimp and cook 2-3 minutes per side until pink. Remove and set aside."
  - "Add remaining butter and garlic to the pan. Cook 1 minute until fragrant."
  - "Add white wine and lemon juice. Simmer 2 minutes."
  - "Toss in pasta and shrimp. Add pasta water as needed for a silky sauce."
  - "Season with red pepper flakes, salt, and pepper. Garnish with parsley."

tips:
  - "Don't overcook the shrimp - they cook fast!"
  - "The pasta water is key for a glossy sauce"
  - "Add more garlic if you're a garlic lover"
---
```

---

## Tag Vocabulary

Tags must be from the vocabulary in `content/tags.yml`. The build fails if you use an unknown tag (this keeps tags consistent).

### Available Tags by Category

**Meal:** breakfast, lunch, dinner, snack, dessert, appetizer, brunch, side-dish

**Cuisine:** indian, italian, mexican, chinese, thai, japanese, mediterranean, american, french, korean, vietnamese, middle-eastern, greek, spanish

**Diet:** vegetarian, vegan, eggless, gluten-free, dairy-free, keto, low-carb, paleo, whole30, nut-free

**Main Ingredient:** chicken, beef, pork, lamb, seafood, fish, shrimp, tofu, eggs, pasta, rice, noodles, vegetables, beans, lentils, cheese, chocolate

**Time:** under-15-min, under-30-min, under-1-hour, over-1-hour, meal-prep, make-ahead, slow-cooker, instant-pot

**Occasion:** weeknight, date-night, party, holiday, thanksgiving, christmas, summer, comfort-food, healthy, kid-friendly, potluck, picnic

### Adding New Tags

Edit `content/tags.yml` to add new tags before using them:

```yaml
cuisine:
  - indian
  - italian
  - my-new-cuisine  # Add here first
```

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Deploy! (No env vars needed)

Vercel will automatically rebuild when you push changes.

### GitHub Pages

1. Add to your `package.json`:
   ```json
   "scripts": {
     "deploy": "next build && touch out/.nojekyll"
   }
   ```

2. Push the `out/` directory to your `gh-pages` branch, or configure GitHub Actions.

### Netlify

1. Connect your repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `out`

---

## Project Structure

```
├── content/
│   ├── recipes/           # Recipe MDX files
│   │   ├── _template.mdx  # Copy this for new recipes
│   │   ├── classic-butter-chicken.mdx
│   │   └── berry-smoothie-bowl.mdx
│   └── tags.yml           # Tag vocabulary
├── public/
│   └── recipes/           # Recipe images
│       ├── classic-butter-chicken/
│       │   └── hero.svg
│       └── berry-smoothie-bowl/
│           └── hero.svg
├── src/
│   ├── app/               # Next.js pages
│   ├── components/        # React components
│   └── lib/
│       ├── recipes.ts     # Recipe loader
│       └── schema.ts      # Zod validation schema
└── next.config.ts         # Static export config
```

---

## Build Validation

The build validates all recipes and fails with clear errors if:

- Required fields are missing (title, slug)
- Slug format is invalid (must be lowercase with hyphens)
- Unknown tags are used (not in `content/tags.yml`)
- JSON/YAML syntax errors in frontmatter

Example error:
```
❌ my-recipe.mdx:
  - slug: Slug must be lowercase with hyphens only
  - Unknown tag "invalid-tag" in category "meal". Add it to content/tags.yml first.
```

---

## License

MIT
