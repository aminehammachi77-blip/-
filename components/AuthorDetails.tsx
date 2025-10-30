import React from 'react';
import { AuthorDetails } from '../types';

interface AuthorDetailsProps {
  author: AuthorDetails;
  onBack: () => void;
  isLoading: boolean;
}

const AuthorDetailsComponent: React.FC<AuthorDetailsProps> = ({ author, onBack, isLoading }) => {
  const photoId = author.photos ? author.photos[0] : null;
  const photoUrl = photoId
    ? `https://covers.openlibrary.org/a/id/${photoId}-L.jpg`
    : `https://covers.openlibrary.org/a/olid/${author.key}-L.jpg?default=false`;
    
  const getBio = () => {
    if (isLoading && !author.bio) return "Loading biography...";
    if (!author.bio) return 'No biography available.';
    if (typeof author.bio === 'string') return author.bio;
    return author.bio.value;
  };

  return (
    <div className="bg-card p-6 sm:p-8 rounded-lg shadow-sm border border-border">
      <button onClick={onBack} className="mb-6 flex items-center text-primary hover:underline">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to search results
      </button>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="md:w-1/3 flex-shrink-0 text-center">
          <img 
            src={photoUrl} 
            alt={`Photo of ${author.name}`} 
            className="w-52 h-52 object-cover rounded-full shadow-lg mx-auto border-4 border-card"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; 
              target.src = 'https://placehold.co/208x208/f8f7f2/1a202c?text=?';
            }}
          />
        </div>
        <div className="md:w-2/3">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 font-sans">{author.name}</h2>
          
          {(author.birth_date || author.death_date) && (
            <p className="text-lg text-muted-foreground mb-6 font-sans">
              {author.birth_date} {author.birth_date && author.death_date ? '–' : ''} {author.death_date}
            </p>
          )}

          <div className="prose dark:prose-invert max-w-none font-serif leading-relaxed">
            <h3 className="text-xl font-semibold mb-2 border-b border-border pb-2 font-sans">Biography</h3>
            <p className="text-foreground/90">{getBio()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDetailsComponent;