# AWS Basics & Serverless on AWS

You can view the slides on

* Session 0: https://docs.google.com/presentation/d/1yczZrcitxcGnT5NR1Ivt0V8lPDY0-084L097qhDTKuA/edit?usp=sharing
* Session 1: https://docs.google.com/presentation/d/15KXQrwhxezZuGe2UIl6lMB5wrBXeulpyLER1klIIMiM/edit?usp=sharing
* Session 2: https://docs.google.com/presentation/d/1GDp5BSqT5pqxGWs3wIpdE9KOYRNmyXjPoZ_QbvB6uT0/edit?usp=sharing
* Session 3: https://docs.google.com/presentation/d/1F1V6E5WcMN3XSQPL0JDOpGMrFC-LJOMIv-v-OzsxMR0/edit?usp=sharing

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
There are two flavours of the frontend, implemented with v0.dev & bolt.new.