# ObjectDNA Architecture

The prototype keeps the main workflow in the browser so it remains easy to demonstrate without credentials, while the backend exposes the same structured contract for real AI and database integrations.

## Boundaries

- `frontend/src/App.jsx` owns lightweight routing, local history, and the six-stage presentation state.
- `frontend/src/data.js` owns deterministic demo objects and pathway metadata.
- `frontend/src/api.js` is the only frontend network boundary.
- `backend/main.py` owns validation, CORS, REST routes, and the prototype store.
- `backend/ai_service.py` owns Gemini calls, response normalization, transparent scoring, and fallbacks.
- `backend/models.py` is the shared response contract for object, condition, components, pathways, score breakdown, and recommendation.
- `database/schema.sql` is the PostgreSQL-ready persistence design.

## Safety Model

The prompt and UI explicitly separate visible assessment from physical inspection. The service does not present hidden structural damage, battery health, or electrical safety as known facts. Electronics and load-bearing objects receive safety notes and qualified-inspection guidance.

## Life-Path Score

```text
25% practicality
20% reuse potential
20% environmental impact
15% cost efficiency
10% effort
10% time
```

The weights are server-side environment variables and each pathway returns the component scores used by the formula.
