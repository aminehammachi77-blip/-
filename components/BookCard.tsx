import React from 'react';
import { Book } from '../types';
import StarRating from './StarRating';

interface BookCardProps {
  book: Book;
  onSelect: () => void;
  onToggleSave: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onSelect, onToggleSave }) => {
  const coverUrl = book.coverImageUrl || (book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : 'https://placehold.co/200x300/f8f7f2/1a202c?text=No+Cover');

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event from firing
    onToggleSave(book);
  };

  return (
    <div 
      onClick={onSelect}
      className="bg-card rounded-lg shadow-md border border-border overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group relative"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
      aria-label={`View details for ${book.title}`}
    >
      <button 
        onClick={handleSaveClick}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200
          ${book.isSaved 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-primary/80'}`
        }
        aria-label={book.isSaved ? 'Unsave this book' : 'Save this book'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.13L5 18V4z" />
        </svg>
      </button>
      
      <div className="h-64 bg-secondary flex-shrink-0">
        <img
          src={coverUrl}
          alt={`Cover for ${book.title}`}
          className="w-full h-full object-cover"
          onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                  const placeholder = document.createElement('div');
                  placeholder.className = 'w-full h-full bg-secondary flex flex-col items-center justify-center p-4 text-center';
                  placeholder.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-muted-foreground mb-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm10 3a1 1 0 100-2H6a1 1 0 100 2h8zm-3 5a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-xs text-muted-foreground font-semibold">${book.title}</span>
                  `;
                  parent.appendChild(placeholder);
              }
          }}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-md font-semibold text-card-foreground truncate" title={book.title}>
          {book.title}
        </h3>
        {book.author_name && (
          <p className="text-sm text-muted-foreground mt-1 truncate" title={book.author_name.join(', ')}>
            by {book.author_name.join(', ')}
          </p>
        )}
        {book.average_rating && (
          <div className="mt-2 flex items-center">
            <StarRating rating={book.average_rating} />
            <span className="text-xs text-muted-foreground ml-2">{book.average_rating.toFixed(1)}</span>
          </div>
        )}
        {book.isUserBook && typeof book.price === 'number' && (
          <p className="text-lg font-bold text-primary mt-2">
            ${book.price.toFixed(2)}
          </p>
        )}
        <div className="text-xs text-muted-foreground mt-auto pt-2 flex justify-between items-center">
            {book.first_publish_year && (
              <span>
                Pub. {book.first_publish_year}
              </span>
            )}
            {book.ratings_count && (
                 <span className="font-medium">
                    {new Intl.NumberFormat().format(book.ratings_count)} ratings
                </span>
            )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;