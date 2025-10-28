# Technology Stack - PayGate Prime Rebuild

**Project:** MCP Test Scope - PayGate Prime Channel Registration
**Date:** 2025-10-28
**Version:** 1.0

---

## Technology Decisions

### Backend Stack
**Framework:** FastAPI (Python 3.11+)

**Rationale:**
- Modern async support for better performance
- Built-in data validation with Pydantic
- Automatic OpenAPI/Swagger documentation
- Type hints for better code quality
- Better performance than Flask
- Easy migration path from existing Flask codebase
- Native support for dependency injection

**Key Libraries:**
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `sqlalchemy` - ORM for database operations
- `alembic` - Database migrations
- `pydantic` - Data validation
- `asyncpg` - Async PostgreSQL driver
- `python-jose` - JWT tokens for sessions
- `passlib` - Password hashing
- `slowapi` - Rate limiting for FastAPI
- `python-multipart` - Form data handling
- `httpx` - Async HTTP client for testing

### Frontend Stack
**Framework:** React 18 + TypeScript + Vite

**Rationale:**
- Component-based architecture for reusability
- TypeScript for type safety and better DX
- Vite for lightning-fast dev server and builds
- Large ecosystem and community support
- Excellent mobile responsiveness
- Easy state management
- Great testing support

**Key Libraries:**
- `react` - UI library
- `react-dom` - React DOM rendering
- `typescript` - Type safety
- `vite` - Build tool
- `react-hook-form` - Form state management
- `zod` - Schema validation
- `axios` - HTTP client
- `@tanstack/react-query` - Server state management
- `react-hot-toast` - Toast notifications
- `react-google-recaptcha-v3` - reCAPTCHA integration

### CSS Framework
**Framework:** Tailwind CSS

**Rationale:**
- Utility-first approach for rapid development
- Excellent responsive design utilities
- Highly customizable
- Small production bundle size (tree-shaking)
- No CSS conflicts
- Built-in dark mode support
- Great documentation

**Additional CSS Tools:**
- `autoprefixer` - CSS vendor prefixing
- `postcss` - CSS transformations
- `@tailwindcss/forms` - Better form styles

### Database
**Database:** PostgreSQL 15+

**Rationale:**
- Robust, reliable, industry-standard
- Excellent data integrity
- Advanced features (JSONB, full-text search)
- Compatible with existing infrastructure
- Great performance for read/write operations
- Strong ACID compliance

**Connection:**
- Google Cloud SQL Connector
- Connection pooling with SQLAlchemy

### Security
**CAPTCHA:** Google reCAPTCHA v3

**Rationale:**
- Invisible to users (better UX)
- Risk-based scoring
- No checkbox needed
- Excellent bot detection
- Free tier available

**Additional Security:**
- `python-jose` - JWT token handling
- `passlib[bcrypt]` - Password hashing
- `slowapi` - Rate limiting
- `sqlalchemy` - SQL injection prevention (parameterized queries)
- Custom middleware for security headers

### Testing
**Backend Testing:**
- `pytest` - Testing framework
- `pytest-asyncio` - Async test support
- `pytest-cov` - Code coverage
- `httpx` - API testing

**Frontend Testing:**
- `vitest` - Unit testing (Vite-native)
- `@testing-library/react` - Component testing
- `@testing-library/user-event` - User interaction testing
- `@testing-library/jest-dom` - DOM matchers

### Development Tools
**Code Quality:**
- `black` - Python code formatting
- `flake8` - Python linting
- `mypy` - Python type checking
- `eslint` - JavaScript/TypeScript linting
- `prettier` - Frontend code formatting

**Development:**
- `python-dotenv` - Environment variable management
- `pre-commit` - Git hooks for quality checks

### Deployment & DevOps
**Containerization:**
- Docker
- Docker Compose

**Cloud Platform:**
- Google Cloud Platform (GCP)
- Cloud Run (serverless containers)
- Cloud SQL (PostgreSQL)
- Secret Manager (credentials)
- Cloud Build (CI/CD)
- Cloud Logging & Monitoring

