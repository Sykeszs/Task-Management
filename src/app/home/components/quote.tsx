"use client";
import { useState, useEffect } from 'react';

const Quote = () => {
  const [quote, setQuote] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch quote from RapidAPI
  const fetchQuote = async () => {
    const url = 'https://quotes15.p.rapidapi.com/quotes/random/?language_code=en';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '2c7a395235msh26d6aa09d3fbb9dp15d0f4jsn3ae29d1f0b3a',
        'x-rapidapi-host': 'quotes15.p.rapidapi.com',
      },
    };

    try {
      setLoading(true);
      setError(null);  // Reset error on new request

      const response = await fetch(url, options);
      
      if (response.ok) {
        const data = await response.json();
        const quoteText = data.content; // Quote text
        const authorName = data.originator.name; // Author name
        
        setQuote(quoteText);
        setAuthor(authorName);
      } else {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setError('Failed to fetch quote');
      console.error('Error fetching quote:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch quote on initial render
  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1>Random Quote Generator</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div>
          <p style={{ fontStyle: 'italic', fontSize: '1.5em' }}>&quot;{quote}&quot;</p>
          <p style={{ textAlign: 'right', fontWeight: 'bold' }}>- {author}</p>
        </div>
      )}
      <button 
        onClick={fetchQuote} 
        style={{ padding: '10px 20px', fontSize: '1em', marginTop: '20px' }}
      >
        Get Another Quote
      </button>
    </div>
  );
};

export default Quote;
