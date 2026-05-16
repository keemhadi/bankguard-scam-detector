from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests


app = FastAPI(title="BankGuard Backend")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ExplanationRequest(BaseModel):
    message: str
    riskLevel: str
    score: int
    reasons: list[str]


@app.get("/")
def home():
    return {
        "message": "BankGuard backend is running with LM Studio GenAI"
    }


@app.post("/generate-explanation")
def generate_explanation(data: ExplanationRequest):
    reasons_text = "\n".join([f"- {reason}" for reason in data.reasons])

    prompt = f"""
You are BankGuard, a scam awareness assistant for digital banking users in Malaysia.

Your task:
Explain the scam detection result in a calm, clear, and helpful way.

Important rules:
- Do not say the message is 100% confirmed scam.
- Do not pretend to be a bank.
- Do not use words like "our customer service" or "our bank".
- Use "your bank" or "official banking channels" instead.
- Do not say "we detected unusual activity".
- Do not claim that there is actual activity on the user's bank account or bank website.
- Only explain that the message contains warning signs.
- Start the explanation with: "This message contains warning signs because..."
- Do not ask for personal information.
- Do not tell the user to reply to the suspicious message.
- Do not include technical jargon.
- Keep the explanation practical and easy to understand.
- Mention that OTP, TAC, PIN, passwords, and card details should never be shared through unknown links.
- Keep the answer to one short paragraph, around 70 to 100 words.

User message:
{data.message}

Detection result:
Risk Level: {data.riskLevel}
Scam Indicator Score: {data.score}

Detected warning signs:
{reasons_text}

Now generate a user-friendly explanation for the banking user.
"""

    try:
        response = requests.post(
            "http://127.0.0.1:1234/v1/chat/completions",
            json={
                "model": "llama-3.2-3b-instruct",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are BankGuard, a careful digital banking scam awareness assistant. You explain risks clearly without pretending to be a bank."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": 0.4,
                "max_tokens": 180
            },
            timeout=60
        )

        response.raise_for_status()
        result = response.json()

        explanation = result["choices"][0]["message"]["content"]

        return {
            "explanation": explanation
        }

    except Exception as e:
        print("LM Studio error:", e)

        fallback_explanation = (
            f"This message is classified as {data.riskLevel} risk with a scam "
            f"indicator score of {data.score}. The system detected warning signs "
            f"such as {', '.join(data.reasons)}. Users should avoid clicking "
            f"suspicious links or sharing sensitive banking information such as "
            f"OTP, TAC, PIN, passwords, or card details. They should verify the "
            f"message through official banking channels."
        )

        return {
            "explanation": fallback_explanation
        }