**Version Control:**
- Git
- GitHub
- GitHub Actions (CI/CD pipeline)

---

## Architecture Pattern

**Pattern:** Classical Full-Stack (No Webhooks)

**Structure:**
```
┌─────────────┐
│   Client    │ (React + TypeScript)
│  (Browser)  │
└──────┬──────┘
       │
       │ HTTP/HTTPS (REST API)
       │
┌──────▼──────┐
│   Backend   │ (FastAPI)
│   Server    │
└──────┬──────┘
       │
       │ SQL (pg8000/asyncpg)
       │
┌──────▼──────┐
│  PostgreSQL │ (Cloud SQL)
│  Database   │
└─────────────┘
```

**Communication Flow:**
1. Client sends HTTP request to backend
2. Backend validates request (CSRF, rate limit, input validation)
3. Backend processes business logic
4. Backend queries database
5. Backend returns HTTP response
6. Client updates UI

**No webhooks, no event-driven architecture - Pure request/response pattern**

---

## Project Structure

```
Website_MCP/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── v1/
│   │   │   │   ├── endpoints/
│   │   │   │   └── __init__.py
│   │   │   └── __init__.py
│   │   ├── core/              # Config, security, dependencies
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Business logic
│   │   ├── db/                # Database utilities
│   │   └── main.py            # FastAPI app entry
│   ├── tests/                 # Backend tests
│   ├── alembic/               # Database migrations
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Utility functions
│   │   ├── types/             # TypeScript types
│   │   ├── api/               # API client
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/                # Static assets
│   ├── tests/                 # Frontend tests
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── tailwind.config.js
│
├── docker-compose.yml          # Local development
├── .gitignore
├── README.md
├── TECH_STACK.md              # This file
└── Test_Scope_Checklist_1.md
```

---

## Environment Variables

### Backend (.env)
```bash
# Application
APP_NAME="PayGate Prime"
APP_VERSION="1.0.0"
DEBUG=false
SECRET_KEY="<generated-secret>"

# Database
DB_HOST="localhost"  # or Cloud SQL connection name
DB_PORT=5432
DB_NAME="paygate_test"
DB_USER="paygate_user"
DB_PASSWORD="<from-secret-manager>"

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

---

## Performance Targets

- **Page Load Time:** < 2 seconds
- **API Response Time:** < 300ms (p95)
- **Time to Interactive:** < 3 seconds
- **Lighthouse Score:** > 90 (all categories)
- **Bundle Size:** < 400KB (gzipped)

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Mobile Chrome (Android 10+)

---

## Development Workflow

1. **Local Development:**
   - Backend: `uvicorn app.main:app --reload`
   - Frontend: `npm run dev`
   - Database: Docker Compose PostgreSQL

2. **Testing:**
   - Backend: `pytest`
   - Frontend: `npm test`

3. **Building:**
   - Backend: Docker build
   - Frontend: `npm run build`

4. **Deployment:**
   - Push to GitHub
   - GitHub Actions runs tests
   - On success, deploys to Cloud Run

---

## Decision Log

| Date       | Decision                     | Rationale                                    |
|------------|------------------------------|----------------------------------------------|
| 2025-10-28 | Choose FastAPI over Flask    | Better performance, modern features, async   |
| 2025-10-28 | Choose React over Vue        | Larger ecosystem, better TypeScript support  |
| 2025-10-28 | Choose Tailwind over Bootstrap| More flexibility, better for custom designs |
| 2025-10-28 | Use reCAPTCHA v3            | Better UX than math CAPTCHA                  |
| 2025-10-28 | Use TypeScript              | Type safety reduces bugs                     |

---

**Notes:**
- All decisions are subject to revision based on implementation challenges
- Stack choices prioritize security, performance, and developer experience
- Focus on modern, well-maintained libraries with good documentation
