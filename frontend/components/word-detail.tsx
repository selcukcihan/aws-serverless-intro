"use client"
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Calendar } from "lucide-react"

interface WordDetailProps {
  word: {
    word: string
    meanings: string[]
    dateAdded: string
    usages: {
      sentence: string
      explanation: string
    }[]
    link: string
  }
  isOpen: boolean
  onClose: () => void
}

export default function WordDetail({ word, isOpen, onClose }: WordDetailProps) {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-col space-y-1.5 text-center sm:text-left">
          {/* Removed DialogTitle completely and using h2 directly */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{word.word}</h2>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(word.dateAdded)}</span>
            </Badge>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <div className="space-y-2 mb-4">
            <h3 className="text-lg font-medium">Anlamlar:</h3>
            <ul className="list-disc list-inside space-y-1">
              {word.meanings.map((meaning, idx) => (
                <li key={idx} className="text-muted-foreground">
                  {meaning}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium mb-3">Örnek Kullanımlar:</h3>
            <div className="space-y-4">
              {word.usages.map((usage, idx) => (
                <Card key={idx} className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="font-medium italic">"{usage.sentence}"</div>
                    <div className="text-muted-foreground mt-2">{usage.explanation}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={() => window.open(word.link, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
            Cambridge Dictionary
          </Button>
          <Button onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
