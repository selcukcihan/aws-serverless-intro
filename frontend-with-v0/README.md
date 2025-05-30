This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## [v0.dev](https://v0.dev)

To build a nice UI, I've used v0.dev.

https://v0.dev/chat/english-dictionary-app-UlcC6k13wE1

### Prompt
```
Create a single page client-side rendered web application to serve as a dictionary when learning English.
The app will be read-only.
New words will be ingested manually on the backend, so do not put any UI element to suggest the user can add words.
The app should be read-only.
The app can assume it will fetch all the words and their meanings at once from the server.
But it still needs to do client-side pagination as the list might be too long.
Try to come up with a UI that shows each word and its meanings in a card, where a row can have 3 cards.
A page will have around 30 words, so it will be like 10 rows.
At the top put the pagination buttons.
Also display the total number of words in the dictionary at the top as a meta information.
Each card should have a link that the user can click to view the details of the word.
The details for each word will need to be fetched from the server when user clicks the card to view details.

You can assume the backend will have two APIs:

1. All the words in the dictionary currently, with this format:

[
  {
    "word": "SOME_WORD_THAT_I_STUMBLED_UPON",
    "meanings": ["MEANINGs_OF_THE_WORD_IN_TURKISH_1", "ANOTHER_LESS_FREQUENT_MEANING"]
  },
  {
    "word": "ANOTHER_WORD_THAT_I_STUMBLED_UPON",
    "meanings": ["MEANINGs_OF_THE_OTHER_WORD_IN_TURKISH_1", "ANOTHER_LESS_FREQUENT_MEANING_2"]
  }
]

2. When clicked on a word, the client will fetch details of the word and the response from this second API looks like:

{
  "word": "SOME_WORD_THAT_I_STUMBLED_UPON",
  "meanings": ["MEANINGs_OF_THE_WORD_IN_TURKISH_1", "ANOTHER_LESS_FREQUENT_MEANING"],
  "dateAdded": "the date when this word was added",
  "usages": [
    {
      "sentence": "An example sentence using the word",
      "explanation": "Explanation in Turkish how it was used"
    }
  ],
  "link": "external link to cambridge dictionary"
}

Since the client will have all the words in the dictionary, I want to implement a client-side search functionality.
Put a search box at the top, users can search for a word and we should filter the words and show only those.

Make it look very modern and easy to use.
You can add any other functionality that you think would serve well for this purpose of learning English and recording the words that we've just learnt.

For now, just generate 50 such words and hard-code them on the frontend.
I'll replace them with a call to the backend once it's ready.

The meanings should be in Turkish. The details dialog box should just show the usages and each usage must be in English but with a Turkish explanation of how it was used.
```
