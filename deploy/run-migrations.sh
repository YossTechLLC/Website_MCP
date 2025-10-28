#!/bin/bash

# Run database migrations on Cloud SQL

set -e

# Configuration
PROJECT_ID="your-gcp-project-id"  # CHANGE THIS
DB_INSTANCE_NAME="mcp-test-paygate-db"
DB_NAME="paygate_prime"
DB_USER="paygate_user"

# Get database password from Secret Manager
DB_PASSWORD=$(gcloud secrets versions access latest --secret="mcp-test-db-password")

# Get Cloud SQL connection name
CONNECTION_NAME=$(gcloud sql instances describe $DB_INSTANCE_NAME --format='value(connectionName)')

echo "Running database migrations..."
echo "Instance: $DB_INSTANCE_NAME"
echo "Database: $DB_NAME"
echo ""

cd ../backend

# Set environment variables for migration
export DB_HOST="localhost"
export DB_PORT="5432"
export DB_NAME="$DB_NAME"
export DB_USER="$DB_USER"
export DB_PASSWORD="$DB_PASSWORD"

# Start Cloud SQL Proxy in background
echo "Starting Cloud SQL Proxy..."
cloud_sql_proxy -instances=$CONNECTION_NAME=tcp:5432 &
PROXY_PID=$!

# Wait for proxy to be ready
sleep 5

# Run Alembic migrations
echo "Running Alembic migrations..."
alembic upgrade head

# Stop Cloud SQL Proxy
kill $PROXY_PID

echo ""
echo "Migrations completed successfully!"
echo ""
