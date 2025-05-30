"use client";

import { useState } from "react";
import { Word } from "@/lib/types";
import { WordTile } from "@/components/WordTile";
import { WordDetailsDialog } from "@/components/WordDetailsDialog";

interface WordGridProps {
  words: Word[];
}

export function WordGrid({ words }: WordGridProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleOpenDetails = (word: string) => {
    setSelectedWord(word);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  return (
    <div className="mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {words.map((word, index) => (
          <WordTile
            key={`${word.word}-${index}`}
            word={word}
            onViewDetails={handleOpenDetails}
          />
        ))}
      </div>
      
      <WordDetailsDialog
        word={selectedWord}
        open={detailsOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
}