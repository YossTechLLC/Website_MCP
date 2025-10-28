# Deployment Guide - PayGate Prime MCP Test

This guide covers deploying the PayGate Prime test scope project to Google Cloud Platform.

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **gcloud CLI** installed and authenticated
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```
3. **Docker** installed (for local testing)
4. **reCAPTCHA v3 Keys** from Google reCAPTCHA Admin Console

## Deployment Steps

### 1. Update Configuration

Edit the following files and replace placeholders:
- `deploy/setup-gcloud.sh` - Set your `PROJECT_ID`
- `deploy/deploy-backend.sh` - Set `PROJECT_ID` and `RECAPTCHA_SECRET_KEY`
- `deploy/deploy-frontend.sh` - Set `PROJECT_ID` and `RECAPTCHA_SITE_KEY`
- `deploy/run-migrations.sh` - Set `PROJECT_ID`

### 2. Set Up Google Cloud Infrastructure

```bash
chmod +x deploy/*.sh
./deploy/setup-gcloud.sh
```

This script will:
- Enable required GCP APIs
- Create Cloud SQL PostgreSQL instance (`mcp-test-paygate-db`)
- Create database and user
- Store credentials in Secret Manager

**Important:** Save the database password displayed at the end!

### 3. Create Initial Database Migration

```bash
cd backend
alembic revision --autogenerate -m "Initial schema"
cd ..
```

### 4. Deploy Backend

```bash
./deploy/deploy-backend.sh
```

This will:
- Build the Docker image
- Deploy to Cloud Run (`mcp-test-paygate-api`)
- Connect to Cloud SQL
- Configure environment variables

### 5. Run Database Migrations

```bash
./deploy/run-migrations.sh
```

### 6. Deploy Frontend

```bash
./deploy/deploy-frontend.sh
```

This will:
- Build the React app with production settings
- Deploy to Cloud Run (`mcp-test-paygate-web`)
- Configure API endpoint to backend

### 7. Verify Deployment

The frontend deployment will output a URL like:
```
https://mcp-test-paygate-web-XXXXX-uc.a.run.app
```

Visit this URL to test the application!

## Local Development with Docker

To test locally before deploying:

```bash
# Create .env file with your keys
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit .env files with your reCAPTCHA keys

# Start all services
docker-compose up --build
```

Access the app at:
- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Monitoring

View logs in Google Cloud Console:
```bash
# Backend logs
gcloud run logs read mcp-test-paygate-api --region=us-central1

# Frontend logs
gcloud run logs read mcp-test-paygate-web --region=us-central1

# Database logs
gcloud sql operations list --instance=mcp-test-paygate-db
```

## Cleanup

To remove all resources when done:

```bash
# Delete Cloud Run services
gcloud run services delete mcp-test-paygate-api --region=us-central1
gcloud run services delete mcp-test-paygate-web --region=us-central1

# Delete Cloud SQL instance
gcloud sql instances delete mcp-test-paygate-db

# Delete secrets
gcloud secrets delete mcp-test-db-password
```

## Troubleshooting

### Backend won't start
- Check Cloud SQL connection is enabled
- Verify environment variables are set correctly
- Check logs: `gcloud run logs read mcp-test-paygate-api`

### Frontend can't reach backend
- Verify CORS configuration in backend
- Check backend URL in frontend environment variables
- Ensure backend is deployed and running

### Database connection fails
- Verify Cloud SQL instance is running
- Check database credentials
- Ensure Cloud SQL proxy is configured

### reCAPTCHA errors
- Verify site key and secret key are correct
- Check domain is authorized in reCAPTCHA admin
- For Cloud Run, add the generated URL to allowed domains

## Cost Estimation

With Cloud Run's pay-per-use pricing (approximate):
- Cloud Run (minimal traffic): $5-15/month
- Cloud SQL (db-f1-micro): $7-10/month
- Total: ~$15-25/month for light usage

Free tier includes:
- 2 million Cloud Run requests/month
- 180 hours of Cloud SQL usage/month

## Security Notes

- All services use HTTPS by default (Cloud Run provides SSL)
- Secrets stored in Secret Manager (not in environment variables)
- Database password auto-generated and secured
- Rate limiting enabled on backend
- reCAPTCHA v3 protects against bots
- Security headers configured in nginx

## Support

For issues specific to this deployment:
1. Check the logs with `gcloud run logs read`
2. Verify all environment variables are set
3. Ensure all APIs are enabled
4. Check Cloud SQL instance is running

For MCP test project questions, refer to the main README.md.
