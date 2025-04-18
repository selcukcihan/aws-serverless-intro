from google import genai
import os
import json
import boto3
from typing import Dict, Any, List
from pydantic import BaseModel

class Example(BaseModel):
    usage: str
    explanation: str

class WordMeaning(BaseModel):
    word: str
    meanings: List[str]
    examples: List[Example]

prompt_template = ""
client = None
s3_client = None
BUCKET_NAME = "aws-training-app-words"
WORDS_FILE_KEY = "words.json"

def initialize_genai():
    global prompt_template
    global client
    global s3_client
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY environment variable is not set")
    
    client = genai.Client(api_key=api_key)
    s3_client = boto3.client('s3')

    # Read the prompt template
    with open("./genai.prompt", "r") as f:
        prompt_template = f.read()

initialize_genai()

def get_word_meaning(word: str) -> Dict[str, Any]:
    # Replace the placeholder with the actual word
    prompt = prompt_template.replace("{INSERT_WORD_HERE}", word)
    
    # Generate content using Gemini
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
            'response_schema': WordMeaning,
        },
    )

    # Extract the response text
    response_text = response.text
    print(response_text)
    # Parse the JSON response
    try:
        result = json.loads(response_text)
        
        # Validate the response format
        required_keys = ["word", "meanings", "examples"]
        if not all(key in result for key in required_keys):
            raise ValueError("Response missing required keys")
        
        # Validate examples format
        for example in result["examples"]:
            if not all(key in example for key in ["usage", "explanation"]):
                raise ValueError("Example missing required keys")
        
        return result
    except json.JSONDecodeError:
        raise ValueError("Failed to parse Gemini response as JSON")

def save_word_to_s3(word: str, meaning_data: Dict[str, Any]):
    """Save the word meaning to S3 and update the words.json file"""
    # Save the full meaning data to S3
    object_key = f"{word}/meaning.json"
    s3_client.put_object(
        Bucket=BUCKET_NAME,
        Key=object_key,
        Body=json.dumps(meaning_data, indent=2),
        ContentType='application/json'
    )
    print(f"Saved {word} meaning to S3: {object_key}")
    
    # Update the words.json file
    update_words_json(word, meaning_data)

def update_words_json(word: str, meaning_data: Dict[str, Any]):
    """Update the words.json file with the new word meaning"""
    # Try to get the existing words.json file
    try:
        response = s3_client.get_object(Bucket=BUCKET_NAME, Key=WORDS_FILE_KEY)
        words_data = json.loads(response['Body'].read().decode('utf-8'))
    except s3_client.exceptions.NoSuchKey:
        # If the file doesn't exist, create a new empty list
        words_data = []
    
    # Check if the word already exists in the list
    word_exists = False
    for item in words_data:
        if item["word"] == word:
            # Update the existing word
            item["meanings"] = meaning_data["meanings"]
            word_exists = True
            break
    
    # If the word doesn't exist, add it to the list
    if not word_exists:
        words_data.append({
            "word": word,
            "meanings": meaning_data["meanings"]
        })
    
    # Save the updated words.json file back to S3
    s3_client.put_object(
        Bucket=BUCKET_NAME,
        Key=WORDS_FILE_KEY,
        Body=json.dumps(words_data, indent=2),
        ContentType='application/json'
    )
    print(f"Updated words.json in S3")

def process_word(word: str):
    """Process a word: get its meaning and save it to S3"""
    meaning = get_word_meaning(word)
    save_word_to_s3(word, meaning)
    return meaning

def main():
    word = "adhere"
    meaning = process_word(word)
    print(f"Processed word: {word}")

if __name__ == "__main__":
    main()
