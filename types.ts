export enum SearchType {
  BOOKS = 'books',
  AUTHORS = 'authors',
}

export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  description?: string | { type: string; value: string }; // Added for consistency
  // Fields for user-added books
  price?: number;
  paymentMethods?: string[];
  isUserBook?: boolean;
  coverImageUrl?: string;
  status?: 'published' | 'pending' | 'rejected';
  // Field for saved books
  isSaved?: boolean;
  // Fields for ratings
  average_rating?: number;
  ratings_count?: number;
}

export interface Author {
  key: string;
  name: string;
  top_work?: string;
  work_count: number;
}

export type SearchResult = Book | Author;

export interface SearchResponse<T> {
  docs: T[];
  numFound: number;
}

// New types for details view
interface Description {
  type: string;
  value: string;
}

export interface BookDetails extends Book {
  subjects?: string[];
  covers?: number[];
  first_publish_date?: string;
}

export interface AuthorDetails extends Author {
  bio?: string | Description;
  birth_date?: string;
  death_date?: string;
  photos?: number[];
}

export interface Transaction {
  bookKey: string;
  bookTitle: string;
  price: number;
  authorCut: number;
  ownerCut: number;
  timestamp: string;
}