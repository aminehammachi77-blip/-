import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center space-x-4 my-8">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-accent text-accent-foreground rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition hover:bg-secondary"
      >
        Previous
      </button>
      <span className="text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-accent text-accent-foreground rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition hover:bg-secondary"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;