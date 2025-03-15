import os
from dotenv import load_dotenv
import google.generativeai as genai
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import speech_recognition as sr

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')
CORS(app)  # Enable Cross-Origin Resource Sharing
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///quiz_battle.db'

# System prompt for quiz generation
QUIZ_PROMPT = """
Generate a multiple-choice question based on the given topic. 
Format:
{
  "question": "What is 2 + 2?",
  "options": ["3", "4", "5", "6"],
  "correct_answer": "4"
}
"""

@app.route('/')
def serve_react():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/data', methods=['GET'])
def get_data():
    return {"message": "Hello from Flask!"}

#### AI-POWERED QUIZ GENERATION ####
@app.route('/game/generate_quiz', methods=['POST'])
def generate_quiz():
    data = request.json
    topic = data.get("topic", "General Knowledge")

    try:
        # Create a chat session with Gemini
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(f"{QUIZ_PROMPT}\nTopic: {topic}")

        # Extract response as JSON
        if response and hasattr(response, "text"):
            question_data = eval(response.text)  # Convert AI response to Python dictionary
        else:
            return jsonify({"error": "Failed to generate question"}), 500

        return jsonify({"questions": [question_data]})  # Return in expected format

    except Exception as e:
        return jsonify({"error": str(e)}), 500


genai.configure(api_key=GEMINI_API_KEY)

# AI Tutor System Prompt
SYSTEM_PROMPT = """
You are an AI tutor named EduNexa, designed to help students with their studies.
- Provide clear and concise explanations.
- Answer questions related to academic subjects.
- Do not generate unrelated or off-topic responses.
- If a question is unclear, ask for clarification.
"""

@app.route('/')
def serve_react():
    return send_from_directory(app.static_folder, 'index.html')

# ✅ New AI Tutor Route
@app.route("/ai-tutor", methods=["POST"])
def ai_tutor():
    data = request.json
    question = data.get("question")

    if not question:
        return jsonify({"error": "No question provided"}), 400

    try:
        # Create a Gemini model instance
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(f"{SYSTEM_PROMPT}\n\nUser: {question}\nAI:")
        
        ai_response = response.text if hasattr(response, "text") else "Sorry, I couldn't generate a response."

        return jsonify({"answer": ai_response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
