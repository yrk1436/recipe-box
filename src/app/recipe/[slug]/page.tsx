import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  ExternalLink,
  Clock,
  Users,
  ChefHat,
  Flame,
  Lightbulb,
  Play,
} from 'lucide-react';
import { getAllRecipes, getRecipeBySlug } from '@/lib/recipes';

export async function generateStaticParams() {
  const recipes = getAllRecipes();
  return recipes.map((recipe) => ({
    slug: recipe.slug,
  }));
}

function extractYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function getDifficultyStyles(difficulty: string | undefined): { bg: string; text: string; label: string } {
  switch (difficulty) {
    case 'easy': 
      return { bg: 'bg-green-50', text: 'text-green-700', label: 'Easy' };
    case 'medium': 
      return { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Medium' };
    case 'hard': 
      return { bg: 'bg-red-50', text: 'text-red-700', label: 'Hard' };
    default: 
      return { bg: 'bg-gray-50', text: 'text-gray-600', label: 'Unknown' };
  }
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  const youtubeId = extractYouTubeId(recipe.video_url);
  const hasQuickFacts = recipe.prep_time || recipe.cook_time || recipe.servings || recipe.difficulty;
  const difficultyStyles = getDifficultyStyles(recipe.difficulty);

  return (
    <article className="min-h-screen bg-[var(--background)]">
      {/* Hero Section - Full bleed */}
      <header className="relative">
        {/* Back Navigation - Fixed on mobile for easy reach */}
        <nav className="fixed sm:absolute top-16 sm:top-4 left-2 sm:left-4 z-50">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg text-sm font-medium text-[var(--foreground)] hover:bg-white transition-colors tap-target"
            aria-label="Back to all recipes"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">All Recipes</span>
          </Link>
        </nav>

        {/* Hero Image */}
        {recipe.image ? (
          <div className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] overflow-hidden">
            <img
              src={recipe.image}
              alt={`Photo of ${recipe.title}`}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
            
            {/* Favorite badge */}
            {recipe.is_favorite && (
              <div 
                className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/95 backdrop-blur-sm rounded-full shadow-lg"
                role="img"
                aria-label="Favorite recipe"
              >
                <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-[var(--accent)] text-[var(--accent)]" />
              </div>
            )}

            {/* Title overlay on hero - visible on larger screens */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 hidden sm:block">
              <div className="max-w-3xl">
                {recipe.cuisine && (
                  <p className="text-sm font-medium text-white/90 uppercase tracking-wider mb-2">
                    {recipe.cuisine}
                  </p>
                )}
                <h1 className="recipe-title text-white drop-shadow-lg">
                  {recipe.title}
                </h1>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-24 sm:h-32 bg-gradient-to-br from-[var(--secondary)] to-[var(--border)]" />
        )}
      </header>

      {/* Content Container */}
      <div className="relative -mt-6 sm:-mt-0">
        <div className="container-recipe">
          {/* Mobile Title Card - overlaps hero */}
          <div className="sm:hidden bg-[var(--card)] rounded-t-3xl shadow-xl -mt-8 pt-6 px-5">
            {recipe.cuisine && (
              <p className="text-xs font-medium text-[var(--primary)] uppercase tracking-wider mb-2">
                {recipe.cuisine}
              </p>
            )}
            <h1 className="recipe-title text-[var(--foreground)]">
              {recipe.title}
            </h1>
          </div>

          {/* Main Content Card */}
          <div className="bg-[var(--card)] sm:rounded-2xl sm:shadow-lg px-5 py-6 sm:p-8 md:p-10 sm:mt-8">
            {/* Desktop Title (when no hero image) */}
            {!recipe.image && (
              <div className="mb-8">
                {recipe.cuisine && (
                  <p className="text-xs font-medium text-[var(--primary)] uppercase tracking-wider mb-2">
                    {recipe.cuisine}
                  </p>
                )}
                <h1 className="recipe-title text-[var(--foreground)]">
                  {recipe.title}
                </h1>
              </div>
            )}

            {/* Favorite indicator for mobile (when there's no hero) */}
            {!recipe.image && recipe.is_favorite && (
              <div className="flex items-center gap-2 mb-4 text-[var(--accent)]">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">Favorite</span>
              </div>
            )}

            {/* Description */}
            {recipe.description && (
              <p className="recipe-subtitle mb-6 sm:mb-8">
                {recipe.description}
              </p>
            )}

            {/* Quick Facts Grid */}
            {hasQuickFacts && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
                {recipe.prep_time && (
                  <div className="flex flex-col items-center p-4 bg-[var(--secondary)] rounded-xl text-center">
                    <Clock className="w-5 h-5 text-[var(--muted-foreground)] mb-2" aria-hidden="true" />
                    <span className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide mb-1">Prep</span>
                    <span className="font-semibold text-[var(--foreground)]">{recipe.prep_time}</span>
                  </div>
                )}
                {recipe.cook_time && (
                  <div className="flex flex-col items-center p-4 bg-[var(--secondary)] rounded-xl text-center">
                    <Flame className="w-5 h-5 text-[var(--muted-foreground)] mb-2" aria-hidden="true" />
                    <span className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide mb-1">Cook</span>
                    <span className="font-semibold text-[var(--foreground)]">{recipe.cook_time}</span>
                  </div>
                )}
                {recipe.servings && (
                  <div className="flex flex-col items-center p-4 bg-[var(--secondary)] rounded-xl text-center">
                    <Users className="w-5 h-5 text-[var(--muted-foreground)] mb-2" aria-hidden="true" />
                    <span className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide mb-1">Serves</span>
                    <span className="font-semibold text-[var(--foreground)]">{recipe.servings}</span>
                  </div>
                )}
                {recipe.difficulty && (
                  <div className={`flex flex-col items-center p-4 ${difficultyStyles.bg} rounded-xl text-center`}>
                    <ChefHat className={`w-5 h-5 ${difficultyStyles.text} mb-2`} aria-hidden="true" />
                    <span className={`text-xs ${difficultyStyles.text} uppercase tracking-wide mb-1`}>Level</span>
                    <span className={`font-semibold ${difficultyStyles.text}`}>{difficultyStyles.label}</span>
                  </div>
                )}
              </div>
            )}

            {/* Divider */}
            {hasQuickFacts && (
              <hr className="border-[var(--border)] mb-8 sm:mb-10" />
            )}

            {/* Video Section */}
            {youtubeId && (
              <section className="mb-10 sm:mb-12" aria-labelledby="video-heading">
                <h2 id="video-heading" className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-[var(--foreground)] mb-4">
                  <Play className="w-5 h-5 text-red-500" aria-hidden="true" />
                  Watch the Recipe
                </h2>
                <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={`Video: ${recipe.title}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </section>
            )}

            {/* Ingredients Section */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <section className="mb-10 sm:mb-12" aria-labelledby="ingredients-heading">
                <h2 id="ingredients-heading" className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-6">
                  Ingredients
                </h2>
                
                <div className="space-y-6">
                  {recipe.ingredients.map((section, sectionIdx) => (
                    <div key={sectionIdx}>
                      {section.section && (
                        <h3 className="text-base font-semibold text-[var(--primary)] mb-4 pb-2 border-b border-[var(--border)]">
                          {section.section}
                        </h3>
                      )}
                      <ul className="space-y-0" role="list">
                        {section.items.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            className="ingredient-item"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Instructions Section */}
            {recipe.steps && recipe.steps.length > 0 && (
              <section className="mb-10 sm:mb-12" aria-labelledby="instructions-heading">
                <h2 id="instructions-heading" className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-6">
                  Instructions
                </h2>
                
                <ol className="space-y-6" role="list">
                  {recipe.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-4 sm:gap-5">
                      <span 
                        className="step-number"
                        aria-hidden="true"
                      >
                        {idx + 1}
                      </span>
                      <p className="flex-1 text-[var(--foreground)] leading-relaxed pt-1">
                        <span className="sr-only">Step {idx + 1}: </span>
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Tips Section */}
            {recipe.tips && recipe.tips.length > 0 && (
              <section className="mb-10 sm:mb-12" aria-labelledby="tips-heading">
                <h2 id="tips-heading" className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-[var(--foreground)] mb-4">
                  <Lightbulb className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
                  Tips & Notes
                </h2>
                
                <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-xl sm:rounded-2xl p-5 sm:p-6">
                  <ul className="space-y-3" role="list">
                    {recipe.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-[var(--accent)] mt-0.5" aria-hidden="true">•</span>
                        <span className="text-[var(--foreground)]">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Source */}
            {recipe.source_url && (
              <section className="pt-6 sm:pt-8 border-t border-[var(--border)]">
                <h2 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-3">
                  Source
                </h2>
                <a
                  href={recipe.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--primary)] font-medium hover:underline underline-offset-2 tap-target"
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {(() => {
                      try {
                        return new URL(recipe.source_url).hostname.replace('www.', '');
                      } catch {
                        return 'View original';
                      }
                    })()}
                  </span>
                </a>
              </section>
            )}

            {/* Date Added */}
            {recipe.date_added && (
              <p className="text-sm text-[var(--muted-foreground)] mt-8 pt-6 border-t border-[var(--border)]">
                Added{' '}
                <time dateTime={recipe.date_added}>
                  {new Date(recipe.date_added).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8 sm:h-16 safe-bottom" />
    </article>
  );
}
