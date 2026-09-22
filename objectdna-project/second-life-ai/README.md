# ObjectDNA

> Don’t throw it away. Let AI discover what it can become.

ObjectDNA is an AI-powered circular economy and intelligent reuse platform. It turns an unwanted, damaged, old, or unused object into a practical next-life plan: repair, reuse, repurpose, donate, or recover.

## Problem

People often discard objects because they cannot quickly tell whether an item is repairable, reusable, valuable to someone else, or worth recovering. That uncertainty turns useful materials into waste.

## Solution

ObjectDNA uses one photo to identify an object, assess visible condition, decompose materials and components, generate multiple pathways, compare the trade-offs, and recommend a clear next action.

The smoothest demo story is a damaged wooden table becoming a bookshelf rather than entering the disposal stream.

## Features

- Responsive ObjectDNA landing page with a clear circular-economy narrative.
- Drag-and-drop image upload with camera-friendly mobile input, JPG/PNG/WEBP validation, and a 5 MB limit.
- Six-stage intelligence animation: SEE, UNDERSTAND, DECOMPOSE, REIMAGINE, COMPARE, EXTEND LIFE.
- Structured multimodal AI integration through FastAPI and Gemini, with no frontend secrets.
- Reliable Demo Mode with five sample objects: broken wooden table, old chair, backpack, broken electronics, and plastic container.
- Visible-condition reasoning with a clear warning that hidden structural or electrical issues cannot be confirmed from one image.
- Component cards showing material and reuse potential.
- Five pathway comparison cards: Repair, Reuse, Repurpose, Donate, Recover.
- Explainable Life-Path Score using configurable weights: 25% practicality, 20% reuse, 20% environmental impact, 15% cost efficiency, 10% effort, 10% time.
- Action plan, safety notes, approximate impact estimates, and working action buttons.
- Local dashboard, analysis history, and impact ledger with no account or personal information required.
- Local fallback when an external AI provider is missing or unavailable.
- FastAPI endpoints for analysis, demo data, pathway generation, comparison, recommendation, and history.

## Architecture

```text
                           +-----------------------+
                           |  React + Vite client  |
                           |  ObjectDNA workflow   |
                           +-----------+-----------+
                                       |
                              REST / JSON + image
                                       |
                           +-----------v-----------+
                           | FastAPI service       |
                           | validation + scoring  |
                           +-----+-------------+---+
                                 |             |
                    structured AI |             | demo fallback
                                 |             |
                           +-----v-----+   +---v----------------+
                           | Gemini    |   | Pydantic demo data |
                           | multimodal|   | deterministic      |
                           +-----------+   +--------------------+
                                       |
                              PostgreSQL-ready models
                              + browser local ledger
```

## Project Structure

```text
objectdna/
├── frontend/
│   ├── src/
│   │   ├── components/      pages and reusable UI
│   │   ├── api.js           REST client
│   │   ├── data.js          demo objects and pathway metadata
│   │   ├── App.jsx          route and workflow state
│   │   └── styles.css       responsive visual system
│   └── package.json
├── backend/
│   ├── main.py              FastAPI routes and in-memory prototype store
│   ├── models.py            structured Pydantic response models
│   ├── ai_service.py        Gemini adapter, scoring, and demo fallback
│   └── prompt.py            strict AI prompt and JSON contract
├── database/schema.sql      PostgreSQL-ready table design
├── docs/                    architecture and API notes
├── .env.example
└── render.yaml
```

## AI Workflow

1. **SEE** identifies the object and visual characteristics.
2. **UNDERSTAND** assesses visible wear and condition.
3. **DECOMPOSE** maps materials and reusable components.
4. **REIMAGINE** generates practical alternative uses.
5. **COMPARE** scores cost, effort, time, usefulness, and impact.
6. **EXTEND LIFE** selects and explains the strongest next-life plan.

AI is instructed to use visible evidence only. Environmental numbers are approximate estimates, not verified measurements.

## Installation

Requirements: Node.js 18+, Python 3.11+.

```bash
cd frontend
npm install
npm run dev
```

In another terminal:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Open `http://localhost:5173`. The complete demo works without a Gemini key.

## Environment Variables

Copy `.env.example` to the relevant frontend/backend environment file.

- `VITE_API_URL`: public backend base URL, without `/api`.
- `GEMINI_API_KEY`: optional server-side Gemini key.
- `GEMINI_MODEL`: multimodal Gemini model name.
- `CORS_ORIGINS`: comma-separated frontend origins.
- `WEIGHT_*`: configurable Life-Path Score weights. Keep the default total at 1.0.

Never put `GEMINI_API_KEY` in frontend code or commit a real key.

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Service and AI mode status |
| POST | `/api/analyze` | Validate and analyze an uploaded image |
| POST | `/api/analyze/demo?object_key=table` | Return a clearly labeled demo analysis |
| GET | `/api/analyses` | List stored analysis summaries |
| GET | `/api/analyses/{id}` | Get a complete analysis |
| DELETE | `/api/analyses/{id}` | Delete a prototype analysis |
| POST | `/api/pathways/generate` | Generate structured pathways from object context |
| POST | `/api/pathways/compare` | Apply transparent pathway scoring |
| POST | `/api/recommendation` | Return the strongest scored pathway |

The prototype uses an in-memory backend store and browser local persistence. The model and `database/schema.sql` are ready for PostgreSQL wiring.

## Deployment

- Frontend: Vercel or any static Vite host. Set root to `frontend`, build with `npm run build`, output `dist`.
- Backend: Render or any Python host. The included `render.yaml` starts FastAPI with Uvicorn.
- Set `VITE_API_URL` to the public backend origin and set `CORS_ORIGINS` to the deployed frontend origin.

## Multilingual Readiness

All user-facing copy is kept in React components and the data layer, making it straightforward to move into locale dictionaries for English, Tamil, Hindi, Telugu, Malayalam, and Kannada.

## Future Scope

- Local repairer and donation matching.
- Community repair network and maker marketplace.
- Material recovery network and verified impact methodology.
- Better computer vision, feedback loops, and multilingual AI.
- Mobile application and IoT/asset-inventory integrations.

## Hackathon Demo

Select **Demo Mode → Broken Wooden Table**. The app walks through identification, condition, components, five pathways, transparent ranking, bookshelf recommendation, impact estimate, and an actionable transformation plan.

## License

MIT. See `LICENSE`.
