"use client";
import { useState, useEffect } from "react";

const Quote = () => {
  const [quote, setQuote] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch quote from RapidAPI
  const fetchQuote = async () => {
    const url = "https://quotes15.p.rapidapi.com/quotes/random/?language_code=en";
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "2c7a395235msh26d6aa09d3fbb9dp15d0f4jsn3ae29d1f0b3a",
        "x-rapidapi-host": "quotes15.p.rapidapi.com",
      },
    };

    try {
      setLoading(true);
      setError(null); // Reset error on new request

      const response = await fetch(url, options);

      if (response.ok) {
        const data = await response.json();
        const quoteText = data.content; // Quote text
        const authorName = data.originator.name; // Author name

        setQuote(quoteText);
        setAuthor(authorName);

        // Store quote in localStorage
        localStorage.setItem("quote", quoteText);
        localStorage.setItem("author", authorName);
      } else {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setError("Failed to fetch quote");
      console.error("Error fetching quote:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch quote on initial render
  useEffect(() => {
    const savedQuote = localStorage.getItem("quote");
    const savedAuthor = localStorage.getItem("author");

    if (savedQuote && savedAuthor) {
      setQuote(savedQuote);
      setAuthor(savedAuthor);
    } else {
      fetchQuote(); // Fetch if there's no saved quote
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-center bg-customColor1 text-black px-6">
      <h1 className="text-3xl font-bold mb-6">Random Quote</h1>

      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg text-center">
        {loading ? (
          <p className="text-lg text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500 font-semibold">{error}</p>
        ) : (
          <div>
            <p className="text-xl italic text-gray-700">&quot;{quote}&quot;</p>
            <p className="text-right font-semibold text-gray-900 mt-4">- {author}</p>
          </div>
        )}

        <button
          onClick={fetchQuote}
          className="mt-6 px-6 py-2 bg-customColor4 text-white font-semibold rounded hover:opacity-90 transition"
        >
          Get Another Quote
        </button>
      </div>
    </div>
  );
};

export default Quote;
