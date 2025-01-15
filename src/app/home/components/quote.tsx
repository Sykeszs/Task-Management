"use client";
import { useEffect, useState } from 'react';

const Quote = () => {
  const [quote, setQuote] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch('https://quote-garden.onrender.com/api/v3/quotesm');
        const data = await response.json();
        setQuote(data.data[0].quote);  // Quote text
        setAuthor(data.data[0].author); // Author name
      } catch (error) {
        console.error('Error fetching quote:', error);
        setQuote("Could not fetch a quote. Please try again later.");
        setAuthor("Unknown");
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Task Management App</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p style={{ fontStyle: 'italic', fontSize: '1.2em' }}>"{quote}"</p>
          <p style={{ textAlign: 'right', fontWeight: 'bold' }}>- {author}</p>
        </div>
      )}
    </div>
  );
};

export default Quote;
