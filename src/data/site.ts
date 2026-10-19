export const site = {
  name: "Our Recipe Box",
  shortName: "Recipe Box",
  subtitle: "Recipes made and loved at home",
  description:
    "A personal digital cookbook of recipes made and loved at home — searchable, phone-friendly, and ready for the kitchen.",
  language: "en",
  quickMealMinutes: 30,
  includeDemoRecipes: true,
  showEmptyCategories: false,
  themeColor: "#2c4a3e",
  backgroundColor: "#f6f1e8",
  colors: {
    bg: "#f6f1e8",
    bgWarm: "#f3eadc",
    surface: "#fffdf8",
    primary: "#2c4a3e",
    primarySoft: "#3d5c4e",
    olive: "#6b7c59",
    accent: "#c4785a",
    text: "#2b241c",
    textMuted: "#5c5348",
    border: "#e4d9c8",
  },
} as const;

export type SiteConfig = typeof site;
