"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { WordGrid } from "@/components/WordGrid";
import { Pagination } from "@/components/Pagination";
import { fetchAllWords } from "@/lib/api";
import { Word } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [words, setWords] = useState<Word[]>([]);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const wordsPerPage = 12;

  useEffect(() => {
    const loadWords = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAllWords();
        setWords(data);
        setFilteredWords(data);
      } catch (err) {
        setError("Failed to load dictionary. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadWords();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredWords(words);
    } else {
      const filtered = words.filter((word) =>
        word.word.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredWords(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, words]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentWords = filteredWords.slice(
    (currentPage - 1) * wordsPerPage,
    currentPage * wordsPerPage
  );

  const totalPages = Math.ceil(filteredWords.length / wordsPerPage);

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            English-Turkish Dictionary
          </h1>
          <p className="text-muted-foreground mb-6">
            Expand your vocabulary with our interactive dictionary
          </p>
          <SearchBar onSearch={handleSearch} />
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading dictionary...</span>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-destructive/10 rounded-lg">
            <p className="text-destructive font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredWords.length === 0 ? (
          <div className="text-center p-12">
            <p className="text-xl font-medium">No words found matching "{searchQuery}"</p>
            <p className="text-muted-foreground mt-2">
              Try a different search term or browse all words
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              Show All Words
            </button>
          </div>
        ) : (
          <>
            <WordGrid words={currentWords} />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}