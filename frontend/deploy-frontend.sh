#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting frontend deployment process..."

# Navigate to frontend directory (in case script is run from parent directory)
cd "$(dirname "$0")"

echo "📦 Building frontend application..."
npm run build

echo "📤 Uploading build files to S3..."
aws s3 sync out/ s3://aws-training-app-hosting/ --delete

echo "🔄 Creating CloudFront invalidation..."
aws cloudfront create-invalidation \
    --distribution-id E2JL3KGOIZRTOJ \
    --paths "/*"

echo "✅ Deployment completed successfully!" 