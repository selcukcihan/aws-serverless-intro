import json
import boto3
import os
from datetime import datetime

s3 = boto3.client("s3")
sns = boto3.client("sns")
bucket_name = "aws-training-app-words"
sns_topic_arn = "arn:aws:sns:us-east-1:195275674349:weekly-words"


def lambda_handler(event, context):
    # Get the bucket name from environment variable

    try:
        # Fetch words.json from S3
        response = s3.get_object(Bucket=bucket_name, Key="words.json")
        words_data = json.loads(response["Body"].read().decode("utf-8"))

        # Get the last 5 words
        last_5_words = words_data[-5:]

        # Prepare email content
        email_content = "Haftalık Kelime Değerlendirmesi\n\n"
        email_content += "Son eklenen 5 kelime:\n\n"

        # Fetch details for each word
        for word in last_5_words:
            word_key = word["word"]
            try:
                # Fetch meaning.json for each word
                meaning_response = s3.get_object(
                    Bucket=bucket_name, Key=f"{word_key}/meaning.json"
                )
                meaning_data = json.loads(
                    meaning_response["Body"].read().decode("utf-8")
                )

                # Add word details to email content
                email_content += f"• {word_key.upper()}\n"

                # Add meanings
                if "meanings" in meaning_data:
                    email_content += "  Anlamlar:\n"
                    for meaning in meaning_data["meanings"]:
                        email_content += f"    - {meaning}\n"

                # Add examples with explanations
                if "examples" in meaning_data:
                    email_content += "  Örnekler:\n"
                    for example in meaning_data["examples"]:
                        email_content += f"    - Kullanım: {example['usage']}\n"
                        email_content += f"      Açıklama: {example['explanation']}\n"

                email_content += "\n"

            except Exception as e:
                print(f"Error fetching details for word {word_key}: {str(e)}")
                continue

        # Add timestamp
        email_content += (
            f"\nOluşturulma Tarihi: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        )

        # Send email through SNS
        response = sns.publish(
            TopicArn=sns_topic_arn,
            Subject="Haftalık Kelime Değerlendirmesi",
            Message=email_content,
        )

        print("Email sent successfully! Response: ", response)
        print("Email content: ", email_content)

        return {
            "statusCode": 200,
            "body": json.dumps("Weekly email sent successfully!"),
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {"statusCode": 500, "body": json.dumps(f"Error: {str(e)}")}


def main():
    lambda_handler(None, None)


if __name__ == "__main__":
    main()
