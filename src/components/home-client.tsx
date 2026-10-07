'use client';

import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Search, Star, ChefHat, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RecipeCard } from '@/components/recipe-card';
import { Recipe, TAG_CATEGORIES, TagCategory } from '@/lib/schema';

type HomeClientProps = {
  recipes: Recipe[];
  usedTags: Record<TagCategory, string[]>;
};

function formatTagName(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function HomeClient({ recipes, usedTags }: HomeClientProps) {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [showFavorites, setShowFavorites] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['meal', 'cuisine']));
  const [showFilters, setShowFilters] = useState(false);

  // Set up Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    const allIngredients = (recipe: Recipe) => 
      (recipe.ingredients || []).flatMap(s => s.items).join(' ');
    const allTags = (recipe: Recipe) => 
      Object.values(recipe.tags || {}).flat().join(' ');

    return new Fuse(recipes, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.2 },
        { name: 'cuisine', weight: 0.15 },
        { name: 'ingredientsText', weight: 0.15, getFn: allIngredients },
        { name: 'tagsText', weight: 0.1, getFn: allTags },
      ],
      threshold: 0.4,
      ignoreLocation: true,
    });
  }, [recipes]);

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    let result = recipes;

    // Text search
    if (search.trim()) {
      const searchResults = fuse.search(search.trim());
      result = searchResults.map(r => r.item);
    }

    // Tag filtering
    if (selectedTags.size > 0) {
      result = result.filter(recipe => {
        const recipeTags = new Set(Object.values(recipe.tags || {}).flat());
        return Array.from(selectedTags).every(tag => recipeTags.has(tag));
      });
    }

    // Favorites filter
    if (showFavorites) {
      result = result.filter(r => r.is_favorite);
    }

    return result;
  }, [recipes, search, selectedTags, showFavorites, fuse]);

  function toggleTag(slug: string) {
    const newTags = new Set(selectedTags);
    if (newTags.has(slug)) {
      newTags.delete(slug);
    } else {
      newTags.add(slug);
    }
    setSelectedTags(newTags);
  }

  function toggleCategory(categoryId: string) {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  }

  function clearFilters() {
    setSearch('');
    setSelectedTags(new Set());
    setShowFavorites(false);
  }

  const hasFilters = search || selectedTags.size > 0 || showFavorites;
  const hasAnyTags = Object.values(usedTags).some(tags => tags.length > 0);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-b from-amber-50 to-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4 tracking-tight">
            Our Recipe Collection
          </h2>
          <p className="text-lg text-amber-700 max-w-2xl mx-auto">
            A curated collection of favorite recipes from around the kitchen
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="sticky top-[73px] z-40 bg-white/95 backdrop-blur-sm py-4 -mx-4 px-4 mb-6 border-b border-amber-100">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                <Input
                  type="search"
                  placeholder="Search recipes, ingredients, tags..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 bg-amber-50/50 border-amber-200 text-base h-12 rounded-xl focus:bg-white"
                />
              </div>
              <Button
                variant={showFavorites ? 'default' : 'outline'}
                onClick={() => setShowFavorites(!showFavorites)}
                className={`h-12 px-4 rounded-xl ${showFavorites ? 'bg-amber-500 hover:bg-amber-600' : 'border-amber-200 hover:bg-amber-50'}`}
              >
                <Star className={`w-5 h-5 ${showFavorites ? 'fill-white' : ''}`} />
                <span className="ml-2 hidden sm:inline">Favorites</span>
              </Button>
              {hasAnyTags && (
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`h-12 px-4 rounded-xl border-amber-200 ${showFilters ? 'bg-amber-100' : 'hover:bg-amber-50'}`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="ml-2 hidden sm:inline">Filters</span>
                  {selectedTags.size > 0 && (
                    <Badge className="ml-2 bg-amber-500 text-white text-xs">
                      {selectedTags.size}
                    </Badge>
                  )}
                </Button>
              )}
            </div>

            {/* Active filters */}
            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-amber-600">Active:</span>
                {showFavorites && (
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-800 cursor-pointer hover:bg-amber-200"
                    onClick={() => setShowFavorites(false)}
                  >
                    Favorites
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                {Array.from(selectedTags).map(slug => (
                  <Badge
                    key={slug}
                    variant="secondary"
                    className="bg-amber-100 text-amber-800 cursor-pointer hover:bg-amber-200"
                    onClick={() => toggleTag(slug)}
                  >
                    {formatTagName(slug)}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-sm text-amber-600 hover:text-amber-800 underline ml-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && hasAnyTags && (
          <div className="bg-amber-50/50 rounded-2xl p-6 mb-8 border border-amber-100">
            <h3 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filter by Category
            </h3>
            <div className="space-y-4">
              {TAG_CATEGORIES.map((category) => {
                const categoryTags = usedTags[category.id] || [];
                if (categoryTags.length === 0) return null;
                
                const isExpanded = expandedCategories.has(category.id);
                const selectedInCategory = categoryTags.filter(t => selectedTags.has(t)).length;

                return (
                  <div key={category.id} className="border-b border-amber-100 pb-4 last:border-0 last:pb-0">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="flex items-center justify-between w-full text-left mb-2"
                    >
                      <span className="font-medium text-amber-800 flex items-center gap-2">
                        <span>{category.icon}</span>
                        {category.name}
                        {selectedInCategory > 0 && (
                          <Badge className="bg-amber-500 text-white text-xs">
                            {selectedInCategory}
                          </Badge>
                        )}
                      </span>
                      <span className="text-amber-400 text-sm">
                        {isExpanded ? '−' : '+'}
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {categoryTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`text-sm px-3 py-1.5 rounded-full transition-all ${
                              selectedTags.has(tag)
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'bg-white text-amber-700 hover:bg-amber-100 border border-amber-200'
                            }`}
                          >
                            {formatTagName(tag)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Results */}
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-20">
            {hasFilters ? (
              <div className="max-w-md mx-auto">
                <Search className="w-16 h-16 mx-auto text-amber-200 mb-6" />
                <h3 className="text-2xl font-semibold text-amber-800 mb-3">
                  No recipes found
                </h3>
                <p className="text-amber-600 mb-6">
                  Try adjusting your search or removing some filters
                </p>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="border-amber-300 hover:bg-amber-50"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <ChefHat className="w-20 h-20 mx-auto text-amber-200 mb-6" />
                <h3 className="text-2xl font-semibold text-amber-800 mb-3">
                  No recipes yet
                </h3>
                <p className="text-amber-600">
                  Add recipe files to <code className="bg-amber-100 px-1 rounded">content/recipes/</code> to get started.
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-amber-700">
                <span className="font-semibold text-amber-900">{filteredRecipes.length}</span>
                {' '}recipe{filteredRecipes.length !== 1 ? 's' : ''}
                {hasFilters ? ' found' : ' in collection'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.slug} recipe={recipe} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
