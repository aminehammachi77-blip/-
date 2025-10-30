import React from 'react';

interface StarRatingProps {
  rating: number;
  size?: 'small' | 'medium' | 'large';
  isInteractive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const Star: React.FC<{ fill: number, sizeClass: string, isInteractive: boolean, value: number, onStarClick: (value: number) => void }> = ({ fill, sizeClass, isInteractive, value, onStarClick }) => {
  const starStyle: React.CSSProperties = {
    clipPath: `inset(0 ${100 - fill}% 0 0)`,
  };
  
  return (
    <div 
        className={`relative ${sizeClass} ${isInteractive ? 'cursor-pointer' : ''}`}
        onClick={() => isInteractive && onStarClick(value)}
    >
      {/* Empty Star Background */}
      <svg className="w-full h-full text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      {/* Filled Star Foreground */}
      <svg className="w-full h-full absolute top-0 left-0 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" style={starStyle}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </div>
  );
};


const StarRating: React.FC<StarRatingProps> = ({ rating, size = 'medium', isInteractive = false, onRatingChange = () => {} }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-8 h-8',
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((starValue) => {
        const fillPercentage = Math.max(0, Math.min(1, rating - (starValue - 1))) * 100;
        return (
            <Star 
                key={starValue} 
                fill={fillPercentage} 
                sizeClass={sizeClasses[size]} 
                isInteractive={isInteractive}
                value={starValue}
                onStarClick={onRatingChange}
            />
        );
      })}
    </div>
  );
};

export default StarRating;