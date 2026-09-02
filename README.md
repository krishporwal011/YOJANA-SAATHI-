# Yojana Saathi AI (योजना साथी)

> **Citizen Scheme Discovery & Eligibility Assistant**

Yojana Saathi AI is a unified platform designed to help Indian citizens seamlessly discover, check eligibility for, and access government welfare schemes using modern web technologies and AI.

---

## 📁 Project Structure

```text
YOJANA-SAATHI-/
├── app/
│   ├── frontend/                 # Next.js + React + Tailwind CSS
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx    # Root layout & styling
│   │   │   │   ├── page.tsx      # Login & Profile Portal
│   │   │   │   └── globals.css   # Tailwind setup
│   │   │   └── components/       # LoginForm, ProfileForm, SchemesPreview
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.ts
│   │   └── next.config.mjs
│   └── backend/
│       ├── api/                  # FastAPI Application
│       │   ├── main.py           # FastAPI server with CORS & routes
│       │   ├── schemas.py        # Pydantic schemas (Login, Profile)
│       │   ├── requirements.txt  # FastAPI & Uvicorn dependencies
│       │   └── __init__.py
│       ├── eligibility/          # Eligibility evaluation (placeholder)
│       │   └── .gitkeep
│       └── ai/                   # AI / RAG modules (placeholder)
│           └── .gitkeep
├── data/
│   └── schemes/                  # Standardized scheme JSON records
│       ├── SCH-001.json          # PM-KISAN Samman Nidhi
│       ├── SCH-002.json          # Ayushman Bharat PM-JAY
│       └── SCH-003.json          # National Means-cum-Merit Scholarship
├── .gitignore
└── README.md
```

---

## 🛠️ Prerequisites & Installation

### 1. Backend Dependencies (Python)

Ensure Python 3.10+ is installed on your system.

```bash
# Navigate to the backend API folder
cd app/backend/api

# (Optional but recommended) Create a virtual environment
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

### 2. Frontend Dependencies (Node.js)

Ensure Node.js 18+ and npm are installed on your system.

```bash
# Navigate to the frontend folder
cd app/frontend

# Install node dependencies
npm install
```

---

## 🚀 How to Run the Applications

### Run the FastAPI Backend

From the repository root or backend directory:

```bash
# From app/backend/api:
cd app/backend/api
uvicorn main:app --reload --port 8000
```
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

### Run the Next.js Frontend

In a separate terminal window:

```bash
# From app/frontend:
cd app/frontend
npm run dev
```
- **Frontend App**: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Demo Credentials

To test the login authentication flow:
- **Demo Phone Number**: `9000000001`
- **Fixed Demo Code / OTP**: `1234`

---

## 📋 Citizen Profile Attributes Supported

The profile API and UI store and manage the following citizen attributes:
1. `name` (Full Name)
2. `age` (Years)
3. `income` (Annual Family Income in ₹)
4. `state` (State / Union Territory)
5. `occupation` (e.g. Farmer, Student, Artisan, etc.)
6. `category` (General, OBC, SC, ST, EWS)
7. `education` (Highest educational qualification)

---

## 📦 Starter Schemes Schema

The dataset in `data/schemes/` follows the exact schema:

```json
{
  "scheme_name": "PM-KISAN Samman Nidhi",
  "ministry": "Ministry of Agriculture and Farmers Welfare",
  "state": "All India",
  "benefits": "Financial benefit of Rs 6,000 per year...",
  "eligibility": {
    "age_min": null,
    "age_max": null,
    "income_limit": null,
    "occupation": "farmer",
    "education": "",
    "category": ""
  },
  "documents": ["land record", "bank passbook"],
  "application_url": "https://pmkisan.gov.in/",
  "deadline": "Ongoing",
  "source_url": "https://pmkisan.gov.in/",
  "last_verified": "2026-09-01"
}
```

---

## 🖥️ GitHub Desktop: Steps to Commit & Push

1. Open **GitHub Desktop**.
2. If the repository is not open yet:
   - Click **File > Add Local Repository...** (or `Cmd + O` / `Ctrl + O`).
   - Select `/Users/tanyaporwal/Desktop/YOJANA-SAATHI-`.
3. In the left panel under **Changes**, you will see all newly created files checked.
4. In the **Summary** box at the bottom left, enter:
   `Initial project setup: Next.js frontend, FastAPI backend, starter schemes`
5. (Optional) In the **Description** box, add any additional notes.
6. Click **Commit to main** (or your current branch).
7. Click **Publish branch** or **Push origin** in the top bar to push your changes to GitHub.
