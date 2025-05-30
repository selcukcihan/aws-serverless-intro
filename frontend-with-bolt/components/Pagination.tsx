"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Create pagination range
  const createPaginationRange = () => {
    const delta = 1; // Number of pages to show on each side of current page
    const range = [];
    
    // Always show first page
    range.push(1);
    
    // Calculate start and end of range
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);
    
    // Add ellipsis if needed before range
    if (rangeStart > 2) {
      range.push(-1); // Use -1 as a marker for ellipsis
    }
    
    // Add range pages
    for (let i = rangeStart; i <= rangeEnd; i++) {
      range.push(i);
    }
    
    // Add ellipsis if needed after range
    if (rangeEnd < totalPages - 1) {
      range.push(-2); // Use -2 as a second marker for ellipsis
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      range.push(totalPages);
    }
    
    return range;
  };

  const paginationRange = createPaginationRange();

  return (
    <nav className="flex justify-center items-center mt-8 space-x-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="h-9 w-9"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {paginationRange.map((page, index) => {
        if (page < 0) {
          return (
            <span 
              key={`ellipsis-${page}`} 
              className="w-9 h-9 flex items-center justify-center text-muted-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          );
        }
        
        return (
          <Button
            key={`page-${page}`}
            variant={page === currentPage ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page)}
            className="h-9 w-9"
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Button>
        );
      })}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="h-9 w-9"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}