
import React, { useState } from 'react';
import { SearchType } from '../types';

interface SearchBarProps {
  onSearch: (query: string, type: SearchType) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<SearchType>(SearchType.BOOKS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, type);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search for ${type}...`}
              className="w-full px-4 py-2 text-foreground bg-card border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none transition"
              disabled={isLoading}
            />
             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>
        
        <div className="flex items-center bg-secondary rounded-md p-1 shrink-0">
          {(Object.values(SearchType)).map((searchType) => (
            <button
              key={searchType}
              type="button"
              onClick={() => setType(searchType)}
              className={`w-full sm:w-auto px-4 py-1 text-sm font-medium rounded-md transition-colors capitalize ${
                type === searchType
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-secondary-foreground hover:bg-accent'
              }`}
            >
              {searchType}
            </button>
          ))}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-background disabled:bg-primary/50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;