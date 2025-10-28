#!/bin/bash

# PayGate Prime MCP Test - Google Cloud Setup Script
# This script sets up the Google Cloud infrastructure for the test deployment

set -e  # Exit on error

# Configuration
PROJECT_ID="website-mcp"
REGION="us-central1"
DB_INSTANCE_NAME="mcp-test-paygate-db"
DB_NAME="paygate_prime"
DB_USER="paygate_user"
BACKEND_SERVICE_NAME="mcp-test-paygate-api"
FRONTEND_SERVICE_NAME="mcp-test-paygate-web"

echo "==================================="
echo "PayGate Prime MCP Test Deployment"
echo "==================================="
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "Error: gcloud CLI is not installed"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set the project
echo "Setting GCP project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo ""
echo "Enabling required APIs..."
gcloud services enable \
    sqladmin.googleapis.com \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    secretmanager.googleapis.com \
    compute.googleapis.com

# Create Cloud SQL instance
echo ""
echo "Creating Cloud SQL instance: $DB_INSTANCE_NAME"
if gcloud sql instances describe $DB_INSTANCE_NAME --quiet 2>/dev/null; then
    echo "Cloud SQL instance already exists, skipping creation..."
else
    gcloud sql instances create $DB_INSTANCE_NAME \
        --database-version=POSTGRES_15 \
        --tier=db-f1-micro \
        --region=$REGION \
        --root-password=$(openssl rand -base64 32) \
        --database-flags=max_connections=100

    echo "Waiting for Cloud SQL instance to be ready..."
    gcloud sql instances patch $DB_INSTANCE_NAME --quiet
fi

# Create database
echo ""
echo "Creating database: $DB_NAME"
gcloud sql databases create $DB_NAME \
    --instance=$DB_INSTANCE_NAME \
    || echo "Database already exists, continuing..."

# Create database user
echo ""
echo "Creating database user: $DB_USER"
DB_PASSWORD=$(openssl rand -base64 32)
gcloud sql users create $DB_USER \
    --instance=$DB_INSTANCE_NAME \
    --password=$DB_PASSWORD \
    || echo "User already exists, continuing..."

# Store database password in Secret Manager
echo ""
echo "Storing database password in Secret Manager..."
echo -n "$DB_PASSWORD" | gcloud secrets create mcp-test-db-password \
    --data-file=- \
    --replication-policy="automatic" \
    || gcloud secrets versions add mcp-test-db-password --data-file=- <<< "$DB_PASSWORD"

# Get Cloud SQL connection name
CONNECTION_NAME=$(gcloud sql instances describe $DB_INSTANCE_NAME --format='value(connectionName)')

echo ""
echo "==================================="
echo "Setup Complete!"
echo "==================================="
echo ""
echo "Cloud SQL Connection Name: $CONNECTION_NAME"
echo "Database Name: $DB_NAME"
echo "Database User: $DB_USER"
echo ""
echo "Next steps:"
echo "1. Update deploy/deploy-backend.sh with your reCAPTCHA keys"
echo "2. Run deploy/deploy-backend.sh to deploy the backend"
echo "3. Run deploy/deploy-frontend.sh to deploy the frontend"
echo ""
echo "Important: Save this information for deployment!"
echo "Database Password: $DB_PASSWORD"
echo ""
