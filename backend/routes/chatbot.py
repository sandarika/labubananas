from fastapi import APIRouter
from pydantic import BaseModel


class ChatbotQuery(BaseModel):
    question: str


router = APIRouter()


@router.post("/ask")
def ask_legal_chatbot(payload: ChatbotQuery):
    # Stubbed response for demo purposes. Replace with a real LLM/AI integration (e.g., Gemini) later.
    q = payload.question.strip()
    guidance = (
        "This is informational, not legal advice. Consider contacting a licensed attorney or your union rep."
    )
    tips = []
    if any(k in q.lower() for k in ["overtime", "hours", "breaks"]):
        tips.append("Track worked hours accurately and keep personal records.")
        tips.append("Review your local labor laws about overtime and rest periods.")
    if any(k in q.lower() for k in ["retaliation", "fire", "fired", "discipline"]):
        tips.append("Document incidents and communications in writing.")
        tips.append("Ask HR or your union about anti-retaliation protections.")
    if not tips:
        tips = [
            "Document facts, dates, and communications.",
            "Check your contract and local labor laws.",
            "Reach out to a union representative for tailored guidance.",
        ]
    return {"answer": guidance, "suggestions": tips}
