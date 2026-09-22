from typing import Dict, List

from pydantic import BaseModel, Field


class ObjectIdentity(BaseModel):
    name: str = "Unknown object"
    confidence: float = Field(default=0, ge=0, le=100)


class ConditionAssessment(BaseModel):
    label: str = "Unknown"
    score: int = Field(default=0, ge=0, le=100)
    reasoning: List[str] = Field(default_factory=list, max_length=8)


class Component(BaseModel):
    name: str = "Component"
    material: str = "Unknown"
    reuse_potential: str = "Medium"


class Pathway(BaseModel):
    type: str
    title: str
    description: str
    estimated_cost: str = "Unknown"
    effort: str = "Unknown"
    skill: str = "Unknown"
    time: str = "Unknown"
    estimated_value: str = "Unknown"
    reuse_score: int = Field(default=0, ge=0, le=100)
    impact_score: int = Field(default=0, ge=0, le=100)
    practicality_score: int = Field(default=0, ge=0, le=100)
    cost_efficiency_score: int = Field(default=0, ge=0, le=100)
    effort_score: int = Field(default=0, ge=0, le=100)
    time_score: int = Field(default=0, ge=0, le=100)
    life_path_score: int = Field(default=0, ge=0, le=100)


class Recommendation(BaseModel):
    pathway: str = "RECOVER"
    title: str = "Recover useful materials"
    reason: str = "Use the safest practical route that keeps value in circulation."
    steps: List[str] = Field(default_factory=list, max_length=8)


class AnalysisResult(BaseModel):
    id: str | None = None
    created_at: str | None = None
    object_name: str = "Unknown object"
    category: str = "Other"
    confidence: float = Field(default=0, ge=0, le=100)
    condition: str = "Unknown"
    condition_score: int = Field(default=0, ge=0, le=100)
    description: str = "The image does not provide enough visible detail for a confident assessment."
    visible_damage: List[str] = Field(default_factory=list, max_length=8)
    materials: List[Component] = Field(default_factory=list, max_length=12)
    components: List[Component] = Field(default_factory=list, max_length=12)
    object: ObjectIdentity | None = None
    condition_assessment: ConditionAssessment | None = None
    pathways: List[Pathway] = Field(default_factory=list, max_length=8)
    recommended_action: str = "RECOVER"
    recommendation_reason: str = "When reuse is not practical, recover useful materials responsibly."
    recommendation: Recommendation | None = None
    life_path_score: int = Field(default=0, ge=0, le=100)
    score_breakdown: Dict[str, int] = Field(default_factory=dict)
    second_life_ideas: List[str] = Field(default_factory=list, max_length=8)
    estimated_waste_avoided_kg: float = Field(default=0, ge=0, le=1000)
    estimated_co2_avoided_kg: float = Field(default=0, ge=0, le=1000)
    material_recovery_kg: float = Field(default=0, ge=0, le=1000)
    safety_notes: List[str] = Field(default_factory=list, max_length=8)
    action_plan: List[str] = Field(default_factory=list, max_length=8)
    demo_data: bool = False
    source_label: str = "AI analysis"
