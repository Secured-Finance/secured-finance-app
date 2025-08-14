#!/bin/bash
# Script to run tests locally in the same environment as CI

echo "Running tests in Docker container (same environment as CI)..."

# Check if NPM_AUTH_TOKEN is set
if [ -z "$NPM_AUTH_TOKEN" ]; then
    echo "Error: NPM_AUTH_TOKEN is not set"
    echo "Please set it with: export NPM_AUTH_TOKEN=your_github_pat"
    exit 1
fi

# Build the test container
docker build -f Dockerfile.test \
    --build-arg NPM_AUTH_TOKEN=$NPM_AUTH_TOKEN \
    -t secured-finance-test .

# Run tests
docker run --rm secured-finance-test