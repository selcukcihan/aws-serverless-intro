import json
import os
from typing import Dict, List, Any, Optional
import boto3


def handler(event, context):
    """
    Lambda handler for API Gateway proxy integration.
    Handles two endpoints:
    1. GET /words - Returns all words from words.json
    2. GET /words?word={THE_WORD} - Returns specific word meaning
    """
    # Initialize S3 client
    s3_client = boto3.client('s3')
    bucket_name = "aws-training-app-words"
    
    # Get query parameters
    query_params = event.get('queryStringParameters', {}) or {}
    word = query_params.get('word')
    
    try:
        if word:
            # Case 2: Get specific word meaning
            object_key = f"{word}/meaning.json"
            response = s3_client.get_object(Bucket=bucket_name, Key=object_key)
            word_data = json.loads(response['Body'].read().decode('utf-8'))
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(word_data)
            }
        else:
            # Case 1: Get all words
            response = s3_client.get_object(Bucket=bucket_name, Key="words.json")
            words_data = json.loads(response['Body'].read().decode('utf-8'))
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(words_data)
            }
    except s3_client.exceptions.NoSuchKey:
        # Handle case when the requested resource doesn't exist
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Resource not found'})
        }
    except Exception as e:
        # Handle other exceptions
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
