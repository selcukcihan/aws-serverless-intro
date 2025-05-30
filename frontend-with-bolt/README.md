https://bolt.new/~/sb1-dffmpfpu

Generated with bolt.new

This is the prompt

Create a new folder named "app" and in that folder initialize a nextjs application which will be a dictionary of english words that I learn. It will talk to a public API.

The API has a single endpoint

GET /dev/words


which returns

```json
[
    {
        "word": "adhere",
        "meanings": [
            "Yap\u0131\u015fmak",
            "Ba\u011fl\u0131 kalmak",
            "Uymak"
        ]
    },
    {
        "word": "tackle",
        "meanings": [
            "Ele almak",
            "M\u00fcdahale etmek (Futbol)",
            "Malzeme"
        ]
    }
]
```

If you provide a query parameter "word" like

GET /dev/words?word=attempt

It will return details for that word like


```json
{
    "word": "attempt",
    "meanings": [
        "Giri\u015fim",
        "Te\u015febb\u00fcs",
        "Deneme"
    ],
    "examples": [
        {
            "usage": "This is my attempt to bake a cake.",
            "explanation": "Burada 'attempt', bir kek yapma 'giri\u015fimi' anlam\u0131nda kullan\u0131l\u0131yor."
        },
        {
            "usage": "The assassination attempt failed.",
            "explanation": "Burada 'attempt', bir suikast 'te\u015febb\u00fcs\u00fc' anlam\u0131nda kullan\u0131l\u0131yor."
        },
        {
            "usage": "I will attempt to answer all the questions.",
            "explanation": "Burada 'attempt', sorular\u0131 cevaplamaya 'deneyece\u011fim' anlam\u0131nda kullan\u0131l\u0131yor."
        }
    ]
}
```

Create a nextjs application with a single page that will load all words from the dictionary using the API.
Use client-side rendering as the static assets will be hosted on a CDN and the API will be consumed on the client.
For each word it should have a "details" button that will pop up a dialog and fetch details using the query parameter from the API
The page should have a client-side search functionality for searching through the words.
The page should have client-side pagination and should show each word as a tile.
The page should display as much words as it can on a page and then use pagination to navigate further pages.
The word tile should show the english word and it's at most three turkish translations.


