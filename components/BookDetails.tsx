import React, { useState } from 'react';
import { BookDetails } from '../types';
import StarRating from './StarRating';

interface BookDetailsProps {
  book: BookDetails;
  onBack: () => void;
  isLoading: boolean;
  isSaved: boolean;
  isPurchased: boolean;
  onToggleSave: (book: BookDetails) => void;
  onPurchase: (book: BookDetails) => void;
}

const BookDetailsComponent: React.FC<BookDetailsProps> = ({ book, onBack, isLoading, isSaved, isPurchased, onToggleSave, onPurchase }) => {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const coverId = book.covers ? book.covers[0] : book.cover_i;
  const coverUrl = book.coverImageUrl || (coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : 'https://placehold.co/400x600/f8f7f2/1a202c?text=No+Cover');

  const getDescription = () => {
    if (isLoading && !book.description) return "Loading description...";
    if (!book.description) return 'No description available.';
    if (typeof book.description === 'string') return book.description;
    return book.description.value;
  };

  const handleShare = async () => {
    const shareData = {
      title: book.title,
      text: `Check out "${book.title}" by ${book.author_name?.join(', ')} on Library Explorer!`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for desktop or unsupported browsers
        alert('Share feature not available on your browser. You can manually copy the URL.');
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };
  
  const handleDownload = () => {
    const bookContent = `Title: ${book.title}\nAuthor: ${book.author_name?.join(', ')}\n\n${getDescription()}`;
    const blob = new Blob([bookContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Sanitize title for filename
    const sanitizedTitle = book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.setAttribute('download', `${sanitizedTitle}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReadOnline = () => {
    alert(`Reading "${book.title}"...\n\n(This is a simulation of the online reader.)`);
  };

  const handleRatingChange = (rating: number) => {
    setUserRating(rating);
    setRatingSubmitted(true);
    // In a real app, you would send this to a backend.
    setTimeout(() => setRatingSubmitted(false), 3000); // Hide message after 3 seconds
  };
  
  const searchQuery = encodeURIComponent(`${book.title} ${book.author_name ? book.author_name.join(' ') : ''}`);
  const vendors = [
    { name: 'Google Books', url: `https://www.google.com/search?tbm=bks&q=${searchQuery}` },
    { name: 'Amazon', url: `https://www.amazon.com/s?k=${searchQuery}&i=stripbooks` },
    { name: 'Barnes & Noble', url: `https://www.barnesandnoble.com/w?keyword=${searchQuery}` },
    { name: 'AbeBooks', url: `https://www.abebooks.com/servlet/SearchResults?kn=${searchQuery}` }
  ];

  return (
    <div className="bg-card p-6 sm:p-8 rounded-lg shadow-sm border border-border">
      <div className="flex justify-between items-start mb-6">
        <button onClick={onBack} className="flex items-center text-primary hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to results
        </button>
         <button 
            onClick={handleShare} 
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-md hover:bg-accent transition"
            aria-label="Share this book"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 112.632-3.001M21 7v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <span className="hidden sm:inline">Share</span>
        </button>
      </div>


      {book.isUserBook && book.status === 'pending' && (
        <div className="p-3 mb-6 bg-yellow-500/10 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 rounded-r-lg">
          <p className="font-bold">Under Review</p>
          <p className="text-sm">This book is currently being reviewed and is not yet visible to other users. This may take a few moments.</p>
        </div>
      )}
      {book.isUserBook && book.status === 'published' && (
        <div className="p-3 mb-6 bg-green-500/10 border-l-4 border-green-500 text-green-800 dark:text-green-200 rounded-r-lg">
          <p className="font-bold">Published</p>
          <p className="text-sm">Congratulations! Your book is now live and visible to all users in the library.</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 flex-shrink-0">
          <img src={coverUrl} alt={`Cover for ${book.title}`} className="w-full h-auto object-cover rounded-lg shadow-lg" />
           {!book.isUserBook && (
            <button
                onClick={() => onToggleSave(book)}
                className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-md transition ${
                    isSaved
                        ? 'bg-secondary text-secondary-foreground hover:bg-accent'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.13L5 18V4z" />
                </svg>
                {isSaved ? 'Saved for Later' : 'Save for Later'}
            </button>
           )}
        </div>
        <div className="md:w-2/3">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 font-sans">{book.title}</h2>
          {book.author_name && (
            <p className="text-lg md:text-xl text-muted-foreground mb-2 font-sans">
              by {book.author_name.join(', ')}
            </p>
          )}

          {book.average_rating && book.ratings_count && (
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={book.average_rating} />
              <span className="font-bold text-lg text-foreground">{book.average_rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({new Intl.NumberFormat().format(book.ratings_count)} ratings)</span>
            </div>
          )}
          
          {(book.first_publish_date || book.first_publish_year) && (
            <p className="text-md text-muted-foreground mb-6 font-sans">
              First published in {book.first_publish_date || book.first_publish_year}
            </p>
          )}

          <div className="prose dark:prose-invert max-w-none mb-6 font-serif leading-relaxed">
            <h3 className="text-xl font-semibold mb-2 border-b border-border pb-2 font-sans">Description</h3>
            <p className="text-foreground/90">{getDescription()}</p>
          </div>
          
          {!book.isUserBook && (
            <div className="p-4 bg-secondary rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-2 font-sans text-secondary-foreground">Your Rating</h3>
                <div className="flex items-center gap-4">
                  <StarRating rating={userRating || 0} size="large" onRatingChange={handleRatingChange} isInteractive={true} />
                  {ratingSubmitted && <span className="text-green-600 dark:text-green-400 text-sm font-medium">Thank you for your rating!</span>}
                </div>
            </div>
          )}

          {!book.isUserBook && isLoading && !book.subjects && <p className="text-muted-foreground">Loading subjects...</p>}
          {!book.isUserBook && book.subjects && book.subjects.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 border-b border-border pb-2 font-sans">Subjects</h3>
              <div className="flex flex-wrap gap-2 pt-3">
                {book.subjects.slice(0, 15).map((subject, index) => (
                  <span key={index} className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {book.isUserBook && book.status === 'published' ? (
            isPurchased ? (
              <div className="p-6 bg-secondary rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400 font-sans">Thank you for your purchase!</h3>
                <p className="text-muted-foreground mb-4">You can now access your ebook below.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-md hover:bg-primary/90 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    Download Ebook
                  </button>
                  <button
                    onClick={handleReadOnline}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-bold rounded-md hover:bg-accent/80 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C3.732 4.943 7.523 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-7.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                    Read Online
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-secondary rounded-lg">
                <h3 className="text-xl font-semibold mb-3 font-sans">Purchase This Ebook</h3>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-3xl font-bold text-primary">
                      ${(book.price || 0).toFixed(2)}
                  </div>
                  <button 
                    onClick={() => onPurchase(book)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-card transition shadow-lg transform hover:scale-105"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    Buy Now
                  </button>
                </div>
                 {book.paymentMethods && book.paymentMethods.length > 0 && (
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                      Accepted Payments: {book.paymentMethods.join(', ')}
                    </div>
                  )}
              </div>
            )
          ) : !book.isUserBook ? (
            <div>
              <h3 className="text-xl font-semibold mb-3 border-b border-border pb-2 font-sans">Where to Buy</h3>
              <div className="pt-3 flex flex-wrap gap-3">
                {vendors.map(vendor => (
                  <a
                    key={vendor.name}
                    href={vendor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-border text-foreground font-medium rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-card transition"
                    aria-label={`Search for ${book.title} on ${vendor.name}`}
                  >
                    {vendor.name}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BookDetailsComponent;