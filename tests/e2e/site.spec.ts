import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { width: 320, height: 720 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
];

const recipeSlugs = [
  "banana-cake",
  "jenthikulu",
  "soft-mysore-pak",
  "demo-weeknight-dal",
  "demo-mango-lassi",
  "demo-paneer-toast",
];

const navHrefs = ["/", "/recipes/", "/categories/", "/favorites/"];

async function collectPageIssues(page: Page) {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  return {
    consoleErrors,
    async assertClean() {
      await page.waitForLoadState("domcontentloaded");
      await page.evaluate(async () => {
        const visible = [...document.images].filter((image) => {
          const rect = image.getBoundingClientRect();
          return rect.bottom > 0 && rect.top < window.innerHeight + 80 && image.src;
        });
        await Promise.all(
          visible.map((image) =>
            image.complete
              ? Promise.resolve()
              : new Promise<void>((resolve) => {
                  window.setTimeout(resolve, 4000);
                  image.addEventListener("load", () => resolve(), { once: true });
                  image.addEventListener("error", () => resolve(), { once: true });
                }),
          ),
        );
      });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      const broken = await page.evaluate(() =>
        [...document.images]
          .filter((image) => {
            const rect = image.getBoundingClientRect();
            const visible = rect.bottom > 0 && rect.top < window.innerHeight + 80;
            return visible && image.src && image.naturalWidth === 0;
          })
          .map((image) => image.src),
      );
      expect(overflow, "page should not overflow horizontally").toBe(false);
      expect(broken, "images should load").toEqual([]);
      expect(consoleErrors, "page should not log errors").toEqual([]);
    },
  };
}

test.describe("recipe URLs and navigation", () => {
  for (const viewport of viewports) {
    test(`home and recipes render at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      const home = await collectPageIssues(page);
      await page.goto("/");
      await expect(page.getByRole("heading", { name: "Our Recipe Box" })).toBeVisible();
      await home.assertClean();

      const recipes = await collectPageIssues(page);
      await page.goto("/recipes/");
      await expect(page.getByRole("heading", { name: "All recipes" })).toBeVisible();
      await recipes.assertClean();
    });
  }

  for (const slug of recipeSlugs) {
    test(`recipe /recipes/${slug}/ renders`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      const issues = await collectPageIssues(page);
      await page.goto(`/recipes/${slug}/`);
      await expect(page.locator("h1")).toBeVisible();
      await issues.assertClean();
    });
  }

  test("all primary nav links work", async ({ page }) => {
    await page.goto("/");
    for (const href of navHrefs) {
      await page.goto(href);
      await expect(page.locator("#main")).toBeVisible();
    }
  });

  test("unknown slugs show the custom 404", async ({ page }) => {
    const response = await page.goto("/recipes/does-not-exist/");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /not in this cookbook/i })).toBeVisible();
  });
});

test.describe("search, filters, favorites, cooking tools", () => {
  test("search updates from the header and finds paneer by ingredient", async ({ page }) => {
    await page.goto("/");
    const search = page.getByLabel("Search recipes");
    await search.fill("paneer");
    await expect(page.getByRole("option", { name: /paneer toast/i })).toBeVisible();
    await search.fill("zzzz-no-such-recipe");
    await expect(page.getByText(/no recipes match/i)).toBeVisible();
    await page.getByRole("button", { name: "Clear search" }).click();
    await expect(search).toHaveValue("");
  });

  test("filters combine, update the URL, and clear", async ({ page }) => {
    await page.goto("/recipes/");
    await page.getByRole("button", { name: "Dinner" }).click();
    await page.getByRole("button", { name: "Indian" }).click();
    await page.getByRole("button", { name: "vegetarian" }).click();
    await page.getByRole("button", { name: "Stovetop" }).click();
    await page.getByRole("button", { name: "Under 30 min" }).click();
    await expect(page.getByRole("heading", { name: "DEMO: Weeknight Dal" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Banana Cake" })).toHaveCount(0);
    expect(page.url()).toContain("meal=dinner");
    expect(page.url()).toContain("cuisine=Indian");
    await page.reload();
    await expect(page.getByRole("heading", { name: "DEMO: Weeknight Dal" })).toBeVisible();
    await page.getByRole("button", { name: "Clear all" }).first().click();
    await expect(page.getByRole("heading", { name: "Banana Cake" })).toBeVisible();
  });

  test("favorites persist and fail gracefully", async ({ page }) => {
    await page.goto("/recipes/banana-cake/");
    const favorite = page.getByRole("button", { name: /banana cake/i }).first();
    await favorite.click();
    await expect(favorite).toHaveAttribute("aria-pressed", "true");
    await page.goto("/favorites/");
    await expect(page.getByRole("heading", { name: "Banana Cake" })).toBeVisible();

    await page.addInitScript(() => {
      const proto = Storage.prototype;
      proto.setItem = () => {
        throw new Error("blocked");
      };
    });
    await page.goto("/recipes/banana-cake/");
    await page.getByRole("button", { name: /banana cake/i }).first().click();
    await expect(page.getByText(/could not be saved|unavailable/i)).toBeVisible();
  });

  test("checklist works on a phone-sized recipe page", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/recipes/banana-cake/");
    const first = page.locator('input[type="checkbox"]').first();
    await first.check();
    await expect(first).toBeChecked();
    await page.reload();
    await expect(page.locator('input[type="checkbox"]').first()).toBeChecked();
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(page.locator('input[type="checkbox"]').first()).not.toBeChecked();
  });

  test("scaling changes ingredient amounts but leaves 375°F alone", async ({ page }) => {
    await page.goto("/recipes/banana-cake/");
    await expect(page.getByText("375°F").first()).toBeVisible();
    await expect(page.locator("[data-ingredients]")).toContainText("1 1/4");
    await page.getByRole("button", { name: "Increase scale" }).click();
    await expect(page.locator("[data-ingredients]")).toContainText("2 1/2");
    await expect(page.getByText("375°F").first()).toBeVisible();
    await expect(page.getByText("45 minutes")).toBeVisible();
  });

  test("print view keeps title, ingredients, and steps only", async ({ page }) => {
    await page.goto("/recipes/banana-cake/");
    await page.emulateMedia({ media: "print" });
    await expect(page.getByRole("heading", { name: "Banana Cake" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ingredients" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Instructions" })).toBeVisible();
    await expect(page.locator(".site-header")).toBeHidden();
    await expect(page.locator(".bottom-nav")).toBeHidden();
    await expect(page.locator(".recipe-hero")).toBeHidden();
    await expect(page.getByRole("button", { name: "Share" })).toBeHidden();
  });
});
