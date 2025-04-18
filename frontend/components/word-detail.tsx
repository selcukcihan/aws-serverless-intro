"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface WordDetailProps {
  word: {
    word: string
    meanings: string[]
    examples: {
      usage: string
      explanation: string
    }[]
  }
  isOpen: boolean
  onClose: () => void
}

export default function WordDetail({ word, isOpen, onClose }: WordDetailProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{word.word}</DialogTitle>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{word.word}</h2>
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
              {word.examples.map((example, idx) => (
                <Card key={idx} className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="font-medium italic">&quot;{example.usage}&quot;</div>
                    <div className="text-muted-foreground mt-2">{example.explanation}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
