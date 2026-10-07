'use client';

import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Search, Star, ChefHat, X, Filter } from 'lucide-react';
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

  const filteredRecipes = useMemo(() => {
    let result = recipes;

    if (search.trim()) {
      const searchResults = fuse.search(search.trim());
      result = searchResults.map(r => r.item);
    }

    if (selectedTags.size > 0) {
      result = result.filter(recipe => {
        const recipeTags = new Set(Object.values(recipe.tags || {}).flat());
        return Array.from(selectedTags).every(tag => recipeTags.has(tag));
      });
    }

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
      {/* Hero Section - Magazine style */}
      <section className="relative bg-[var(--secondary)] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)] mb-3 sm:mb-4">
              Recipe Collection
            </h1>
            <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
              A curated collection of tried-and-true recipes for every occasion.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters - Sticky on mobile */}
      <div className="sticky top-14 sm:top-16 z-40 bg-[var(--background)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {/* Search Bar */}
          <div className="flex gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search 
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[var(--muted-foreground)]" 
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 sm:h-12 pl-10 sm:pl-12 pr-4 bg-[var(--card)] border border-[var(--border)] rounded-xl text-base placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-shadow"
                aria-label="Search recipes"
              />
            </div>
            
            {/* Favorites Button */}
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`flex items-center justify-center h-11 sm:h-12 px-3 sm:px-4 rounded-xl border transition-all tap-target ${
                showFavorites 
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]' 
                  : 'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--secondary)]'
              }`}
              aria-pressed={showFavorites}
              aria-label={showFavorites ? "Show all recipes" : "Show favorites only"}
            >
              <Star className={`w-4 h-4 sm:w-5 sm:h-5 ${showFavorites ? 'fill-current' : ''}`} />
              <span className="ml-2 text-sm font-medium hidden sm:inline">Favorites</span>
            </button>

            {/* Filters Button */}
            {hasAnyTags && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center h-11 sm:h-12 px-3 sm:px-4 rounded-xl border transition-all tap-target ${
                  showFilters || selectedTags.size > 0
                    ? 'bg-[var(--secondary)] border-[var(--primary)]/30 text-[var(--foreground)]' 
                    : 'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--secondary)]'
                }`}
                aria-expanded={showFilters}
                aria-label="Toggle filters"
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                {selectedTags.size > 0 && (
                  <span className="ml-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-[var(--primary)] text-white text-xs font-medium">
                    {selectedTags.size}
                  </span>
                )}
                <span className="ml-2 text-sm font-medium hidden sm:inline">Filters</span>
              </button>
            )}
          </div>

          {/* Active Filters Pills */}
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[var(--border)]">
              <span className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">Active:</span>
              
              {showFavorites && (
                <button
                  onClick={() => setShowFavorites(false)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--secondary)] text-[var(--secondary-foreground)] rounded-full text-sm hover:bg-[var(--border)] transition-colors"
                >
                  <Star className="w-3 h-3 fill-current" />
                  Favorites
                  <X className="w-3 h-3 ml-0.5" />
                </button>
              )}
              
              {Array.from(selectedTags).map(slug => (
                <button
                  key={slug}
                  onClick={() => toggleTag(slug)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--secondary)] text-[var(--secondary-foreground)] rounded-full text-sm hover:bg-[var(--border)] transition-colors"
                >
                  {formatTagName(slug)}
                  <X className="w-3 h-3 ml-0.5" />
                </button>
              ))}
              
              <button
                onClick={clearFilters}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline underline-offset-2 ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Panel - Expandable */}
      {showFilters && hasAnyTags && (
        <div className="bg-[var(--card)] border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
            <div className="space-y-4">
              {TAG_CATEGORIES.map((category) => {
                const categoryTags = usedTags[category.id] || [];
                if (categoryTags.length === 0) return null;
                
                const isExpanded = expandedCategories.has(category.id);
                const selectedInCategory = categoryTags.filter(t => selectedTags.has(t)).length;

                return (
                  <div key={category.id}>
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="flex items-center justify-between w-full text-left py-2 tap-target"
                      aria-expanded={isExpanded}
                    >
                      <span className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                        <span aria-hidden="true">{category.icon}</span>
                        {category.name}
                        {selectedInCategory > 0 && (
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--primary)] text-white text-xs">
                            {selectedInCategory}
                          </span>
                        )}
                      </span>
                      <svg 
                        className={`w-4 h-4 text-[var(--muted-foreground)] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isExpanded && (
                      <div className="flex flex-wrap gap-2 mt-2 pl-6 sm:pl-7">
                        {categoryTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all tap-target ${
                              selectedTags.has(tag)
                                ? 'bg-[var(--primary)] text-white'
                                : 'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--border)]'
                            }`}
                            aria-pressed={selectedTags.has(tag)}
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
        </div>
      )}

      {/* Results Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            {hasFilters ? (
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--secondary)] flex items-center justify-center">
                  <Search className="w-7 h-7 text-[var(--muted-foreground)]" />
                </div>
                <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                  No recipes found
                </h2>
                <p className="text-[var(--muted-foreground)] mb-6">
                  Try adjusting your search or removing some filters.
                </p>
                <button 
                  onClick={clearFilters}
                  className="inline-flex items-center px-5 py-2.5 bg-[var(--primary)] text-white rounded-xl font-medium hover:bg-[var(--primary)]/90 transition-colors tap-target"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--secondary)] flex items-center justify-center">
                  <ChefHat className="w-7 h-7 text-[var(--muted-foreground)]" />
                </div>
                <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                  No recipes yet
                </h2>
                <p className="text-[var(--muted-foreground)]">
                  Add recipe files to <code className="px-1.5 py-0.5 bg-[var(--secondary)] rounded text-sm">content/recipes/</code> to get started.
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-5 sm:mb-6">
              <p className="text-sm text-[var(--muted-foreground)]">
                <span className="font-semibold text-[var(--foreground)]">{filteredRecipes.length}</span>
                {' '}recipe{filteredRecipes.length !== 1 ? 's' : ''}
                {hasFilters ? ' found' : ' in collection'}
              </p>
            </div>

            {/* Recipe Grid - Mobile first */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredRecipes.map((recipe, index) => (
                <div 
                  key={recipe.slug} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
