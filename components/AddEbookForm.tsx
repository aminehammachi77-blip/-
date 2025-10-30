import React, { useState, useEffect } from 'react';
import { Book } from '../types';

interface AddEbookFormProps {
  onAddBook: (book: Book) => void;
  onCancel: () => void;
}

const paymentOptions = ['PayPal', 'Credit Card', 'Google Pay', 'Apple Pay', 'BaridiMob'];

const AddEbookForm: React.FC<AddEbookFormProps> = ({ onAddBook, onCancel }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [commission, setCommission] = useState(0);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    const priceValue = parseFloat(price);
    if (!isNaN(priceValue) && priceValue > 0) {
      const commissionValue = priceValue * 0.05;
      setCommission(commissionValue);
      setEarnings(priceValue - commissionValue);
    } else {
      setCommission(0);
      setEarnings(0);
    }
  }, [price]);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedPayments(prev => 
      checked ? [...prev, value] : prev.filter(p => p !== value)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !price) {
      setError('Please fill out Title, Author, and Price.');
      return;
    }
    setError(null);

    const newBook: Book = {
      key: `user-${Date.now()}`,
      title,
      author_name: [author],
      description,
      price: parseFloat(price),
      coverImageUrl: coverImage || undefined,
      paymentMethods: selectedPayments,
      isUserBook: true,
      status: 'pending',
    };
    onAddBook(newBook);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  const formInputClass = "w-full px-4 py-2 text-foreground bg-card border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none transition";
  const formLabelClass = "block text-sm font-medium text-foreground mb-1";

  return (
    <div className="bg-card p-6 sm:p-8 rounded-lg shadow-sm border border-border max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-card-foreground">Submit Your Ebook</h2>
      <p className="text-sm text-muted-foreground mb-6">Your book will be reviewed by our team before it becomes visible in the library. This usually takes a few moments.</p>

      {error && (
        <div className="bg-red-500/10 border-l-4 border-destructive text-destructive p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className={formLabelClass}>Book Title *</label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className={formInputClass} required />
        </div>
        <div>
          <label htmlFor="author" className={formLabelClass}>Author Name *</label>
          <input type="text" id="author" value={author} onChange={e => setAuthor(e.target.value)} className={formInputClass} required />
        </div>
        <div>
          <label htmlFor="description" className={formLabelClass}>Description</label>
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className={formInputClass}></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className={formLabelClass}>Listing Price ($) *</label>
            <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} className={formInputClass} min="0" step="0.01" required placeholder="e.g., 9.99"/>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <h4 className="text-sm font-medium text-secondary-foreground mb-2">Earnings Breakdown</h4>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Listing Price:</span>
                    <span className="font-semibold text-foreground">{formatCurrency(parseFloat(price) || 0)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee (5%):</span>
                    <span className="font-semibold text-red-500">- {formatCurrency(commission)}</span>
                </div>
                <hr className="border-border"/>
                <div className="flex justify-between text-base">
                    <span className="font-bold text-foreground">Your Earnings:</span>
                    <span className="font-bold text-green-600">{formatCurrency(earnings)}</span>
                </div>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="cover" className={formLabelClass}>Cover Image</label>
          <input type="file" id="cover" onChange={handleCoverImageChange} accept="image/*" className={`${formInputClass} p-0 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-secondary-foreground hover:file:bg-accent`} />
          {coverImage && <img src={coverImage} alt="Cover preview" className="mt-4 h-32 w-auto rounded" />}
        </div>
        <div>
          <h3 className={formLabelClass}>Your Payout Methods</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {paymentOptions.map(option => (
              <label key={option} className="flex items-center space-x-3">
                <input type="checkbox" value={option} onChange={handlePaymentChange} className="h-4 w-4 rounded border-input text-primary focus:ring-ring" />
                <span className="text-foreground">{option}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onCancel} className="px-6 py-2 bg-secondary text-secondary-foreground font-semibold rounded-md hover:bg-accent transition">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-card transition">
            Submit for Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEbookForm;