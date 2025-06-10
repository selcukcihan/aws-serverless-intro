#!/bin/bash

# Read each line from words.txt and send it to SQS
while IFS= read -r word; do
    # Skip empty lines
    if [ -n "$word" ]; then
        aws sqs send-message \
            --queue-url https://sqs.us-east-1.amazonaws.com/195275674349/words \
            --message-body "$word"
    fi
done < "words.txt" 