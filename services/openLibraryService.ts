import { SearchType, SearchResponse, Book, Author, BookDetails, AuthorDetails } from '../types';

const API_BASE_URL = 'https://openlibrary.org';

// Helper to generate mock ratings since the API doesn't provide them reliably
const enrichBookWithRating = (book: Book): Book => {
  if (!book.key) return book;
  let hash = 0;
  for (let i = 0; i < book.key.length; i++) {
    const char = book.key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  const average_rating = parseFloat(((Math.abs(hash) % 35 + 15) / 10).toFixed(2)); // Rating between 1.5 and 5.0
  const ratings_count = Math.abs(hash) % 1500 + 50; // Count between 50 and 1550
  
  return { ...book, average_rating, ratings_count };
};

const enrichBooksWithRatings = (books: Book[]): Book[] => {
  return books.map(enrichBookWithRating);
}


export const searchOpenLibrary = async (
  query: string,
  type: SearchType,
  page: number = 1,
  limit: number = 20
): Promise<SearchResponse<Book | Author>> => {
  if (!query.trim()) {
    return { docs: [], numFound: 0 };
  }

  const searchPath = type === SearchType.BOOKS ? 'search.json' : 'search/authors.json';
  const url = `${API_BASE_URL}/${searchPath}?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Network response was not ok: ${response.statusText} - ${errorBody}`);
    }
    const data = await response.json();

    if (type === SearchType.BOOKS) {
      data.docs = enrichBooksWithRatings(data.docs);
    }

    return data;
  } catch (error) {
    console.error(`Error fetching from OpenLibrary for type ${type}:`, error);
    throw error;
  }
};

export const getBookDetails = async (key: string): Promise<BookDetails> => {
  const url = `${API_BASE_URL}${key}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const bookData = await response.json();
    return enrichBookWithRating(bookData) as BookDetails;
  } catch (error) {
    console.error(`Error fetching book details for key ${key}:`, error);
    throw error;
  }
};

export const getAuthorDetails = async (key: string): Promise<AuthorDetails> => {
  const url = `${API_BASE_URL}/authors/${key}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching author details for key ${key}:`, error);
    throw error;
  }
};

export const getBooksBySubject = async (subject: string, limit: number = 10): Promise<Book[]> => {
  const url = `${API_BASE_URL}/subjects/${subject}.json?limit=${limit}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok for subject ${subject}`);
    }
    const data = await response.json();
    if (!data.works) {
      return [];
    }
    
    // Map the response to our Book type
    const mappedBooks: Book[] = data.works.map((work: any) => ({
      key: work.key,
      title: work.title,
      author_name: work.authors?.map((a: { name: string }) => a.name) || ['Unknown Author'],
      first_publish_year: work.first_publish_year,
      cover_i: work.cover_id,
    }));

    return enrichBooksWithRatings(mappedBooks);
  } catch (error) {
    console.error(`Error fetching books for subject ${subject}:`, error);
    throw error;
  }
};