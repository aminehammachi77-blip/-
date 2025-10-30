import React from 'react';
import { SearchType, SearchResult, Book, Author } from '../types';
import BookCard from './BookCard';
import AuthorCard from './AuthorCard';

interface ResultsGridProps {
  results: SearchResult[];
  searchType: SearchType;
  onSelectItem: (item: SearchResult) => void;
  onToggleSave: (book: Book) => void;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ results, searchType, onSelectItem, onToggleSave }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {results.map((item) => {
        if (searchType === SearchType.BOOKS) {
          return (
            <BookCard 
              key={(item as Book).key} 
              book={item as Book} 
              onSelect={() => onSelectItem(item)} 
              onToggleSave={onToggleSave}
            />
          );
        } else {
          return <AuthorCard key={(item as Author).key} author={item as Author} onSelect={() => onSelectItem(item)} />;
        }
      })}
    </div>
  );
};

export default ResultsGrid;
