import React, { useState, useEffect } from 'react';
import { getBooksBySubject } from '../services/openLibraryService';
import { Book } from '../types';
import BookCard from './BookCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface FeaturedCategoriesProps {
  onBookSelect: (book: Book) => void;
  onToggleSave: (book: Book) => void;
  savedBooks: Record<string, Book>;
}

const CATEGORIES: { name: string; key: string }[] = [
  { name: 'Science Fiction', key: 'science_fiction' },
  { name: 'Fantasy', key: 'fantasy' },
  { name: 'Mystery', key: 'mystery' },
  { name: 'Classic Literature', key: 'classic_literature' },
  { name: 'Romance', key: 'romance' },
];

const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ onBookSelect, onToggleSave, savedBooks }) => {
  const [featuredData, setFeaturedData] = useState<Record<string, Book[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const promises = CATEGORIES.map(category => getBooksBySubject(category.key, 10));
        const results = await Promise.all(promises);
        
        const data: Record<string, Book[]> = {};
        CATEGORIES.forEach((category, index) => {
          if (results[index].length > 0) {
            data[category.name] = results[index];
          }
        });

        setFeaturedData(data);
      } catch (err) {
        console.error('Failed to fetch featured categories:', err);
        setError('Could not load featured books. Please try searching instead.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (isLoading) {
    return (
        <div className="text-center py-20">
            <LoadingSpinner />
            <p className="mt-4 text-muted-foreground">Loading book previews...</p>
        </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      {Object.entries(featuredData).map(([categoryName, books]) => (
        <section key={categoryName} className="mb-12" aria-labelledby={`category-title-${categoryName.replace(/\s+/g, '-')}`}>
          <h2 id={`category-title-${categoryName.replace(/\s+/g, '-')}`} className="text-3xl font-bold mb-4 text-foreground border-l-4 border-primary pl-4">
            {categoryName}
          </h2>
          <div className="relative">
            <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 scrollbar-hide">
              {/* FIX: Added Array.isArray check to fix 'unknown' type error on 'books'. */}
              {Array.isArray(books) && books.map(book => {
                const enrichedBook: Book = { ...book, isSaved: !!savedBooks[book.key] };
                return (
                  <div key={book.key} className="w-48 flex-shrink-0">
                    <BookCard 
                      book={enrichedBook} 
                      onSelect={() => onBookSelect(book)} 
                      onToggleSave={onToggleSave}
                    />
                  </div>
                );
              })}
            </div>
             <div className="absolute top-0 bottom-0 -left-4 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 -right-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default FeaturedCategories;