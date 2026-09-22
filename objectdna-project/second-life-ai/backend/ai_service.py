import base64
import json
import os
import re
from datetime import datetime, timezone
from typing import Any

import httpx

from models import AnalysisResult, Component, ConditionAssessment, ObjectIdentity, Pathway, Recommendation
from prompt import ANALYSIS_PROMPT

WEIGHTS = {
    "practicality_score": float(os.getenv("WEIGHT_PRACTICALITY", "0.25")),
    "reuse_score": float(os.getenv("WEIGHT_REUSE", "0.20")),
    "impact_score": float(os.getenv("WEIGHT_IMPACT", "0.20")),
    "cost_efficiency_score": float(os.getenv("WEIGHT_COST", "0.15")),
    "effort_score": float(os.getenv("WEIGHT_EFFORT", "0.10")),
    "time_score": float(os.getenv("WEIGHT_TIME", "0.10")),
}


def score_pathway(path: Pathway) -> int:
    return round(sum(getattr(path, field) * weight for field, weight in WEIGHTS.items()))


def make_path(type_: str, title: str, description: str, scores: dict[str, int], cost: str, effort: str, skill: str, time: str, value: str) -> dict[str, Any]:
    payload = {"type": type_, "title": title, "description": description, "estimated_cost": cost, "effort": effort, "skill": skill, "time": time, "estimated_value": value, **scores}
    path = Pathway(**payload)
    payload["life_path_score"] = score_pathway(path)
    return payload


