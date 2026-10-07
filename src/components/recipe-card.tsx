'use client';

import Link from 'next/link';
import { Star, Clock, Play } from 'lucide-react';
import { Recipe } from '@/lib/schema';

type RecipeCardProps = {
  recipe: Recipe;
};

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

export function RecipeCard({ recipe }: RecipeCardProps) {
  const isVideo = extractYouTubeId(recipe.video_url) || recipe.source_url?.includes('instagram.com');

  return (
    <Link 
      href={`/recipe/${recipe.slug}`}
      className="group block h-full"
    >
      <article className="relative h-full bg-[var(--card)] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 card-hover border border-[var(--border)]">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--secondary)]">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={`Photo of ${recipe.title}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--secondary)] to-[var(--border)]">
              <svg 
                className="w-16 h-16 text-[var(--muted-foreground)]/30" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                />
              </svg>
            </div>
          )}
          
          {/* Overlay Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
            {/* Favorite Badge */}
            {recipe.is_favorite && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/95 shadow-md backdrop-blur-sm">
                <Star className="w-4 h-4 fill-[var(--accent)] text-[var(--accent)]" aria-label="Favorite recipe" />
              </div>
            )}
            
            {/* Video Badge */}
            {isVideo && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-full ml-auto">
                <Play className="w-3 h-3 fill-current" aria-hidden="true" />
                <span>Video</span>
              </div>
            )}
          </div>

          {/* Time Badge */}
          {recipe.total_time && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-[var(--foreground)] text-xs font-medium rounded-full shadow-md">
              <Clock className="w-3 h-3" aria-hidden="true" />
              <span>{recipe.total_time}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Meta line */}
          {(recipe.cuisine || recipe.difficulty) && (
            <div className="flex items-center gap-2 mb-2">
              {recipe.cuisine && (
                <span className="text-xs font-medium text-[var(--primary)] uppercase tracking-wide">
                  {recipe.cuisine}
                </span>
              )}
              {recipe.cuisine && recipe.difficulty && (
                <span className="w-1 h-1 rounded-full bg-[var(--border)]" aria-hidden="true" />
              )}
              {recipe.difficulty && (
                <span className={`text-xs font-medium uppercase tracking-wide ${
                  recipe.difficulty === 'easy' ? 'text-green-600' :
                  recipe.difficulty === 'medium' ? 'text-amber-600' :
                  'text-red-600'
                }`}>
                  {recipe.difficulty}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h2 className="text-lg sm:text-xl font-semibold text-[var(--foreground)] leading-snug mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
            {recipe.title}
          </h2>

          {/* Description */}
          {recipe.description && (
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed line-clamp-2">
              {recipe.description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
