"use client";

import { useState, useEffect } from "react";
import { fetchWordDetails } from "@/lib/api";
import { WordDetail } from "@/lib/types";
import { Loader2, X, Volume2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface WordDetailsDialogProps {
  word: string | null;
  open: boolean;
  onClose: () => void;
}

export function WordDetailsDialog({ word, open, onClose }: WordDetailsDialogProps) {
  const [details, setDetails] = useState<WordDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open && word) {
      const fetchDetails = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await fetchWordDetails(word);
          setDetails(data);
        } catch (err) {
          setError("Failed to load word details. Please try again.");
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load word details",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    } else {
      // Reset state when dialog closes
      setDetails(null);
      setError(null);
    }
  }, [word, open, toast]);

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  const speakWord = () => {
    if (!word) return;
    
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
    
    toast({
      title: "Speaking",
      description: `Pronouncing: ${word}`,
      duration: 2000,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between">
            <div className="flex items-center">
              {details?.word}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 ml-2"
                onClick={speakWord}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          {details && (
            <DialogDescription className="text-base flex flex-wrap gap-2 mt-2">
              {details.meanings.map((meaning, index) => (
                <span 
                  key={index} 
                  className="inline-flex bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm"
                >
                  {meaning}
                </span>
              ))}
            </DialogDescription>
          )}
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span>Loading details...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                if (word) {
                  setLoading(true);
                  fetchWordDetails(word)
                    .then(setDetails)
                    .catch(() => setError("Failed to load word details."))
                    .finally(() => setLoading(false));
                }
              }}
            >
              Try Again
            </Button>
          </div>
        ) : details?.examples && details.examples.length > 0 ? (
          <div className="mt-4 space-y-6">
            <Separator />
            <div>
              <h3 className="text-lg font-medium mb-4">Examples</h3>
              <div className="space-y-4">
                {details.examples.map((example, index) => (
                  <div key={index} className="rounded-lg bg-muted/50 p-4">
                    <p className="font-medium text-card-foreground mb-2">
                      "{example.usage}"
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {example.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : details ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>No examples available for this word.</p>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}