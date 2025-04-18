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

7. Increase lambda timeout and deploy the package.

8. Create the S3 bucket for json data with default settings

9. Create API Gateway endpoint

* Choose REST API
* Create resource: words
* Create method, lambda proxy integration
* Also add "word" as a query string parameter with caching
* Do not create api key

10. If you invoke now you'll get 

```json
{"error": "An error occurred (AccessDenied) when calling the GetObject operation: User: arn:aws:sts::195275674349:assumed-role/api-role-0rb94tto/api is not authorized to perform: s3:GetObject on resource: \"arn:aws:s3:::aws-training-app-words/words.json\" because no identity-based policy allows the s3:GetObject action"}
```

11. IAM => role => grant permission for S3