def table_result(object_key: str = "table") -> AnalysisResult:
    records = {
        "table": {"name": "Wooden Table", "category": "Furniture", "confidence": 94, "condition": "Repairable", "condition_score": 72, "description": "The main wooden structure appears usable from the visible view, with surface wear and one damaged support area.", "damage": ["Surface scratches detected", "One support area appears damaged", "Main wooden structure appears usable", "Hidden structural damage cannot be assessed from one photo"], "recommendation": "REPURPOSE", "reason": "Most of the wooden structure can be kept, the material cost stays low, and a bookshelf gives the damaged frame a useful new role.", "ideas": ["Bookshelf", "Plant stand", "Entryway storage unit", "Wall shelf", "Workshop bench"], "waste": 12.4, "co2": 18.6, "recovery": 9.1, "safety": ["Visual assessment only. Check stability before putting weight on it.", "Wear eye protection when cutting, drilling, or sanding."], "steps": ["Clean the surface and inspect every joint.", "Remove the damaged support and measure the frame.", "Reinforce the frame and add shelf boards.", "Sand rough edges and apply a low-VOC finish.", "Load-test the bookshelf gradually before everyday use."], "components": [("Tabletop", "Wood", "High"), ("Legs and frame", "Wood", "High"), ("Screws and brackets", "Metal", "Medium"), ("Surface coating", "Finish", "Low")]},
        "chair": {"name": "Wooden Chair", "category": "Furniture", "confidence": 91, "condition": "Needs Repair", "condition_score": 64, "description": "The chair looks structurally promising, although one joint and the worn seat need attention before use.", "damage": ["Worn seat surface", "Loose-looking side joint", "Frame appears intact from the visible view"], "recommendation": "REPAIR", "reason": "A small repair and new seat cover can return the chair to safe everyday use with minimal new material.", "ideas": ["Repair as a dining chair", "Turn into a plant stand", "Use as a bedside valet", "Donate to a repair cafe"], "waste": 4.8, "co2": 7.4, "recovery": 3.1, "safety": ["Do not use for seating until joints are stable and load-tested."], "steps": ["Tighten and glue loose joints.", "Replace or re-cover the seat.", "Sand sharp edges and refinish.", "Test with light weight before normal use."], "components": [("Frame", "Wood", "High"), ("Seat", "Wood / fabric", "Medium"), ("Fasteners", "Metal", "Medium")]},
        "backpack": {"name": "Everyday Backpack", "category": "Textiles", "confidence": 93, "condition": "Usable", "condition_score": 78, "description": "The bag appears usable with wear at the base and straps that should be checked before carrying weight.", "damage": ["Fabric wear at the base", "Straps appear intact", "Zippers should be tested"], "recommendation": "REUSE", "reason": "Cleaning and reinforcing high-wear areas can keep the backpack in its highest-value use for longer.", "ideas": ["Continue using after repair", "Donate to a student", "Convert into a bike pannier", "Use for tool storage"], "waste": 0.8, "co2": 4.2, "recovery": 0.45, "safety": ["Check straps and stitching before carrying heavy loads."], "steps": ["Empty and clean all compartments.", "Patch the worn base or reinforce it with fabric.", "Test the zippers and straps.", "Keep using it or pass it on to a student."], "components": [("Body", "Nylon textile", "High"), ("Straps", "Webbing", "High"), ("Zippers", "Metal / plastic", "Medium")]},
        "electronics": {"name": "Small Electronic Device", "category": "Electronics", "confidence": 86, "condition": "Damaged", "condition_score": 41, "description": "The device shows visible wear and may have a repairable external fault, but internal condition cannot be confirmed from one image.", "damage": ["Worn outer casing", "Cable or port area needs inspection", "Battery and internals are not visible"], "recommendation": "RECOVER", "reason": "Responsible electronics recovery is the safest default until a qualified repairer checks the device and battery condition.", "ideas": ["Qualified repair assessment", "Recover circuit board components", "Responsible electronics recycling", "Reuse intact cable or adapter"], "waste": 0.7, "co2": 2.4, "recovery": 0.3, "safety": ["Do not open, puncture, crush, or charge a damaged battery.", "Use a certified electronics collection point."], "steps": ["Stop using it if it is hot, swollen, or smells unusual.", "Check the model with a qualified repairer.", "Back up personal data if it still powers on.", "Take it to a certified e-waste collection point."], "components": [("Circuit board", "Mixed metals", "Medium"), ("Casing", "Plastic", "Low"), ("Cable", "Copper / polymer", "Medium")]},
        "container": {"name": "Plastic Container", "category": "Plastic", "confidence": 96, "condition": "Usable", "condition_score": 83, "description": "The container appears intact and can stay useful for storage or a simple non-food household reuse.", "damage": ["Surface scuffing", "Container appears intact", "Lid fit should be tested"], "recommendation": "REUSE", "reason": "A clean, intact container can replace a new storage item with almost no added cost or effort.", "ideas": ["Desk storage", "Planter for a small herb", "Hardware organizer", "Craft supply container"], "waste": 0.2, "co2": 0.4, "recovery": 0.12, "safety": ["Do not reuse for food unless the original material and condition are known to be food-safe."], "steps": ["Wash and dry the container.", "Check the lid and remove labels.", "Choose storage or a low-risk craft use.", "Recycle it once it is cracked or contaminated."], "components": [("Container body", "Plastic", "High"), ("Lid", "Plastic", "High")]},
    }
    record = records.get(object_key, records["table"])
    common = {
        "REPAIR": make_path("REPAIR", "Repair for continued use", "Stabilize the object and keep its original role.", {"reuse_score": 91, "impact_score": 88, "practicality_score": 82, "cost_efficiency_score": 82, "effort_score": 70, "time_score": 72}, "Low", "Medium", "Basic DIY", "2–4 hrs", "$$"),
        "REUSE": make_path("REUSE", "Keep using it as-is", "Clean, inspect, and extend the object in its current role.", {"reuse_score": 88, "impact_score": 86, "practicality_score": 90, "cost_efficiency_score": 94, "effort_score": 88, "time_score": 88}, "Very low", "Low", "None", "30 min", "$$"),
        "REPURPOSE": make_path("REPURPOSE", "Convert it into something useful", "Transform the sound materials into a new role.", {"reuse_score": 96, "impact_score": 93, "practicality_score": 91, "cost_efficiency_score": 86, "effort_score": 78, "time_score": 76}, "Low", "Medium", "Basic DIY", "3–5 hrs", "$$$"),
        "DONATE": make_path("DONATE", "Donate to a repairer or community", "Pass the object to someone who can use or restore it.", {"reuse_score": 84, "impact_score": 87, "practicality_score": 77, "cost_efficiency_score": 98, "effort_score": 88, "time_score": 84}, "Free", "Low", "None", "1 day", "$"),
        "RECOVER": make_path("RECOVER", "Recover useful materials", "Separate materials and use a responsible recovery route.", {"reuse_score": 68, "impact_score": 78, "practicality_score": 78, "cost_efficiency_score": 90, "effort_score": 70, "time_score": 70}, "Low", "Medium", "Some DIY", "1–3 hrs", "$"),
    }
    best = common[record["recommendation"]]
    components = [Component(name=name, material=material, reuse_potential=potential) for name, material, potential in record["components"]]
    now = datetime.now(timezone.utc).isoformat()
    return AnalysisResult(
        object_name=record["name"], category=record["category"], confidence=record["confidence"], condition=record["condition"], condition_score=record["condition_score"], description=record["description"], visible_damage=record["damage"], materials=components, components=components, object=ObjectIdentity(name=record["name"], confidence=record["confidence"]), condition_assessment=ConditionAssessment(label=record["condition"], score=record["condition_score"], reasoning=record["damage"]), pathways=[Pathway(**item) for item in common.values()], recommended_action=record["recommendation"], recommendation_reason=record["reason"], recommendation=Recommendation(pathway=record["recommendation"], title=best["title"], reason=record["reason"], steps=record["steps"]), life_path_score=best["life_path_score"], score_breakdown={"practicality": best["practicality_score"], "reuse_potential": best["reuse_score"], "environmental_impact": best["impact_score"], "cost_efficiency": best["cost_efficiency_score"], "effort": best["effort_score"], "time": best["time_score"]}, second_life_ideas=record["ideas"], estimated_waste_avoided_kg=record["waste"], estimated_co2_avoided_kg=record["co2"], material_recovery_kg=record["recovery"], safety_notes=record["safety"], action_plan=record["steps"], demo_data=True, source_label="Demo analysis", created_at=now,
    )


