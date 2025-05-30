"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import WordDetail from "@/components/word-detail"
import { Search } from "lucide-react"

// Types
interface Word {
  word: string
  meanings: string[]
}

interface DetailedWord extends Word {
  examples: {
    usage: string
    explanation: string
  }[]
}

export default function DictionaryApp() {
  // State
  const [words, setWords] = useState<Word[]>([])
  const [filteredWords, setFilteredWords] = useState<Word[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWord, setSelectedWord] = useState<DetailedWord | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [loadingWords, setLoadingWords] = useState<Set<string>>(new Set())
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  const wordsPerPage = 30

  // Set client-side rendering flag
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load sample data
  useEffect(() => {
    const fetchWords = async () => {
      setIsInitialLoading(true)
      try {
        const response = await fetch("https://wvehuw4cld.execute-api.us-east-1.amazonaws.com/dev/words")
        const data = await response.json()
        setWords(data)
        setFilteredWords(data)
      } catch (error) {
        console.error("Error fetching words:", error)
      } finally {
        setIsInitialLoading(false)
      }
    }
    fetchWords()
  }, [])

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredWords(words)
    } else {
      const filtered = words.filter((word) => word.word.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredWords(filtered)
    }
    setCurrentPage(1)
  }, [searchQuery, words])

  // Calculate pagination
  const totalPages = Math.ceil(filteredWords.length / wordsPerPage)
  const startIndex = (currentPage - 1) * wordsPerPage
  const endIndex = startIndex + wordsPerPage
  const currentWords = filteredWords.slice(startIndex, endIndex)

  // Handle word selection
  const handleWordClick = async (word: string) => {
    setLoadingWords(prev => new Set(prev).add(word))
    try {
      const response = await fetch(`https://wvehuw4cld.execute-api.us-east-1.amazonaws.com/dev/words?word=${encodeURIComponent(word)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch word details')
      }
      const wordDetail = await response.json()
      setSelectedWord(wordDetail)
      setIsDetailOpen(true)
    } catch (error) {
      console.error('Error fetching word details:', error)
      // You might want to show an error message to the user here
    } finally {
      setLoadingWords(prev => {
        const newSet = new Set(prev)
        newSet.delete(word)
        return newSet
      })
    }
  }

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={currentPage === i} onClick={() => setCurrentPage(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return items
  }

  // Only render content on the client side
  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">English Learning Dictionary</h1>
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Loading screen
  if (isInitialLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">English Learning Dictionary</h1>
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          <p className="text-muted-foreground">Loading dictionary data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">English Learning Dictionary</h1>
        <div className="text-muted-foreground">
          Total words in dictionary: <Badge variant="outline">{filteredWords.length}</Badge>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search words..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Pagination */}
      <div className="mb-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {renderPaginationItems()}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Word cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentWords.map((word, index) => (
          <Card key={index} className="h-full">
            <CardHeader>
              <CardTitle className="text-xl">{word.word}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {word.meanings.map((meaning, idx) => (
                  <li key={idx} className="text-muted-foreground">
                    {meaning}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => handleWordClick(word.word)}
                disabled={loadingWords.has(word.word)}
                className="w-full"
              >
                {loadingWords.has(word.word) ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  "View Details"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredWords.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">No words found</h3>
          <div className="text-muted-foreground mt-2">Try adjusting your search query</div>
        </div>
      )}

      {/* Word detail modal */}
      {selectedWord && <WordDetail word={selectedWord} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />}
    </div>
  )
}
