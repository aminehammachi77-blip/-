import React, { useState, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import ResultsGrid from './components/ResultsGrid';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Pagination from './components/Pagination';
import ThemeToggleButton from './components/ThemeToggleButton';
import BookDetailsComponent from './components/BookDetails';
import AuthorDetailsComponent from './components/AuthorDetails';
import FeaturedCategories from './components/FeaturedCategories';
import AddEbookForm from './components/AddEbookForm';
import Sidebar from './components/Sidebar';
import WebsiteRating from './components/WebsiteRating'; // Import the new component
import { searchOpenLibrary, getBookDetails, getAuthorDetails } from './services/openLibraryService';
import { SearchType, SearchResult, BookDetails, AuthorDetails, Book, Transaction } from './types';

const ITEMS_PER_PAGE = 20;

type View = 'search' | 'add-book';

// New Logo Component
const Logo = () => (
  <div className="flex items-center gap-2 cursor-pointer">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v2H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 4.5v15zM12 4v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 17v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 2H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span className="text-2xl font-bold text-foreground">Library Explorer</span>
  </div>
);


function App() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchType, setSearchType] = useState<SearchType>(SearchType.BOOKS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');

  const [selectedItem, setSelectedItem] = useState<{key: string; type: SearchType} | null>(null);
  const [details, setDetails] = useState<BookDetails | AuthorDetails | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const [view, setView] = useState<View>('search');
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [savedBooks, setSavedBooks] = useState<Record<string, Book>>({});

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State for payment simulation
  const [authorBalance, setAuthorBalance] = useState(0);
  const [ownerBalance, setOwnerBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [purchasedBooks, setPurchasedBooks] = useState<Record<string, boolean>>({});


  const performSearch = useCallback(async (query: string, type: SearchType, page: number) => {
    if (!query.trim()) {
        setResults([]);
        setTotalPages(0);
        return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await searchOpenLibrary(query, type, page, ITEMS_PER_PAGE);
      setResults(data.docs);
      setTotalPages(Math.ceil(data.numFound / ITEMS_PER_PAGE));
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
      setResults([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const handleSearch = (query: string, type: SearchType) => {
    setCurrentQuery(query);
    setSearchType(type);
    setCurrentPage(1);
    setSelectedItem(null);
    setDetails(null);
    performSearch(query, type, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    performSearch(currentQuery, searchType, page);
    window.scrollTo(0, 0);
  };

  const handleSelectItem = useCallback(async (item: SearchResult) => {
    if ('title' in item && item.isUserBook) { // User-added book
      setSelectedItem({ key: item.key, type: SearchType.BOOKS });
      setDetails(item as BookDetails);
      setIsDetailsLoading(false);
      setDetailsError(null);
      window.scrollTo(0, 0);
      setView('search');
      setIsSidebarOpen(false);
      return;
    }
      
    const itemType = 'title' in item ? SearchType.BOOKS : SearchType.AUTHORS;
    setSelectedItem({ key: item.key, type: itemType });
    setDetails(item); // Show partial details immediately
    setIsDetailsLoading(true);
    setDetailsError(null);
    window.scrollTo(0, 0);
    setView('search');
    setIsSidebarOpen(false);


    try {
      if (itemType === SearchType.BOOKS) {
        const bookDetailsData = await getBookDetails(item.key);
        setDetails(prevDetails => ({ ...prevDetails, ...bookDetailsData }));
      } else {
        const authorDetailsData = await getAuthorDetails(item.key);
        setDetails(prevDetails => ({ ...prevDetails, ...authorDetailsData }));
      }
    } catch (err) {
      setDetailsError('Failed to fetch details. Please try again.');
    } finally {
      setIsDetailsLoading(false);
    }
  }, []);

  const handleBackToSearch = () => {
    setSelectedItem(null);
    setDetails(null);
    setDetailsError(null);
    setView('search');
  };

  const handleAddEbook = (book: Book) => {
    // Add the book with 'pending' status
    setUserBooks(prevBooks => [book, ...prevBooks]);
    setView('search');
    window.scrollTo(0, 0);

    // Simulate the review process
    setTimeout(() => {
      setUserBooks(prevBooks => 
        prevBooks.map(b => 
          b.key === book.key ? { ...b, status: 'published' } : b
        )
      );
      // In a real app, you might show a notification that the book is published.
    }, 5000); // 5-second review time
  };
  
  const handleToggleSaveBook = (bookToToggle: Book) => {
    setSavedBooks(prev => {
      const newSavedBooks = { ...prev };
      if (newSavedBooks[bookToToggle.key]) {
        delete newSavedBooks[bookToToggle.key];
      } else {
        newSavedBooks[bookToToggle.key] = bookToToggle;
      }
      return newSavedBooks;
    });
  };

  const handlePurchase = (book: Book) => {
    if (!book.price) return;
    const price = book.price;
    const ownerCut = price * 0.05;
    const authorCut = price - ownerCut;

    setAuthorBalance(prev => prev + authorCut);
    setOwnerBalance(prev => prev + ownerCut);

    const newTransaction: Transaction = {
        bookKey: book.key,
        bookTitle: book.title,
        price,
        authorCut,
        ownerCut,
        timestamp: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Mark the book as purchased
    setPurchasedBooks(prev => ({ ...prev, [book.key]: true }));
    
    alert(`Thank you for purchasing "${book.title}"!\n\nYou can now download or read it online.`);
  };

  const enrichResultsWithSaveStatus = (items: SearchResult[]): SearchResult[] => {
    if (searchType !== SearchType.BOOKS) return items;
    return (items as Book[]).map(book => ({
      ...book,
      isSaved: !!savedBooks[book.key],
    }));
  };

  const publishedUserBooks = userBooks.filter(book => book.status === 'published');
  const purchasedUserBooks = userBooks.filter(book => purchasedBooks[book.key]);
  const combinedResults = enrichResultsWithSaveStatus(
    searchType === SearchType.BOOKS ? [...publishedUserBooks, ...results] : results
  );

  return (
    <div className="bg-background min-h-screen text-foreground transition-colors">
      <div className="relative flex min-h-screen">
        <Sidebar 
          userBooks={userBooks} 
          savedBooks={Object.values(savedBooks)}
          purchasedBooks={purchasedUserBooks}
          onSelectItem={handleSelectItem}
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          authorBalance={authorBalance}
          ownerBalance={ownerBalance}
          transactions={transactions}
        />
        <div className="flex-1 md:ml-64 transition-transform duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <button 
                      className="md:hidden p-2 rounded-md text-muted-foreground hover:bg-accent" 
                      onClick={() => setIsSidebarOpen(true)}
                      aria-label="Open sidebar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                    <div onClick={() => { handleBackToSearch(); setCurrentQuery(''); setResults([]); }}>
                      <Logo />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setView('add-book')}
                    className="hidden sm:inline-block px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-background transition"
                  >
                    Add Ebook
                  </button>
                  <ThemeToggleButton />
                </div>
            </header>

            <main>
              {view === 'add-book' ? (
                <AddEbookForm onAddBook={handleAddEbook} onCancel={() => setView('search')} />
              ) : selectedItem ? (
                <>
                  {isDetailsLoading && !details && <LoadingSpinner />}
                  {detailsError && <ErrorMessage message={detailsError} />}
                  {details && (
                    selectedItem.type === SearchType.BOOKS ? (
                      <BookDetailsComponent 
                        book={details as BookDetails} 
                        onBack={handleBackToSearch} 
                        isLoading={isDetailsLoading}
                        isSaved={!!savedBooks[(details as BookDetails).key]}
                        isPurchased={!!purchasedBooks[(details as BookDetails).key]}
                        onToggleSave={handleToggleSaveBook}
                        onPurchase={handlePurchase}
                      />
                    ) : (
                      <AuthorDetailsComponent author={details as AuthorDetails} onBack={handleBackToSearch} isLoading={isDetailsLoading} />
                    )
                  )}
                </>
              ) : (
                <>
                  <div className="bg-card p-6 rounded-lg shadow-sm border border-border mb-8">
                    <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                    <button
                      onClick={() => setView('add-book')}
                      className="sm:hidden w-full mt-4 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-card transition"
                    >
                      Add Ebook
                    </button>
                  </div>
                  
                  {isLoading && <LoadingSpinner />}
                  {error && <ErrorMessage message={error} />}
                  
                  {!isLoading && !error && combinedResults.length > 0 && (
                    <>
                      <ResultsGrid 
                        results={combinedResults} 
                        searchType={searchType} 
                        onSelectItem={handleSelectItem} 
                        onToggleSave={handleToggleSaveBook}
                      />
                      { totalPages > 0 && 
                        <Pagination 
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                        />
                      }
                    </>
                  )}

                  {!isLoading && !error && results.length === 0 && userBooks.length === 0 && currentQuery && (
                      <div className="text-center py-12">
                          <h2 className="text-2xl font-semibold mb-2">No Results Found</h2>
                          <p className="text-muted-foreground">
                              We couldn't find any {searchType} matching your search for "{currentQuery}".
                          </p>
                      </div>
                  )}

                  {!isLoading && !error && !currentQuery && userBooks.length === 0 && (
                    <FeaturedCategories 
                      onBookSelect={(book) => handleSelectItem(book as Book)} 
                      onToggleSave={handleToggleSaveBook}
                      savedBooks={savedBooks}
                    />
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
      <WebsiteRating />
    </div>
  );
}

export default App;