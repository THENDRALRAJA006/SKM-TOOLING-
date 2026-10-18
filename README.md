# SKM Tooling Center — Precision Industrial Tooling Platform

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r174-black.svg)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-Proprietary-lightgrey.svg)]()

> **SKM Tooling Center** is an industrial-grade digital platform and interactive showcase for precision-engineered tooling components, core inserts, cavity plates, moulding tools, and industrial manufacturing solutions.

---

## 🌟 Features

- **Interactive 3D CAD Component Viewer**: Real-time WebGL/Three.js 3D inspection with wireframe toggle, orbit rotation, zoom, auto-spin, and material shading.
- **Dynamic Product Catalog**: Core inserts, cavity plates, moulding tools, and case cover plates with full technical specifications, tolerances, and downloadable spec sheets.
- **Multi-Step RFQ & Quotation Engine**: Custom quotation request system with file attachments (STEP, IGES, STL, DXF, PDF), material selection, tolerance tiers, and automated reference codes.
- **Contact & Enquiry Management**: Direct customer communication with consent tracking and email notification pipelines.
- **Comprehensive Admin Dashboard**:
  - Secure JWT authentication with role-based access.
  - Live KPI statistics (total enquiries, pending RFQs, catalog items, active products).
  - Enquiry pipeline tracking with status workflows (Pending, In Review, Quoted, Rejected, Completed).
  - Product catalog CRUD operations and visibility toggling.
  - Live-editable company settings (company name, phone, email, address, working hours) with instant frontend persistence.
- **Modern Industrial Dark UI**: Engineered with custom dark glassmorphism, responsive typography, micro-interactions, and accessibility standards.
- **RESTful API**: Fast and fully documented OpenAPI/Swagger schema at `/docs` and `/redoc`.

---

## 🏗️ Architecture & Tech Stack

```
SKM 3D/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── api/              # API Route Handlers (products, enquiries, admin, settings)
│   │   ├── core/             # Configuration, JWT security, password hashing
│   │   ├── db/               # SQLAlchemy models & database session setup
│   │   ├── schemas/          # Pydantic v2 schemas for requests & responses
│   │   ├── services/         # Seed service, enquiry notification handling
│   │   └── main.py           # Application entrypoint & CORS middleware
│   ├── tests/                # Automated pytest API test suite
│   ├── uploads/              # Storage directory for RFQ attachments & drawings
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # React 19 + TypeScript + Vite SPA
│   ├── public/               # Static assets, SVG favicons, video loops, robots.txt
│   ├── src/
│   │   ├── components/       # Header, Footer, ModelViewer (Three.js), UI elements
│   │   ├── pages/            # Home, Products, Product Detail, RFQ Quote, About, Contact, Privacy
│   │   │   └── admin/        # Admin Login, Dashboard, Enquiries, Products, Settings
│   │   ├── lib/              # API client (Axios) & token storage
│   │   ├── App.tsx           # Router configuration & route guards
│   │   └── main.tsx          # React application root
│   └── package.json          # Node dependencies & Vite config
│
├── ASSET_SOURCES.md          # Licences, media sources, and CAD model documentation
└── README.md                 # Project documentation
```

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ORM & Database**: SQLAlchemy 2.0 with SQLite (configurable to PostgreSQL/MySQL via `.env`)
- **Validation**: Pydantic v2
- **Authentication**: OAuth2 Password Flow with JWT (`python-jose`, `passlib`, `bcrypt`)
- **Testing**: Pytest + HTTPX TestClient (14 automated unit and integration tests)

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **3D Graphics**: Three.js + @react-three/fiber + @react-three/drei
- **Styling**: Vanilla CSS with custom industrial dark design tokens
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

---

## 🚀 Getting Started

### Prerequisites
- **Python**: 3.10+ (tested on Python 3.11)
- **Node.js**: 18+ and npm
- **Git**

### 1. Backend Setup

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your secret keys and company defaults if needed

# Run database migrations and start server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend server will run at `http://localhost:8000`.
- Interactive API Docs: `http://localhost:8000/docs`
- Redoc API Documentation: `http://localhost:8000/redoc`
- Health check: `http://localhost:8000/api/health`

### 2. Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend application will run at `http://localhost:5173`.

### 3. First-Time Admin Account Creation

When launching a new environment, create the initial administrator account via the backend initialization endpoint:

```bash
# Using curl or PowerShell:
curl -X POST http://localhost:8000/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@skmtooling.com", "username": "admin", "password": "YourStrongPassword123"}'
```

*Note: The platform automatically blocks subsequent calls once an admin account is established.*

Log in to the Admin Dashboard at: `http://localhost:5173/admin/login`

---

## 🧪 Running Automated Tests

Run the complete backend test suite:

```bash
cd backend
python -m pytest tests/test_api.py -v
```

All 14 tests cover:
- Health check endpoint
- Product catalog retrieval and 404 behavior
- Quotation & enquiry submission validation
- Privacy consent enforcement
- Admin creation restrictions & duplicate prevention
- JWT authentication and token verification
- Protected dashboard and enquiry pipeline authorization

---

## 📦 Production Build

To build the frontend for production deployment:

```bash
cd frontend
npm run build
```

Production artifacts will be generated in `frontend/dist/`. Serve them statically or reverse-proxy through Nginx / Caddy to `http://localhost:8000` for API routes.

---

## 🛡️ Company Branding & Consistency

The official name of this enterprise is **SKM Tooling Center**.
All user-facing interfaces, metadata, titles, and system communications strictly adhere to this standardized naming convention.

---

## 📄 Licences & Asset Attributions

For full attribution of media assets, video backgrounds, CAD representations, and open-source packages, please refer to [ASSET_SOURCES.md](ASSET_SOURCES.md).

---

## 📞 Support & Inquiries

**SKM Tooling Center**  
- **Email**: info@skmtooling.com  
- **Website**: [https://skmtooling.com](https://skmtooling.com)
