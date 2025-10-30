import React, { useState } from 'react';
import StarRating from './StarRating';

const WebsiteRating: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, you would send this data to a server
    console.log({ rating, feedback });
    setTimeout(() => {
        setIsOpen(false);
        // Reset state after a delay to allow for fade-out animation
        setTimeout(() => {
            setSubmitted(false);
            setRating(0);
            setFeedback('');
        }, 300);
    }, 2000);
  };

  if (!isOpen && submitted) return null; // Don't show button immediately after submission

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-background transition transform hover:scale-110"
        aria-label="Rate this website"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300" role="dialog" aria-modal="true">
          <div className="bg-card rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md transform transition-all duration-300">
            {submitted ? (
                <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <h2 className="text-2xl font-bold mt-4 text-card-foreground">Thank You!</h2>
                    <p className="text-muted-foreground mt-2">Your feedback helps us improve.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-start">
                        <h2 className="text-xl font-bold text-card-foreground">Rate Your Experience</h2>
                        <button type="button" onClick={() => setIsOpen(false)} className="p-1 rounded-full text-muted-foreground hover:bg-accent" aria-label="Close">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">How would you rate our website?</p>

                    <div className="flex justify-center my-6">
                        <StarRating rating={rating} size="large" isInteractive={true} onRatingChange={setRating} />
                    </div>
                
                    <div>
                        <label htmlFor="feedback" className="block text-sm font-medium text-foreground mb-1">
                            Additional Feedback (Optional)
                        </label>
                        <textarea
                            id="feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={3}
                            placeholder="Tell us what you liked or where we can improve..."
                            className="w-full px-4 py-2 text-foreground bg-background border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none transition"
                        ></textarea>
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={rating === 0}
                            className="w-full px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-card transition disabled:bg-primary/50 disabled:cursor-not-allowed"
                        >
                            Submit Feedback
                        </button>
                    </div>
                </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default WebsiteRating;