def fallback_for(filename: str | None) -> AnalysisResult:
    name = (filename or "").lower()
    for key, terms in {"chair": ("chair",), "backpack": ("backpack", "bag"), "electronics": ("electronic", "device", "phone", "laptop"), "container": ("container", "plastic", "bottle")}.items():
        if any(term in name for term in terms): return table_result(key)
    return table_result("table")


def extract_json(text: str) -> dict[str, Any]:
    cleaned = re.sub(r"^```(?:json)?\s*", "", text.strip(), flags=re.IGNORECASE)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    return json.loads(cleaned)


async def analyze_with_gemini(image_bytes: bytes, mime_type: str) -> AnalysisResult:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key: raise RuntimeError("Gemini is not configured")
    model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-lite")
    endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    payload = {"contents": [{"parts": [{"text": ANALYSIS_PROMPT}, {"inline_data": {"mime_type": mime_type, "data": base64.b64encode(image_bytes).decode("ascii")}}]}], "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json"}}
    async with httpx.AsyncClient(timeout=35) as client:
        response = await client.post(endpoint, params={"key": api_key}, json=payload)
        response.raise_for_status()
        data = response.json()
    parsed = extract_json(data["candidates"][0]["content"]["parts"][0]["text"])
    result = AnalysisResult(**parsed, demo_data=False, source_label="AI analysis", created_at=datetime.now(timezone.utc).isoformat())
    if not result.object: result.object = ObjectIdentity(name=result.object_name, confidence=result.confidence)
    if not result.condition_assessment: result.condition_assessment = ConditionAssessment(label=result.condition, score=result.condition_score, reasoning=result.visible_damage)
    if not result.components: result.components = result.materials
    if not result.materials: result.materials = result.components
    for path in result.pathways: path.life_path_score = score_pathway(path)
    best = max(result.pathways, key=lambda item: item.life_path_score, default=None)
    if best:
        result.life_path_score = best.life_path_score
        result.recommended_action = best.type
        result.recommendation = Recommendation(pathway=best.type, title=best.title, reason=result.recommendation_reason, steps=result.action_plan)
    return result
