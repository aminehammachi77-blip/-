import React from 'react';
import { Author } from '../types';

interface AuthorCardProps {
  author: Author;
  onSelect: () => void;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author, onSelect }) => {
  const photoUrl = `https://covers.openlibrary.org/a/olid/${author.key}-M.jpg`;

  return (
    <div 
      onClick={onSelect}
      className="bg-card rounded-lg shadow-md border border-border overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center p-4 cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
      aria-label={`View details for ${author.name}`}
    >
      <div className="w-32 h-32 rounded-full overflow-hidden bg-secondary flex-shrink-0 mb-4 border-4 border-card shadow-sm">
        <img
          src={photoUrl}
          alt={`Photo of ${author.name}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://placehold.co/200x200/f8f7f2/1a202c?text=?';
          }}
        />
      </div>
      <div className="flex flex-col flex-grow justify-center">
        <h3 className="text-lg font-semibold text-card-foreground" title={author.name}>
          {author.name}
        </h3>
        {author.top_work && (
          <p className="text-sm text-muted-foreground mt-1" title={author.top_work}>
            Known for: <span className="italic">{author.top_work}</span>
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          {author.work_count} works
        </p>
      </div>
    </div>
  );
};

export default AuthorCard;