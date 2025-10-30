import React, { useState } from 'react';
import { Book, SearchResult, Transaction } from '../types';

interface SidebarProps {
  userBooks: Book[];
  savedBooks: Book[];
  purchasedBooks: Book[];
  onSelectItem: (item: SearchResult) => void;
  isOpen: boolean;
  onClose: () => void;
  authorBalance: number;
  ownerBalance: number;
  transactions: Transaction[];
}

const Sidebar: React.FC<SidebarProps> = ({ userBooks, savedBooks, purchasedBooks, onSelectItem, isOpen, onClose, authorBalance, ownerBalance, transactions }) => {
  const publishedBooks = userBooks.filter(book => book.status === 'published');
  const pendingBooks = userBooks.filter(book => book.status === 'pending');
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('Guest User');
  const [email, setEmail] = useState('guest.user@example.com');
  const [phone, setPhone] = useState('');
  const [profilePic, setProfilePic] = useState<string>('https://i.pravatar.cc/100?u=guest');

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setName("Amine Hammachi");
    setEmail("aminehammachi77@gmail.com");
    setPhone("123-456-7890");
  };

  const handleWithdraw = (amount: number, recipient: 'Author' | 'Owner') => {
    if (amount <= 0) {
      alert("No funds to withdraw.");
      return;
    }
    alert(`Withdrawal of ${formatCurrency(amount)} for ${recipient} initiated.\n\nFunds will be transferred to your linked payment method shortly. (This is a simulation, no real transaction will occur.)`);
    // In a real app, you would also likely reset the balance or create a payout record.
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  const formInputClass = "w-full text-sm px-3 py-1.5 text-foreground bg-card border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none transition";
  const formLabelClass = "block text-xs font-medium text-muted-foreground mb-1";
  
  const BookListItem: React.FC<{ book: Book }> = ({ book }) => (
    <div 
      onClick={() => onSelectItem(book)}
      className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer transition-colors"
    >
      <img 
        src={book.coverImageUrl || (book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg` : 'https://placehold.co/40x60/f8f7f2/1a202c?text=')
        }
        alt={`Cover for ${book.title}`}
        className="w-10 h-14 object-cover rounded flex-shrink-0 bg-secondary"
      />
      <div>
        <p className="font-semibold text-sm line-clamp-2 leading-tight text-card-foreground" title={book.title}>{book.title}</p>
        <p className="text-xs text-muted-foreground line-clamp-1">{book.author_name?.join(', ')}</p>
      </div>
    </div>
  );

  const Section: React.FC<{ title: string; count?: number; children: React.ReactNode; defaultOpen?: boolean; icon: React.ReactNode }> = ({ title, count, children, defaultOpen = false, icon }) => (
      <details className="border-b border-border group" open={defaultOpen}>
        <summary className="flex items-center gap-3 p-4 font-semibold text-sm text-foreground tracking-wide cursor-pointer list-none">
          {icon}
          <span>{title}</span>
          {typeof count === 'number' && <span className="ml-auto text-xs bg-secondary text-secondary-foreground font-medium px-2 py-0.5 rounded-full">{count}</span>}
        </summary>
        <div className="px-4 pb-4">
          {children}
        </div>
      </details>
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <aside className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border shadow-xl z-40 transform transition-transform flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex justify-between items-center p-4 border-b border-border flex-shrink-0">
            <h2 className="font-bold text-lg text-card-foreground">My Account</h2>
            <button onClick={onClose} aria-label="Close sidebar" className="md:hidden p-1 rounded-full hover:bg-accent">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div className="flex-grow overflow-y-auto">
            <div className="p-4 text-center border-b border-border">
                <div className="relative w-20 h-20 mx-auto group">
                    <img src={profilePic} alt="User Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-primary" />
                    <label htmlFor="profile-pic-upload" className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white text-xs font-semibold opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">Change</label>
                    <input type="file" id="profile-pic-upload" className="hidden" accept="image/*" onChange={handleProfilePicChange} />
                </div>
                <h3 className="font-semibold text-card-foreground mt-2">{name}</h3>
                <p className="text-sm text-muted-foreground">{email}</p>
            </div>
            
            {!isLoggedIn ? (
              <Section title="Register / Login" defaultOpen={true} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>}>
                <form className="space-y-3" onSubmit={handleLogin}><label className={formLabelClass} htmlFor="loginId">Email or Phone</label><input className={formInputClass} type="text" id="loginId" placeholder="you@example.com" /><div><label className={formLabelClass} htmlFor="password">Password</label><input className={formInputClass} type="password" id="password" /></div><button type="submit" className="w-full text-sm mt-2 px-3 py-1.5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition">Sign In</button></form>
              </Section>
            ) : (
              <Section title="Profile Information" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>}>
                <div className="space-y-3"><div><label className={formLabelClass}>Name</label><input className={formInputClass} type="text" value={name} onChange={e => setName(e.target.value)} /></div><div><label className={formLabelClass}>Email</label><input className={formInputClass} type="email" value={email} onChange={e => setEmail(e.target.value)} /></div><div><label className={formLabelClass}>Phone Number</label><input className={formInputClass} type="tel" value={phone} onChange={e => setPhone(e.target.value)} /></div><button type="button" className="w-full text-sm mt-2 px-3 py-1.5 bg-secondary text-secondary-foreground font-semibold rounded-md hover:bg-accent transition">Update Profile</button></div>
              </Section>
            )}
            
            <Section title="Author Dashboard" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>}>
              <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Books Published</span>
                      <span className="font-bold text-lg text-foreground">{publishedBooks.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Earnings Balance</span>
                      <span className="font-bold text-lg text-green-600">{formatCurrency(authorBalance)}</span>
                  </div>
                  <button onClick={() => handleWithdraw(authorBalance, 'Author')} className="w-full text-sm px-3 py-1.5 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:bg-green-600/50 disabled:cursor-not-allowed" disabled={authorBalance <= 0}>Withdraw Balance</button>
              </div>
            </Section>

             <Section title="Owner's Dashboard" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>}>
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Platform Fees (5%)</span>
                        <span className="font-bold text-lg text-primary">{formatCurrency(ownerBalance)}</span>
                    </div>
                    <button onClick={() => handleWithdraw(ownerBalance, 'Owner')} className="w-full text-sm px-3 py-1.5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition disabled:bg-primary/50 disabled:cursor-not-allowed" disabled={ownerBalance <= 0}>Withdraw Funds</button>
                </div>
            </Section>

            <Section title="Transaction History" count={transactions.length} defaultOpen={transactions.length > 0} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435.22-1.32a1 1 0 01.986-.836H15a1 1 0 011 1v5a1 1 0 01-1 1h-2.153a1 1 0 01-.986-.836l-.74-4.435-.22 1.32a1 1 0 01-.986.836H5a1 1 0 01-1-1v-5a1 1 0 011-1zm12 8a1 1 0 100-2h-2.153a1 1 0 01-.986-.836l-.74-4.435.22-1.32a1 1 0 01.986-.836H15a1 1 0 011 1v5zM5 11a1 1 0 100-2H3a1 1 0 100 2h2z" /></svg>}>
                {transactions.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
                    {transactions.map(tx => (
                      <div key={tx.timestamp} className="p-2 bg-secondary rounded-md">
                        <p className="font-semibold truncate text-secondary-foreground" title={tx.bookTitle}>{tx.bookTitle}</p>
                        <div className="flex justify-between text-muted-foreground">
                           <span>Sale: {formatCurrency(tx.price)}</span>
                           <span>Fee: {formatCurrency(tx.ownerCut)}</span>
                           <span>Payout: {formatCurrency(tx.authorCut)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No transactions yet.</p>
                )}
            </Section>
            
            <Section title="My Purchased Books" count={purchasedBooks.length} defaultOpen={purchasedBooks.length > 0} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>}>
              {purchasedBooks.length > 0 ? (<div className="space-y-2 max-h-48 overflow-y-auto pr-1">{purchasedBooks.map(book => <BookListItem key={book.key} book={book} />)}</div>) : (<p className="text-sm text-muted-foreground italic">You haven't purchased any books yet.</p>)}
            </Section>
            <Section title="Saved For Later" count={savedBooks.length} defaultOpen={savedBooks.length > 0} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.13L5 18V4z" /></svg>}>
              {savedBooks.length > 0 ? (<div className="space-y-2 max-h-48 overflow-y-auto pr-1">{savedBooks.map(book => <BookListItem key={book.key} book={book} />)}</div>) : (<p className="text-sm text-muted-foreground italic">No books saved yet.</p>)}
            </Section>
            <Section title="Pending Review" count={pendingBooks.length} defaultOpen={pendingBooks.length > 0} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>}>
              {pendingBooks.length > 0 ? (<div className="space-y-2 max-h-48 overflow-y-auto pr-1">{pendingBooks.map(book => <BookListItem key={book.key} book={book} />)}</div>) : (<p className="text-sm text-muted-foreground italic">No books pending review.</p>)}
            </Section>
            <Section title="My Published Books" count={publishedBooks.length} defaultOpen={publishedBooks.length > 0} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>}>
              {publishedBooks.length > 0 ? (<div className="space-y-2 max-h-48 overflow-y-auto pr-1">{publishedBooks.map(book => <BookListItem key={book.key} book={book} />)}</div>) : (<p className="text-sm text-muted-foreground italic">You haven't published any books.</p>)}
            </Section>
        </div>

        <div className="mt-auto p-4 border-t border-border flex-shrink-0">
           <a href="mailto:aminehammachi77@gmail.com" className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-card transition">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
             Contact Us
           </a>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;