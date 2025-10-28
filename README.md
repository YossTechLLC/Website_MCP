# PayGate Prime - Channel Registration System

A modern, secure, and responsive Telegram channel registration system built with classical full-stack architecture (no webhooks).

## Project Overview

PayGate Prime allows Telegram channel owners to register their channels for a cryptocurrency-based subscription payment system. Users can configure multiple pricing tiers, select preferred cryptocurrency networks and currencies, and provide payment wallet addresses.

## Technology Stack

- **Backend:** FastAPI (Python 3.11+)
- **Frontend:** React 18 + TypeScript + Vite
- **Database:** PostgreSQL 15+
- **Styling:** Tailwind CSS
- **Deployment:** Google Cloud Platform (Cloud Run + Cloud SQL)

See [TECH_STACK.md](./TECH_STACK.md) for detailed technology decisions.

## Project Structure

```
Website_MCP/
├── backend/          # FastAPI backend application
├── frontend/         # React frontend application
├── docker-compose.yml
├── .gitignore
├── README.md
├── TECH_STACK.md
└── Test_Scope_Checklist_1.md
```

## Features

### Core Functionality
- Channel registration with validation
- Multi-tier subscription pricing (1-3 tiers)
- Support for 12+ blockchain networks
- Support for 40+ cryptocurrencies
- Cryptocurrency wallet address validation
- Dynamic network-currency filtering

### Security Features
- Google reCAPTCHA v3 integration
- Rate limiting (5 registrations/hour per IP)
- CSRF protection
- SQL injection prevention
- XSS protection
- Input sanitization
- Security headers (CSP, HSTS, etc.)

### User Experience
- Mobile-first responsive design
- Real-time form validation
- Progressive disclosure
- Accessible (WCAG 2.1 AA)
- Loading states and error handling
- Success notifications

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional)
- Google Cloud SDK (for deployment)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run database migrations:**
   ```bash
   alembic upgrade head
   ```

6. **Start development server:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

Backend will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

Frontend will be available at `http://localhost:5173`

### Docker Compose (Recommended for Development)

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 8000
- Frontend dev server on port 5173

## Development Workflow

### Running Tests

**Backend:**
```bash
cd backend
pytest
pytest --cov=app --cov-report=html  # With coverage
```

**Frontend:**
```bash
cd frontend
npm test
npm run test:coverage  # With coverage
```

### Code Quality

**Backend:**
```bash
black .              # Format code
flake8 .            # Lint code
mypy .              # Type check
```

**Frontend:**
```bash
npm run lint        # ESLint
npm run format      # Prettier
```

### Building for Production

**Backend:**
```bash
docker build -t paygate-backend:latest ./backend
```

**Frontend:**
```bash
cd frontend
npm run build
```

## Deployment

### Google Cloud Platform

1. **Set up Cloud SQL:**
   ```bash
   gcloud sql instances create mcp-test-paygate-db \
     --database-version=POSTGRES_15 \
     --tier=db-f1-micro \
     --region=us-central1
   ```

2. **Deploy backend to Cloud Run:**
   ```bash
   gcloud run deploy mcp-test-paygate-api \
     --source ./backend \
     --region us-central1 \
     --allow-unauthenticated
   ```

3. **Deploy frontend to Cloud Run:**
   ```bash
   gcloud run deploy mcp-test-paygate-web \
     --source ./frontend \
     --region us-central1 \
     --allow-unauthenticated
   ```

See detailed deployment instructions in `docs/DEPLOYMENT.md` (to be created).

## Environment Variables

### Backend (.env)

```bash
# Application
APP_NAME="PayGate Prime"
APP_VERSION="1.0.0"
DEBUG=false
SECRET_KEY="<your-secret-key>"

# Database
DB_HOST="localhost"
DB_PORT=5432
DB_NAME="paygate_test"
DB_USER="paygate_user"
DB_PASSWORD="<your-db-password>"

# Security
RECAPTCHA_SECRET_KEY="<google-recaptcha-secret>"
CORS_ORIGINS='["http://localhost:5173"]'

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_PER_HOUR=5
```

### Frontend (.env)

```bash
VITE_API_URL="http://localhost:8000"
VITE_RECAPTCHA_SITE_KEY="<google-recaptcha-site-key>"
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Contributing

This is a test scope project. For contribution guidelines, see `CONTRIBUTING.md` (to be created).

## Security

If you discover a security vulnerability, please email security@paygateprime.com (to be set up).

## License

[To be determined]

## Support

For questions or issues:
- Create an issue in the GitHub repository
- Review the [Test_Scope_Checklist_1.md](./Test_Scope_Checklist_1.md) for project progress

## Project Status

Current phase: Initial Development
Progress: See [Test_Scope_Checklist_1.md](./Test_Scope_Checklist_1.md)

## Acknowledgments

- Original codebase reference: `GCRegister10-26/`
- Security analysis: `paygateprime_security_report.txt`

---

**Note:** This is a test scope project for MCP testing purposes. It rebuilds www.paygateprime.com using modern full-stack architecture without webhooks.

Last Updated: 2025-10-28
