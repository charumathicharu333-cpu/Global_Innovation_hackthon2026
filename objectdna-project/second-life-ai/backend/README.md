# ObjectDNA Backend

FastAPI service for validated image uploads, structured multimodal AI analysis, deterministic demo responses, pathway scoring, and recommendation endpoints.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The Gemini provider is optional. Without `GEMINI_API_KEY`, the service returns clearly labeled demo fallbacks.
