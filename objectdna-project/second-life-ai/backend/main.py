import os
from datetime import datetime, timezone
from typing import List
from uuid import uuid4

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ai_service import analyze_with_gemini, fallback_for, score_pathway, table_result
from models import AnalysisResult, Pathway

load_dotenv()

MAX_IMAGE_BYTES = 5 * 1024 * 1024
SUPPORTED_TYPES = {"image/jpeg", "image/png", "image/webp"}
SIGNATURES = {"image/jpeg": (b"\xff\xd8\xff",), "image/png": (b"\x89PNG\r\n\x1a\n",), "image/webp": (b"RIFF",)}
analyses: dict[str, AnalysisResult] = {}

app = FastAPI(title="ObjectDNA API", version="1.0.0", description="Structured circular economy analysis and next-life recommendations.")
origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if origin.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=False, allow_methods=["*"], allow_headers=["*"])


class PathwayGenerateRequest(BaseModel):
    object_name: str
    condition: str = "Unknown"
    visible_damage: List[str] = []
    materials: List[str] = []
    components: List[str] = []
    user_goal: str = ""
    location: str = ""


class PathwayCompareRequest(BaseModel):
    pathways: List[Pathway]


def has_valid_signature(content: bytes, mime_type: str) -> bool:
    if mime_type == "image/webp": return len(content) > 12 and content[:4] == b"RIFF" and content[8:12] == b"WEBP"
    return any(content.startswith(signature) for signature in SIGNATURES[mime_type])


def persist(result: AnalysisResult) -> AnalysisResult:
    if not result.id: result.id = f"analysis-{uuid4().hex[:12]}"
    if not result.created_at: result.created_at = datetime.now(timezone.utc).isoformat()
    analyses[result.id] = result
    return result


@app.get("/health")
@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "objectdna", "ai": "gemini" if os.getenv("GEMINI_API_KEY") else "demo"}


@app.post("/api/analyze", response_model=AnalysisResult)
async def analyze(image: UploadFile = File(...)) -> AnalysisResult:
    if image.content_type not in SUPPORTED_TYPES: raise HTTPException(status_code=415, detail="Please upload a JPG, PNG, or WEBP image.")
    content = await image.read(MAX_IMAGE_BYTES + 1)
    if len(content) > MAX_IMAGE_BYTES: raise HTTPException(status_code=413, detail="Image must be 5 MB or smaller.")
    if not content or not has_valid_signature(content, image.content_type): raise HTTPException(status_code=400, detail="That file does not look like a valid image.")
    try:
        result = await analyze_with_gemini(content, image.content_type)
    except Exception:
        result = fallback_for(image.filename)
    return persist(result)


@app.post("/api/analyze/demo", response_model=AnalysisResult)
async def analyze_demo(object_key: str = Query(default="table")) -> AnalysisResult:
    return persist(table_result(object_key))


@app.get("/api/analyses")
async def list_analyses() -> list[dict]:
    return [{"id": item.id, "created_at": item.created_at, "object_name": item.object_name, "condition": item.condition, "recommended_action": item.recommended_action, "life_path_score": item.life_path_score} for item in reversed(list(analyses.values()))]


@app.get("/api/analyses/{analysis_id}", response_model=AnalysisResult)
async def get_analysis(analysis_id: str) -> AnalysisResult:
    if analysis_id not in analyses: raise HTTPException(status_code=404, detail="Analysis not found.")
    return analyses[analysis_id]


@app.delete("/api/analyses/{analysis_id}")
async def delete_analysis(analysis_id: str) -> dict[str, str]:
    if analysis_id not in analyses: raise HTTPException(status_code=404, detail="Analysis not found.")
    del analyses[analysis_id]
    return {"status": "deleted", "id": analysis_id}


@app.post("/api/pathways/generate")
async def generate_pathways(request: PathwayGenerateRequest) -> dict:
    result = table_result("table")
    result.object_name = request.object_name
    result.condition = request.condition
    result.visible_damage = request.visible_damage
    result.materials = [component.model_copy(update={"material": material}) for component, material in zip(result.materials, request.materials)] or result.materials
    return {"object_name": request.object_name, "pathways": result.pathways, "weights": {"practicality": 0.25, "reuse_potential": 0.20, "environmental_impact": 0.20, "cost_efficiency": 0.15, "effort": 0.10, "time": 0.10}}


@app.post("/api/pathways/compare")
async def compare_pathways(request: PathwayCompareRequest) -> dict:
    scored = []
    for pathway in request.pathways:
        pathway.life_path_score = score_pathway(pathway)
        scored.append(pathway)
    return {"pathways": sorted(scored, key=lambda item: item.life_path_score, reverse=True), "formula": "25% practicality + 20% reuse + 20% environmental impact + 15% cost + 10% effort + 10% time"}


@app.post("/api/recommendation")
async def recommendation(request: PathwayCompareRequest) -> dict:
    if not request.pathways: raise HTTPException(status_code=422, detail="At least one pathway is required.")
    best = max(request.pathways, key=score_pathway)
    return {"pathway": best.type, "title": best.title, "reason": "This option has the strongest transparent Life-Path Score for the supplied trade-offs.", "life_path_score": score_pathway(best)}
