#!/bin/bash

# Check if a file name was provided
if [ $# -eq 0 ]; then
    echo "Error: Please provide the lambda function file name"
    echo "Usage: $0 <lambda_function_file>"
    echo "Example: $0 api.py"
    exit 1
fi

LAMBDA_FILE=$1
PACKAGE_NAME="${LAMBDA_FILE%.*}_package"

# Create a temporary directory for packaging
mkdir -p .lambda_package_${PACKAGE_NAME}

# Copy the lambda function file to the package directory
cp ${LAMBDA_FILE} .lambda_package_${PACKAGE_NAME}/
cp genai.prompt .lambda_package_${PACKAGE_NAME}/

# Install dependencies into the package directory
pip install \
    --platform manylinux2014_x86_64 \
    --python-version 3.9 \
    --implementation cp \
    --only-binary=:all: --upgrade \
    -r requirements.txt \
    -t .lambda_package_${PACKAGE_NAME}/

# Create a zip file from the package directory
cd .lambda_package_${PACKAGE_NAME}
zip -r ../${PACKAGE_NAME}.zip .
cd ..

# Clean up the temporary directory
rm -rf .lambda_package_${PACKAGE_NAME}

echo "Lambda package created: ${PACKAGE_NAME}.zip"
