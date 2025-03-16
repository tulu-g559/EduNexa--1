import os, re 
from dotenv import load_dotenv
import google.generativeai as genai
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# ✅ Configure Gemini API at the start
genai.configure(api_key=GEMINI_API_KEY)

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')
CORS(app)  

SYSTEM_PROMPT = """
    You are EduNexa, an AI-powered virtual tutor dedicated to helping students excel in their studies. Your primary role is to provide accurate, well-structured, and engaging educational assistance. Follow these guidelines:
    Core Responsibilities:
        - Provide clear, concise, and structured explanations.
        - Adapt responses based on the student’s level (beginner, intermediate, advanced).
        - Encourage learning by breaking down complex topics into simple steps.
        - Offer real-world examples, analogies, and step-by-step solutions when necessary.
        - Ensure answers are factually correct and backed by academic knowledge.
    Subjects Covered:
        - Science (Physics, Chemistry, Biology)
        - Mathematics (Algebra, Calculus, Geometry, Probability, etc.)
        - Computer Science (Programming, Data Structures, Algorithms, AI/ML)
        - Social Studies & History
        - English & Literature
    Strict Rules:
        - Do not generate off-topic or irrelevant responses. 
        - Avoid opinions, personal beliefs, or speculative answers.
        - If a question is unclear, ask for clarification instead of assuming.
        - Keep a friendly and engaging tone while maintaining professionalism.
    Quiz & Gamification Support:
        - If asked, generate engaging quizzes with multiple-choice questions.
        - Include a mix of easy, medium, and hard questions to challenge the student.
        - Explain why an answer is correct or incorrect to reinforce learning.
    Additional Features:
        - Can provide study tips, learning techniques, and exam strategies.
        - Encourage curiosity by suggesting related topics for deeper exploration.
        - Offer practice exercises to reinforce key concepts.
    You are patient, knowledgeable, and supportive—your goal is to make learning enjoyable and effective.
    """

# prompt for quiz generation
QUIZ_PROMPT = """
    Generate a multiple-choice quiz question on the given topic.  

    Guidelines:
    - The question must be clear, factually correct, and relevant to the topic.
    - Provide exactly four answer options, with only one correct answer.
    - Ensure a mix of difficulty levels (easy, medium, hard) when generating multiple questions.
    - Avoid ambiguous, opinion-based, or subjective questions.
    - The response must be in valid JSON format with no extra characters, markdown, or explanations.

    Output Format (JSON only):
    {
    "question": "What is 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "correct_answer": "4"
    }

    Example Topics:
    - Mathematics (e.g., Algebra, Calculus, Probability)
    - Science (e.g., Physics, Chemistry, Biology)
    - Computer Science (e.g., Data Structures, Programming, AI)
    - Logical Reasoning (e.g., Puzzles, Patterns)

    DO NOT include any extra text, explanations, or markdown formatting in your response—only return valid JSON.
    """

@app.route('/')
def serve_react():
    return send_from_directory(app.static_folder, 'index.html')

#testing the api
@app.route('/api/data', methods=['GET'])
def get_data():
    return {"message": "Hello from Flask!"}



#### AI-POWERED QUIZ GENERATION ###
@app.route("/game/generate_quiz", methods=["POST"])
def generate_quiz():
    try:
        print("🔹 API hit!")  # Debugging
        data = request.get_json()
        print("🔹 Received data:", data)  # Debugging

        if not data:
            return jsonify({"error": "Missing JSON payload"}), 400

        valid_topics = ["Coding", "Algorithm", "Physics", "Maths"]
        topic = data.get("topic", "AI/ML")

        # Ensure the topic is valid
        if topic not in valid_topics:
            topic = "Computer Science"

        prompt = QUIZ_PROMPT.replace("given topic", topic)

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        print("\n🔹 RAW GEMINI RESPONSE:\n", response.text)  # Debugging

        try:
            # Remove backticks and JSON syntax markers
            cleaned_response = re.sub(r"```json|```", "", response.text).strip()

            # Parse cleaned JSON
            quiz_json = json.loads(cleaned_response)

            return jsonify(quiz_json)  # 🔹 Removes extra "questions" key
        except json.JSONDecodeError:
            return jsonify({"error": "AI response is not valid JSON", "raw_response": response.text}), 500

    except Exception as e:
        print("🔴 Error:", str(e))
        return jsonify({"error": str(e)}), 500

    

# API Endpoint for AI tutor
@app.route("/ask", methods=["POST"])
def ask_ai():
    data = request.json
    question = data.get("question")
    
    if not question:
        return jsonify({"error": "No question provided"}), 400

    try:
        # Create a chat session with Gemini
        model = genai.GenerativeModel("gemini-1.5-flash")  # Use latest Gemini model
        response = model.generate_content(f"{SYSTEM_PROMPT}\n\nUser: {question}\nAI:")
        
        # Extract AI response
        ai_response = response.text if response else "Sorry, I couldn't generate a response."
        
        return jsonify({"answer": ai_response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5001, debug=True)