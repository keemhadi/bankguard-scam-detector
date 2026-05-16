# BankGuard: Local GenAI-Enhanced Scam Message Detector

BankGuard is a prototype web application designed to help digital banking users identify suspicious SMS, WhatsApp, or email messages before clicking harmful links or sharing sensitive information.

The project combines a transparent rule-based scam detection system with a local Generative AI explanation layer using LM Studio.

## Features

- Analyse suspicious banking-related messages
- Classify messages as Low, Medium, or High Risk
- Display scam indicator score
- Show detected warning signs
- Provide recommended safety action
- Generate a user-friendly explanation using a local GenAI model
- Example buttons for High Risk, Medium Risk, and Low Risk messages

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- FastAPI
- Python
- LM Studio local server
- Llama 3.2 3B Instruct model

## How It Works

1. The user enters or selects a suspicious banking message.
2. The rule-based detector checks for scam indicators such as urgent language, suspicious links, account threats, and requests for OTP, TAC, PIN, or passwords.
3. The system calculates a scam indicator score.
4. The message is classified as Low, Medium, or High Risk.
5. The backend sends the result to a local GenAI model through LM Studio.
6. The GenAI model generates a simple explanation for the user.

## Project Purpose

This prototype supports safer digital banking by helping users recognise potential scam messages early. It promotes consumer protection, financial literacy, and safer online banking behaviour.

## Important Note

This tool is a prototype and should be used as an early warning guide only. Users should always verify suspicious messages through official bank websites, mobile apps, or customer service channels.

## Run the Frontend

```bash
npm install
npm run dev
