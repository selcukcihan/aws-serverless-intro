For the purpose of the course, we'll be developing an example app.
I've used generative ai to come up with suggestions.

## App Idea Prompt

I'll be giving an online course on AWS.
It's an introductory course and we'll cover basics of AWS and the most popular services.
I want to create a demo app as part of the course with the students so they can follow and create the app on their own AWS accounts.
The app should use S3 + CloudFront to serve the frontend.
The backend API should be on API Gateway + Lambda.
To keep things simple the backend API should be a public endpoint without authentication, but it should only cover the read-only paths.
We won’t have a “user” concept and we won’t have authentication, the app will be public (readonly).
For mutations of data, we want to use SQS and push data via CLI to SQS where another lambda will be consuming SQS and receive and process the data and finally write to S3.
The data ingested can be URLs and we can then crawl those URLs to extract opengraph metadata, images etc.
We can use gen-ai or some free 3rd party api to enhance the data on the write path.
S3 will be our only storage, it will store not only the frontend assets like html, css and js; but it will also store the user data ingested through SQS.
We want to use SNS as well to send an email to a user.

Can you come up with some web app ideas suitable for such a course?
Please give details on how and when each service would be used.
The apps should be fun to build, so please do not suggest boring ideas like a todo app.
Make it interesting and fun to work with.

Give me ten such ideas. Just mention the app name, brief explanation and how it will look like and used.

## App Ideas

- Meme Generator & Gallery
- Movie Quote Matcher
- Travel Photo Story Generator
- News Headline Analyzer

### Movie/TV Show Collector
  * Frontend: Media gallery with rich previews
  * API Gateway + Lambda: Browse collection
  * CLI → SQS: Submit IMDB/Netflix/similar URLs
  * Processing Lambda: Extract ratings, cast, posters, trailers
  * S3: Store media metadata and images
  * SNS: New release notifications
  * Extra: AI-generated watch recommendations

### Movie Explorer
  * Description: A public app to browse movies. Users submit movie URLs via CLI, and the app fetches metadata like title, description, and poster.
  * S3 + CloudFront: Serve the frontend and store movie data.
  * API Gateway + Lambda: Provide a public API to fetch movie details.
  * SQS: Accept movie URLs for ingestion.
  * SNS: Notify users about new movies.
  * Look: A carousel of movie posters with details.

### Tech Blog Aggregator
  * Frontend: Tech article previews and recommendations
  * API Gateway + Lambda: Browse and search articles
  * CLI → SQS: Submit tech blog URLs
  * Processing Lambda: Extract article content, author, tags, code snippets
  * S3: Store article metadata and assets
  * SNS: Alert on new articles matching interests
  * Extra: AI categorization and topic extraction

### Link Preview Generator
  * Frontend: Gallery of rich link previews with thumbnails
  * API Gateway + Lambda: Get saved previews
  * CLI → SQS: Submit URLs to process
  * Processing Lambda: Extract OG tags, screenshots, favicons, main content
  * S3: Store extracted metadata, images, and thumbnails
  * SNS: Notify when new interesting content is discovered
  * Extra: Use AI to generate content summaries

### Tech News Aggregator
  * Description: A public app to browse tech news articles. Users submit article URLs via CLI, and the app fetches metadata like title, description, and image.
  * S3 + CloudFront: Serve the frontend and store article data.
  * API Gateway + Lambda: Provide a public API to fetch articles.
  * SQS: Accept article URLs for ingestion.
  * SNS: Notify users about trending articles.
  * Look: A news feed with article previews.

### Travel Bucket List
  * Description: A public app showcasing popular travel destinations. Users can submit destination URLs via CLI, and the app fetches metadata like images and descriptions.
  * S3 + CloudFront: Serve the frontend and store destination data.
  * API Gateway + Lambda: Provide a public API to fetch destinations.
  * SQS: Accept destination URLs for ingestion.
  * SNS: Send email updates about new destinations.
  * Look: A map-based interface with clickable destination pins.
