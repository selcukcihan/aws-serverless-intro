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
  dateAdded: string
  usages: {
    sentence: string
    explanation: string
  }[]
  link: string
}

export default function DictionaryApp() {
  // State
  const [words, setWords] = useState<Word[]>([])
  const [filteredWords, setFilteredWords] = useState<Word[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWord, setSelectedWord] = useState<DetailedWord | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const wordsPerPage = 30

  // Load sample data
  useEffect(() => {
    const fetchWords = async () => {
      const response = await fetch("https://wvehuw4cld.execute-api.us-east-1.amazonaws.com/dev/words")
      const data = await response.json()
      setWords(data)
      setFilteredWords(data)
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
    setIsLoading(true)

    // Simulate API call to fetch word details
    setTimeout(() => {
      const wordDetail = sampleWordDetails.find((detail) => detail.word === word)
      if (wordDetail) {
        setSelectedWord(wordDetail)
        setIsDetailOpen(true)
      }
      setIsLoading(false)
    }, 500)
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
                disabled={isLoading}
                className="w-full"
              >
                View Details
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

// Sample data - 50 words
const sampleWords: Word[] = [
  { word: "Abate", meanings: ["Azalmak", "Hafiflemek", "Yatışmak"] },
  { word: "Benevolent", meanings: ["Hayırsever", "İyi niyetli"] },
  { word: "Cacophony", meanings: ["Kakofoni", "Gürültü", "Ses karmaşası"] },
  { word: "Diligent", meanings: ["Çalışkan", "Gayretli", "Özenli"] },
  { word: "Ephemeral", meanings: ["Geçici", "Kısa ömürlü", "Fani"] },
  { word: "Fastidious", meanings: ["Titiz", "Müşkülpesent", "Seçici"] },
  { word: "Gregarious", meanings: ["Sosyal", "Cana yakın", "Topluluk halinde yaşayan"] },
  { word: "Harangue", meanings: ["Uzun ve saldırgan konuşma", "Nutuk atmak"] },
  { word: "Impetuous", meanings: ["Düşüncesiz", "Aceleci", "Telaşlı"] },
  { word: "Juxtapose", meanings: ["Yan yana koymak", "Karşılaştırmak"] },
  { word: "Kindle", meanings: ["Ateşlemek", "İlham vermek", "Heyecanlandırmak"] },
  { word: "Laconic", meanings: ["Az sözlü", "Özlü", "Kısa ve öz"] },
  { word: "Meticulous", meanings: ["Titiz", "Ayrıntılı", "Dikkatli"] },
  { word: "Nefarious", meanings: ["Kötü niyetli", "Alçakça", "Şeytani"] },
  { word: "Obfuscate", meanings: ["Bulanıklaştırmak", "Karmaşıklaştırmak", "Gizlemek"] },
  { word: "Panacea", meanings: ["Her derde deva", "Çözüm", "İlaç"] },
  { word: "Quixotic", meanings: ["Hayalperest", "Gerçekçi olmayan", "Ütopik"] },
  { word: "Resilient", meanings: ["Dirençli", "Esnek", "Dayanıklı"] },
  { word: "Sycophant", meanings: ["Dalkavuk", "Yağcı", "Yaltakçı"] },
  { word: "Taciturn", meanings: ["Az konuşan", "Sessiz", "İçine kapanık"] },
  { word: "Ubiquitous", meanings: ["Her yerde bulunan", "Yaygın"] },
  { word: "Vacillate", meanings: ["Kararsız kalmak", "Gidip gelmek", "Tereddüt etmek"] },
  { word: "Wistful", meanings: ["Hüzünlü", "Özlem dolu", "Melankolik"] },
  { word: "Xenophobia", meanings: ["Yabancı düşmanlığı", "Yabancı korkusu"] },
  { word: "Yearn", meanings: ["Özlemek", "Hasret çekmek", "Can atmak"] },
  { word: "Zealous", meanings: ["Hevesli", "Gayretli", "Coşkulu"] },
  { word: "Ambiguous", meanings: ["Belirsiz", "Muğlak", "Çift anlamlı"] },
  { word: "Brevity", meanings: ["Kısalık", "Özlük", "Vecizlik"] },
  { word: "Conundrum", meanings: ["Bilmece", "Zor problem", "Çıkmaz"] },
  { word: "Disparate", meanings: ["Farklı", "Çeşitli", "Ayrı"] },
  { word: "Eloquent", meanings: ["Belagatli", "Güzel konuşan", "İfade gücü yüksek"] },
  { word: "Fortuitous", meanings: ["Tesadüfi", "Şanslı", "Rastlantısal"] },
  { word: "Garrulous", meanings: ["Geveze", "Çok konuşan", "Lafazan"] },
  { word: "Hedonist", meanings: ["Hazcı", "Zevk düşkünü", "Keyif ehli"] },
  { word: "Insidious", meanings: ["Sinsi", "Aldatıcı", "Hain"] },
  { word: "Jovial", meanings: ["Neşeli", "Şen", "Keyifli"] },
  { word: "Kaleidoscope", meanings: ["Kaleydoskop", "Renk cümbüşü", "Sürekli değişen desen"] },
  { word: "Lethargic", meanings: ["Uyuşuk", "Halsiz", "Miskin"] },
  { word: "Mundane", meanings: ["Sıradan", "Dünyevi", "Alelade"] },
  { word: "Nuance", meanings: ["İnce ayrım", "Nüans", "Anlam farkı"] },
  { word: "Ostentatious", meanings: ["Gösterişli", "Cafcaflı", "Şatafatlı"] },
  { word: "Pragmatic", meanings: ["Pragmatik", "Faydacı", "Pratik"] },
  { word: "Quintessential", meanings: ["Özünü oluşturan", "Tipik", "En mükemmel örnek"] },
  { word: "Rambunctious", meanings: ["Gürültücü", "Taşkın", "Hareketli"] },
  { word: "Stoic", meanings: ["Duygusuz", "Metanetli", "Dayanıklı"] },
  { word: "Trepidation", meanings: ["Endişe", "Korku", "Telaş"] },
  { word: "Unequivocal", meanings: ["Kesin", "Net", "Açık seçik"] },
  { word: "Verbose", meanings: ["Uzun sözlü", "Gereksiz ayrıntılı", "Sözü uzatan"] },
  { word: "Whimsical", meanings: ["Kaprisli", "Fantastik", "Değişken"] },
  { word: "Zeal", meanings: ["Şevk", "Gayret", "Heves"] },
]

// Sample word details
const sampleWordDetails: DetailedWord[] = [
  {
    word: "Abate",
    meanings: ["Azalmak", "Hafiflemek", "Yatışmak"],
    dateAdded: "2023-05-15",
    usages: [
      {
        sentence: "The storm began to abate as the evening approached.",
        explanation:
          "Fırtına akşama doğru hafiflemeye başladı. Burada 'abate' kelimesi bir doğa olayının şiddetinin azalması anlamında kullanılmış.",
      },
      {
        sentence: "His anger abated after he took a few deep breaths.",
        explanation:
          "Birkaç derin nefes aldıktan sonra öfkesi yatıştı. Burada 'abate' kelimesi bir duygunun yoğunluğunun azalması anlamında kullanılmış.",
      },
      {
        sentence: "The government introduced new measures to abate pollution.",
        explanation:
          "Hükümet kirliliği azaltmak için yeni önlemler getirdi. Burada 'abate' kelimesi bir sorunu azaltmak veya hafifletmek anlamında kullanılmış.",
      },
    ],
    link: "https://dictionary.cambridge.org/dictionary/english/abate",
  },
  {
    word: "Benevolent",
    meanings: ["Hayırsever", "İyi niyetli"],
    dateAdded: "2023-05-16",
    usages: [
      {
        sentence: "The benevolent donor gave millions to the charity.",
        explanation:
          "Hayırsever bağışçı, hayır kurumuna milyonlarca para bağışladı. Burada 'benevolent' kelimesi cömert ve yardımsever bir kişiyi tanımlamak için kullanılmış.",
      },
      {
        sentence: "She had a benevolent smile that made everyone feel welcome.",
        explanation:
          "Herkesi kendini hoş karşılanmış hissettiren iyi niyetli bir gülümsemesi vardı. Burada 'benevolent' kelimesi sıcak ve iyi niyetli bir ifadeyi tanımlamak için kullanılmış.",
      },
      {
        sentence: "The king was known for his benevolent rule over the kingdom.",
        explanation:
          "Kral, krallık üzerindeki hayırsever yönetimiyle tanınırdı. Burada 'benevolent' kelimesi adil ve iyi niyetli bir yönetim tarzını tanımlamak için kullanılmış.",
      },
    ],
    link: "https://dictionary.cambridge.org/dictionary/english/benevolent",
  },
  {
    word: "Cacophony",
    meanings: ["Kakofoni", "Gürültü", "Ses karmaşası"],
    dateAdded: "2023-05-17",
    usages: [
      {
        sentence: "The cacophony of the city streets made it difficult to hear the phone ring.",
        explanation:
          "Şehir sokaklarının kakofonisi (gürültüsü), telefon çalışını duymayı zorlaştırdı. Burada 'cacophony' kelimesi rahatsız edici ve karışık sesler için kullanılmış.",
      },
      {
        sentence: "A cacophony of voices filled the room as everyone tried to speak at once.",
        explanation:
          "Herkes aynı anda konuşmaya çalışırken odayı bir ses kakofonisi (karmaşası) doldurdu. Burada 'cacophony' kelimesi birbiriyle çakışan ve anlaşılmaz hale gelen sesler için kullanılmış.",
      },
      {
        sentence: "The orchestra produced a cacophony of sound during their warm-up.",
        explanation:
          "Orkestra ısınma sırasında bir ses kakofonisi üretti. Burada 'cacophony' kelimesi uyumsuz ve düzensiz müzikal sesler için kullanılmış.",
      },
    ],
    link: "https://dictionary.cambridge.org/dictionary/english/cacophony",
  },
  {
    word: "Diligent",
    meanings: ["Çalışkan", "Gayretli", "Özenli"],
    dateAdded: "2023-05-18",
    usages: [
      {
        sentence: "She was a diligent student who always completed her assignments on time.",
        explanation:
          "O, ödevlerini her zaman zamanında tamamlayan çalışkan bir öğrenciydi. Burada 'diligent' kelimesi sorumluluklarını titizlikle yerine getiren birini tanımlamak için kullanılmış.",
      },
      {
        sentence: "His diligent research led to a major breakthrough in the field.",
        explanation:
          "Onun özverili araştırması, alanda büyük bir atılıma yol açtı. Burada 'diligent' kelimesi dikkatli ve sürekli çaba gösteren bir çalışma tarzını tanımlamak için kullanılmış.",
      },
      {
        sentence: "The detective was diligent in following every lead in the case.",
        explanation:
          "Dedektif, davadaki her ipucunu takip etmekte özenli davrandı. Burada 'diligent' kelimesi titiz ve detaylı bir çalışma yaklaşımını tanımlamak için kullanılmış.",
      },
    ],
    link: "https://dictionary.cambridge.org/dictionary/english/diligent",
  },
  {
    word: "Ephemeral",
    meanings: ["Geçici", "Kısa ömürlü", "Fani"],
    dateAdded: "2023-05-19",
    usages: [
      {
        sentence: "The beauty of cherry blossoms is ephemeral, lasting only a few days.",
        explanation:
          "Kiraz çiçeklerinin güzelliği, sadece birkaç gün süren, geçicidir. Burada 'ephemeral' kelimesi çok kısa süren doğal bir güzelliği tanımlamak için kullanılmış.",
      },
      {
        sentence: "Fame can be ephemeral, especially in the age of social media.",
        explanation:
          "Şöhret, özellikle sosyal medya çağında geçici olabilir. Burada 'ephemeral' kelimesi kalıcı olmayan, hızla gelip geçen bir durumu tanımlamak için kullanılmış.",
      },
      {
        sentence: "The artist specialized in ephemeral installations that disappeared after a day.",
        explanation:
          "Sanatçı, bir gün sonra kaybolan geçici enstalasyonlarda uzmanlaşmıştı. Burada 'ephemeral' kelimesi kasıtlı olarak kısa süreli tasarlanmış sanat eserlerini tanımlamak için kullanılmış.",
      },
    ],
    link: "https://dictionary.cambridge.org/dictionary/english/ephemeral",
  },
  // Other word details would be updated similarly
]
