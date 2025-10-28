#!/bin/bash

# Deploy Frontend to Cloud Run

set -e

# Configuration
PROJECT_ID="website-mcp"
REGION="us-central1"
SERVICE_NAME="mcp-test-paygate-web"
BACKEND_SERVICE_NAME="mcp-test-paygate-api"

# Get backend URL
BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE_NAME --region=$REGION --format='value(status.url)')

echo "Building and deploying frontend to Cloud Run..."
echo "Service: $SERVICE_NAME"
echo "Backend URL: $BACKEND_URL"
echo ""

cd ../frontend

# Create .env for build
cat > .env.production <<EOF
VITE_API_URL=$BACKEND_URL
VITE_RECAPTCHA_SITE_KEY=6LfTFPkrAAAAADyZpCIe8Op8s6L3QvVZea0TRpT2
EOF

# Build and deploy with Cloud Build
gcloud run deploy $SERVICE_NAME \
    --source . \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --max-instances=10 \
    --min-instances=0 \
    --memory=256Mi \
    --cpu=1 \
    --timeout=300 \
    --port=80

# Get the service URL
FRONTEND_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')

# Clean up
rm -f .env.production

echo ""
echo "==================================="
echo "Frontend Deployed Successfully!"
echo "==================================="
echo ""
echo "Frontend URL: $FRONTEND_URL"
echo "Backend URL: $BACKEND_URL"
echo ""
echo "You can now visit: $FRONTEND_URL"
echo ""
