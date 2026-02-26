# HR Management API

A production-ready **TypeScript / Express** REST API for HR management — handling employees, attendance tracking, and reporting with JWT authentication, MySQL persistence, and full observability.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Authentication** | JWT-based login for HR users |
| **Employee Management** | Full CRUD with soft-delete, photo upload (Cloudinary), pagination & search |
| **Attendance Tracking** | Daily check-in records with upsert support |
| **Reports** | Attendance summary reports with date-range filtering |
| **API Documentation** | Swagger UI at `/api-docs` |
| **Observability** | Pino structured logging, Prometheus metrics (`/metrics`) |
| **Security** | Helmet, CORS, rate limiting, HPP |
| **Validation** | Zod schemas on all request payloads |

---

## 🏗️ Tech Stack

- **Runtime**: Node.js 20, TypeScript 5
- **Framework**: Express 5
- **Database**: MySQL 8 via [Knex.js](https://knexjs.org/) ORM
- **Auth**: JSON Web Tokens (`jsonwebtoken`)
- **Testing**: [Vitest](https://vitest.dev/) + Supertest
- **Linting**: ESLint + Prettier
- **CI/CD**: GitHub Actions
- **Containerisation**: Docker + Docker Compose

---

## 📋 Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- **MySQL** 8 (or Docker)
- **Cloudinary** account (for photo uploads)

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/M360ICT_Backend.git
cd M360ICT_Backend/TS_Boiler_Plate
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values. At minimum, set:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=hr_user
DB_PASSWORD=hr_password
DB_NAME=hr_management

JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
JWT_EXPIRES_IN=7d
JWT_REFRESH_TOKEN_SECRET=<another long random secret>
JWT_REFRESH_EXPIRES_IN=30d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run Database Migrations

```bash
npm run migrate:latest
```

### 5. (Optional) Seed Initial Data

Seeds a default admin user `admin@hr.com` / `admin123`:

```bash
npm run seed:run
```

### 6. Start Development Server

```bash
npm run dev
```

Server starts at **`http://localhost:5001`**

---

## 🐳 Docker Usage

### Development (with hot-reload)

```bash
# From the TS_Boiler_Plate/ directory
docker compose up --build
```

This starts:
- **`db`** – MySQL 8 container (port `3306`)
- **`api`** – Express API with `tsx watch` hot-reload (port `5001`)

The API container depends on the DB health check before starting.

### Production Build

```bash
docker compose --profile prod up --build api-prod
```

### Stop All Containers

```bash
docker compose down
# To also remove volumes (database data):
docker compose down -v
```

---

## 🗃️ Database Migration Instructions

| Command | Description |
|---|---|
| `npm run migrate:latest` | Run all pending migrations |
| `npm run migrate:rollback` | Roll back the last batch of migrations |
| `npm run seed:run` | Seed initial admin HR user |

Migration files are located in `src/database/migrations/`.  
A plain SQL schema file is also available at `src/database/schema.sql` for manual initialization.

---

## 🧪 Testing Commands

```bash
# Run all tests (unit + integration)
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with HTML + LCOV coverage report
npm run test:coverage
# Coverage report: ./coverage/index.html

# Full CI check (typecheck + lint + test with coverage)
npm run ci
```

Test files are organised under `tests/`:
```
tests/
├── unit/
│   ├── auth/         # AuthService unit tests
│   ├── employee/     # EmployeeService unit tests
│   └── utils/        # buildApiQuery utility tests
└── integration/
    └── health.test.ts
```

---

## 📖 Swagger / API Docs

When the server is running in development mode, visit:

```
http://localhost:5001/api-docs
```

The OpenAPI spec JSON is also available at:

```
http://localhost:5001/api-docs.json
```

> **Note:** Swagger is disabled in production (`NODE_ENV=production`) by default.  
> Set `SWAGGER_ENABLED=true` in your `.env` to enable it in production.

---

## 🗺️ API Endpoints

All routes are prefixed with `/api/v1`.

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | ❌ | HR user login, returns JWT |

### Employees
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/employees/get-all` | ✅ | Paginated list with search & sort |
| `GET` | `/employees/:id` | ✅ | Get employee by ID |
| `POST` | `/employees/create` | ✅ | Create employee (multipart, supports photo) |
| `PUT` | `/employees/:id` | ✅ | Update employee |
| `DELETE` | `/employees/:id` | ✅ | Soft-delete employee |

### Attendance
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/attendance/get-all` | ✅ | Paginated attendance records |
| `GET` | `/attendance/:id` | ✅ | Get record by ID |
| `POST` | `/attendance/create` | ✅ | Create / upsert attendance |
| `PUT` | `/attendance/:id` | ✅ | Update check-in time |
| `DELETE` | `/attendance/:id` | ✅ | Delete record |

### Reports
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/reports/attendance` | ✅ | Attendance report by date range / employee |

### System
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | ❌ | Liveness check |
| `GET` | `/ready` | ❌ | Readiness check (DB connectivity) |
| `GET` | `/metrics` | ❌ | Prometheus metrics |

---

## 🤝 Contribution Guidelines

1. **Fork** the repository and create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature
   ```

2. **Follow** the conventional commits format:
   ```
   feat: add new report endpoint
   fix: correct attendance upsert logic
   docs: update README
   ```

3. **Run the full CI check** before opening a PR:
   ```bash
   npm run ci
   ```

4. **Open a Pull Request** against `main`. The CI pipeline will automatically run linting, type checking, tests with coverage, and a production build.

5. **Do not commit** `.env` files or any secrets.

---

## 📄 License

ISC
