"use client";

import { motion } from "@/lib/motion";
import { Word } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface WordTileProps {
  word: Word;
  onViewDetails: (word: string) => void;
}

export function WordTile({ word, onViewDetails }: WordTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="p-5">
        <h2 className="text-xl font-bold mb-3 text-card-foreground">{word.word}</h2>
        <ul className="space-y-1 mb-4">
          {word.meanings.map((meaning, index) => (
            <li 
              key={index} 
              className="text-muted-foreground text-sm flex items-start"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></span>
              <span>{meaning}</span>
            </li>
          ))}
        </ul>
        <Button 
          onClick={() => onViewDetails(word.word)}
          variant="outline" 
          size="sm"
          className="w-full group"
        >
          <span>View Details</span>
          <ExternalLink className="ml-2 h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
        </Button>
      </div>
    </motion.div>
  );
}