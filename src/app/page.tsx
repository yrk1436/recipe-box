import { getAllRecipes, getUsedTags } from '@/lib/recipes';
import { HomeClient } from '@/components/home-client';

export default function HomePage() {
  const recipes = getAllRecipes();
  const usedTags = getUsedTags();
  
  return <HomeClient recipes={recipes} usedTags={usedTags} />;
}
