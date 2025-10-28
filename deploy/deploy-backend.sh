#!/bin/bash

# Deploy Backend to Cloud Run

set -e

# Configuration
PROJECT_ID="your-gcp-project-id"  # CHANGE THIS
REGION="us-central1"
SERVICE_NAME="mcp-test-paygate-api"
DB_INSTANCE_NAME="mcp-test-paygate-db"
DB_NAME="paygate_prime"
DB_USER="paygate_user"

# Get Cloud SQL connection name
CONNECTION_NAME=$(gcloud sql instances describe $DB_INSTANCE_NAME --format='value(connectionName)')

# Get database password from Secret Manager
DB_PASSWORD=$(gcloud secrets versions access latest --secret="mcp-test-db-password")

echo "Building and deploying backend to Cloud Run..."
echo "Service: $SERVICE_NAME"
echo ""

cd ../backend

# Build and deploy with Cloud Build
gcloud run deploy $SERVICE_NAME \
    --source . \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars="DB_HOST=/cloudsql/$CONNECTION_NAME" \
    --set-env-vars="DB_NAME=$DB_NAME" \
    --set-env-vars="DB_USER=$DB_USER" \
    --set-env-vars="DB_PASSWORD=$DB_PASSWORD" \
    --set-env-vars="SECRET_KEY=$(openssl rand -base64 32)" \
    --set-env-vars="RECAPTCHA_SECRET_KEY=YOUR_RECAPTCHA_SECRET_KEY" \
    --set-env-vars="RECAPTCHA_THRESHOLD=0.5" \
    --set-env-vars="RATE_LIMIT_ENABLED=true" \
    --set-env-vars="ENVIRONMENT=production" \
    --add-cloudsql-instances=$CONNECTION_NAME \
    --max-instances=10 \
    --min-instances=0 \
    --memory=512Mi \
    --cpu=1 \
    --timeout=300 \
    --port=8000

# Get the service URL
BACKEND_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')

echo ""
echo "==================================="
echo "Backend Deployed Successfully!"
echo "==================================="
echo ""
echo "Backend URL: $BACKEND_URL"
echo ""
echo "Test the backend:"
echo "curl $BACKEND_URL/api/v1/health"
echo ""
