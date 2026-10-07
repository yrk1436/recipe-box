'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

function formatTagName(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const isVideo = extractYouTubeId(recipe.video_url) || recipe.source_url?.includes('instagram.com');
  const allTags = Object.values(recipe.tags || {}).flat();

  return (
    <Link href={`/recipe/${recipe.slug}`}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-md h-full">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-50 overflow-hidden">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-20 h-20 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
          
          {/* Overlay badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {recipe.is_favorite && (
              <div className="bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
            )}
            {isVideo && (
              <div className="bg-black/75 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 ml-auto">
                <Play className="w-3 h-3 fill-current" />
                Video
              </div>
            )}
          </div>

          {/* Time badge */}
          {recipe.total_time && (
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-amber-800 text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <Clock className="w-3 h-3" />
              {recipe.total_time}
            </div>
          )}
        </div>

        <CardContent className="p-5">
          {/* Cuisine & Difficulty */}
          {(recipe.cuisine || recipe.difficulty) && (
            <div className="flex items-center gap-2 text-xs text-amber-600 mb-2">
              {recipe.cuisine && <span>{recipe.cuisine}</span>}
              {recipe.cuisine && recipe.difficulty && <span>•</span>}
              {recipe.difficulty && (
                <span className="capitalize">{recipe.difficulty}</span>
              )}
            </div>
          )}

          <h3 className="font-semibold text-gray-900 line-clamp-2 text-lg leading-snug mb-2 group-hover:text-amber-700 transition-colors">
            {recipe.title}
          </h3>

          {recipe.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
              {recipe.description}
            </p>
          )}

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
              {allTags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 font-normal"
                >
                  {formatTagName(tag)}
                </Badge>
              ))}
              {allTags.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500 font-normal">
                  +{allTags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
