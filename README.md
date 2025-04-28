# AWS Basics & Serverless on AWS

You can view the slides on

* Session 1: https://docs.google.com/presentation/d/1yczZrcitxcGnT5NR1Ivt0V8lPDY0-084L097qhDTKuA/edit?usp=sharing
* Session 2: https://docs.google.com/presentation/d/15KXQrwhxezZuGe2UIl6lMB5wrBXeulpyLER1klIIMiM/edit?usp=sharing


We'll use these services to create a demo application, while learning how to build serverless solutions on AWS.

- S3
- Lambda
- API Gateway
- SNS
- SQS
- CloudFront

## System Architecture

* Frontend is served from S3 through a CloudFront distribution.
* API is on API Gateway and attached to an "api" lambda function.
* "api" lambda reads from S3 and serves the two read paths:
  * list all words
  * get details of a word
* New words can be added to the system through SQS.
* Another lambda, let's call it "sqs" lambda, polls SQS and processes new words to ingest them into the system.
* On another S3 bucket, we store all words and their meanings in a single file named "dictionary.json"
* And we have another type of file, this time for each word, it contains the details of that word and it's named "{word}.json"
* The "sqs" lambda uses Google's gemini API to come up with the details for a word (it's meaning, example uses etc.)
* There's another lambda that runs weekly and summarizes the words for that week in an email sent through SNS.

## Demo Application

I've evaluated some ideas from generative ai and you can view those on [APP_IDEAS.md](./APP_IDEAS.md)

I've chosen to build a dictionary application, which can be used when learning English.

### [v0.dev](https://v0.dev)

To build a nice UI, I've used v0.dev.

https://v0.dev/chat/english-dictionary-app-UlcC6k13wE1

#### Prompt
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
