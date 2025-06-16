## Setting up the backend

1. Create poller.py in backend

```
Write the meanings of "{INSERT_WORD_HERE}" in Turkish.
Provide no more than 3 meanings.
For each meaning, write an example usage of the word in English, with an explanation of its usage in Turkish.

I expect a json file as output, in this format:

For the word "adhere":

{
    "word": "adhere",
    "meanings": [
        "Yapışmak",
        "Bağlı olmak"
    ],
    "examples": [
        {
            "usage": "Glue won't adhere to any surface that's wet.",
            "explanation": "Burada adhere, yapışmak anlamında kullanılmış."
        },
        {
            "usage": "I do not adhere to any organized religion",
            "explanation": "Herhangi bir dine bağlı olmadığını belirtirken adhere kelimesini kullanmış.
        }
    ]
}
```

2. Initialize Python env:

```bash
python3 -m venv localenv
source localenv/bin/activate
pip install -r requirements.txt
```

3. Set up AWS CLI & api keys to use through the SDK when running locally

4. The prompt for generating the api lambda code:

```
Implement the handler method which will be attached to an API Gateway endpoint. The API Gateway will have an endpoint

1. GET /words
2. GET /words?word={THE_WORD}

For the first use case, the lambda should fetch data from aws-training-app-words bucket's "words.json" file and return all the words as is.

For the second use case, lambda should fetch data from the same bucket but from the word specific key which is "{WORD}/meaning.json" and return it as a whole.

The lambda will be configured to be invoked as a proxy integration from API Gateway.
```

5. The prompt for creating a bash script to package api lambda for upload

```
Create a bash script that will zip the api.py file and its dependencies to be uploaded to AWS Lambda as a lambda function.

Bundle all the dependencies declared in requirements.txt file in the lambda package zip because they will be needed at the runtime on AWS Lambda.

Change the create_lambda_package.sh such that it will work for any lambda. The input to it should be the name of the lambda function definition file like api.py or poller.py. It should create the corresponding lambda package exactly like it does now.
```

6. Package the lambdas and create them on the console. Remember to edit the file and method names on lambda console.

* Remember to choose the correct architecture, for instance if lambda was created as x86 and you are on mac arm architecture, then the package script should take this into account
* Remember to use the same python version as your local setup
* See https://stackoverflow.com/questions/76650856/no-module-named-pydantic-core-pydantic-core-in-aws-lambda-though-library-is-i if you run into issues with pydantic on arm architecture

7. Increase lambda timeout and deploy the package.

8. Create the S3 bucket for json data with default settings

9. Create API Gateway endpoint

* Choose REST API
* Create resource: words
* Create method, lambda proxy integration
* Also add "word" as a query string parameter
* Do not create api key

10. If you invoke now you'll get 

```json
{"error": "An error occurred (AccessDenied) when calling the GetObject operation: User: arn:aws:sts::195275674349:assumed-role/api-role-0rb94tto/api is not authorized to perform: s3:GetObject on resource: \"arn:aws:s3:::aws-training-app-words/words.json\" because no identity-based policy allows the s3:GetObject action"}
```

11. IAM => role => grant permission for S3

12. For poller lambda, parse the input event to extract the word

```
Write an AWS lambda handler function in poller.py where it's configured to be triggered through SQS. The message in the SQS queue will be an unformatted text which will be an English word. Lambda handler should extract the word from the input event which will be a batch of words and it will iterate over and call process_word.
```

13. Create poller lambda on AWS console

14. Upload the zip file after creating it with `./create_lambda_package.sh poller.py`

15. Change the runtime settings to set handler as `poller.lambda_handler`

16. Create an environment variable named "GOOGLE_API_KEY" on the AWS Lambda console with your Google API key.

17. Create the SQS queue named "words" and configure a lambda trigger, select your poller lambda.

> Error code: InvalidParameterValueException. Error message: The function execution role does not have permissions to call ReceiveMessage on SQS

You need to first grant lambda permission to poll the queue (edit the lambda role's policy, add statements for S3 and SQS)

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup"
            ],
            "Resource": [
                "arn:aws:logs:us-east-1:195275674349:*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": [
                "arn:aws:logs:us-east-1:195275674349:log-group:/aws/lambda/poller:*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "sqs:*"
            ],
            "Resource": [
                "arn:aws:sqs:us-east-1:195275674349:words"
            ]
        },
        {
            "Sid": "Statement1",
            "Effect": "Allow",
            "Action": [
                "s3:*"
            ],
            "Resource": [
                "arn:aws:s3:::aws-training-app-words"
            ]
        }
    ]
}
```

18. Go to Lambda Console and edit trigger batch size, set it to 1.

19. Increase Lambda timeout to 60 seconds just in case.

20. Start ingesting words

```bash
aws sqs send-message --queue-url https://sqs.us-east-1.amazonaws.com/195275674349/words --message-body "purpose"
```

21. To set up a weekly words reminder, create an SNS topic and subscribe your email to it.

22. Then create the lambda with this prompt

```
Write an AWS Lambda function handler that will be triggered each week. It should fetch words.json from S3 and select the last 5 words from there. For each of these words it should fetch the details from {word}/meaning.json and prepare an email to be sent with boto3 through SNS. The email should list the 5 words and their details in a nice text format with bullet points etc.

Change the email content according to the input files. The files on S3 for word details look like

{
    "word": "tackle",
    "meanings": [
        "Ele almak",
        "M\u00fcdahale etmek (Futbol)",
        "Malzeme"
    ],
    "examples": [
        {
            "usage": "I'm going to tackle the problem.",
            "explanation": "Bu c\u00fcmlede 'tackle', bir problemi ele almak, \u00e7\u00f6zmek i\u00e7in harekete ge\u00e7mek anlam\u0131nda kullan\u0131lm\u0131\u015ft\u0131r. 'Bu sorunu ele alaca\u011f\u0131m/\u00e7\u00f6zece\u011fim' \u015feklinde \u00e7evrilebilir."
        },
        {
            "usage": "The defender made a clean tackle.",
            "explanation": "Burada 'tackle', futbolda topu kapmak i\u00e7in yap\u0131lan m\u00fcdahale anlam\u0131nda kullan\u0131lm\u0131\u015ft\u0131r. 'Defans oyuncusu temiz bir m\u00fcdahale yapt\u0131' \u015feklinde \u00e7evrilebilir."
        },
        {
            "usage": "Fishing tackle can be expensive.",
            "explanation": "Burada 'tackle', bal\u0131k tutma malzemeleri anlam\u0131na gelmektedir. 'Bal\u0131k tutma malzemeleri pahal\u0131 olabilir' \u015feklinde \u00e7evrilebilir."
        }
    ]
}
```
