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
  Timer,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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

function getDifficultyColor(difficulty: string | undefined): string {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-amber-100 text-amber-800';
    case 'hard': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-600';
  }
}

function formatTagName(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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
  const allTags = Object.values(recipe.tags || {}).flat();

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative">
        {/* Back button - floating */}
        <Link
          href="/"
          className="fixed top-20 left-4 z-50 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-amber-800 hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">All Recipes</span>
        </Link>

        {/* Hero Image */}
        {recipe.image ? (
          <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {recipe.is_favorite && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              </div>
            )}
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-br from-amber-100 to-orange-50" />
        )}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-t-3xl shadow-xl p-6 md:p-10">
          {/* Header */}
          <header className="mb-8">
            {/* Cuisine badge */}
            {recipe.cuisine && (
              <p className="text-amber-600 font-medium mb-2">{recipe.cuisine}</p>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {recipe.title}
            </h1>

            {/* Description */}
            {recipe.description && (
              <p className="text-lg text-gray-600 leading-relaxed">
                {recipe.description}
              </p>
            )}

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-amber-50 text-amber-700 hover:bg-amber-100 font-normal"
                  >
                    {formatTagName(tag)}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {/* Quick Facts */}
          {hasQuickFacts && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {recipe.prep_time && (
                  <div className="bg-amber-50 rounded-xl p-4 text-center">
                    <Clock className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                    <p className="text-xs text-amber-600 uppercase tracking-wide">Prep</p>
                    <p className="font-semibold text-gray-900">{recipe.prep_time}</p>
                  </div>
                )}
                {recipe.cook_time && (
                  <div className="bg-orange-50 rounded-xl p-4 text-center">
                    <Flame className="w-5 h-5 mx-auto text-orange-600 mb-1" />
                    <p className="text-xs text-orange-600 uppercase tracking-wide">Cook</p>
                    <p className="font-semibold text-gray-900">{recipe.cook_time}</p>
                  </div>
                )}
                {recipe.servings && (
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <Users className="w-5 h-5 mx-auto text-green-600 mb-1" />
                    <p className="text-xs text-green-600 uppercase tracking-wide">Servings</p>
                    <p className="font-semibold text-gray-900">{recipe.servings}</p>
                  </div>
                )}
                {recipe.difficulty && (
                  <div className={`rounded-xl p-4 text-center ${getDifficultyColor(recipe.difficulty)}`}>
                    <ChefHat className="w-5 h-5 mx-auto mb-1" />
                    <p className="text-xs uppercase tracking-wide">Difficulty</p>
                    <p className="font-semibold capitalize">{recipe.difficulty}</p>
                  </div>
                )}
              </div>
              <Separator className="mb-8" />
            </>
          )}

          {/* YouTube Video Embed */}
          {youtubeId && (
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-red-500" />
                Watch the Video
              </h2>
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={recipe.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          )}

          {/* Ingredients */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">🥗</span>
                Ingredients
              </h2>
              <div className="space-y-6">
                {recipe.ingredients.map((section, idx) => (
                  <div key={idx}>
                    {section.section && (
                      <h3 className="font-medium text-amber-800 mb-3 text-lg">
                        {section.section}
                      </h3>
                    )}
                    <ul className="space-y-2">
                      {section.items.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0"
                        >
                          <span className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Steps */}
          {recipe.steps && recipe.steps.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">👩‍🍳</span>
                Instructions
              </h2>
              <ol className="space-y-6">
                {recipe.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-semibold text-sm">
                      {idx + 1}
                    </span>
                    <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Tips */}
          {recipe.tips && recipe.tips.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-amber-500" />
                Tips & Notes
              </h2>
              <div className="bg-amber-50 rounded-xl p-6">
                <ul className="space-y-3">
                  {recipe.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-amber-500 mt-1">💡</span>
                      <span className="text-amber-900">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Source */}
          {recipe.source_url && (
            <section className="border-t border-gray-100 pt-8">
              <h2 className="text-lg font-medium text-gray-500 mb-3">Source</h2>
              <a
                href={recipe.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-800 font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                {(() => {
                  try {
                    return new URL(recipe.source_url).hostname.replace('www.', '');
                  } catch {
                    return 'View original';
                  }
                })()}
              </a>
            </section>
          )}

          {/* Date added */}
          {recipe.date_added && (
            <p className="text-sm text-gray-400 mt-8">
              Added {new Date(recipe.date_added).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-16 bg-white" />
    </article>
  );
}
