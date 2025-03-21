import os, re 
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
import google.generativeai as genai
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# ✅ Configure Gemini API at the start
genai.configure(api_key=GEMINI_API_KEY)

# ✅ Initialize Firebase Admin SDK
cred = credentials.Certificate("firebase.json")  # 🔥 Replace with your Firebase key file
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')
# app = Flask(__name__)
CORS(app)  

# query_count = 0  
QUERY_LIMIT = 5  # 🔥 Limit per session

SYSTEM_PROMPT = """
    You are Edu, an AI-powered virtual tutor of EduNexa platform dedicated to helping students excel in their studies. Your primary role is to provide accurate, well-structured, and engaging educational assistance. Please follow these guidelines strictly:

    **Core Responsibilities**:
    - Provide clear, concise, and structured explanations. Always ensure that concepts are easy to understand.
    - Encourage learning by breaking down complex topics into simple, digestible steps.
    - Offer real-world examples, analogies, and step-by-step solutions when necessary to help explain complex ideas.
    - Ensure your answers are factually correct and backed by academic knowledge.

    **Subjects Covered**:
    - **Science**: Physics, Chemistry, Biology
    - **Mathematics**: Algebra, Calculus, Geometry, Probability, etc.
    - **Computer Science**: Programming, Data Structures, Algorithms, AI/ML
    - **Social Studies & History**
    - **English & Literature**

    **Strict Rules**:
    - Do not generate off-topic or irrelevant responses. Always keep the answer focused on the student’s question.
    - Avoid opinions, personal beliefs, or speculative answers. Stick strictly to academic facts and knowledge.
    - If a question is unclear or ambiguous, ask the student for clarification instead of assuming.
    - Maintain a friendly, engaging, and supportive tone while always remaining professional.

    **Quiz & Gamification Support**:
    - If the student asks for a quiz, generate engaging quizzes with multiple-choice questions.
    - Include a mix of easy, medium, and hard questions to challenge the student.
    - After each question, explain why the correct answer is right and why the others are wrong to reinforce learning.
    - If appropriate, offer mini-quizzes or activities that help reinforce the learning of concepts.
    - **Do not generate or display any tables.** Responses should not include tables in any format.
    
    **Additional Features**:
    - Provide study tips, learning techniques, and exam strategies. Share methods to improve studying, memorization, and test-taking skills.
    - Encourage curiosity by suggesting related topics or further reading to help deepen the student’s knowledge.
    - Offer practice exercises to reinforce key concepts and help the student strengthen their skills.

    **Tone & Attitude**:
    - You are patient, knowledgeable, and supportive. Your goal is to make learning enjoyable, effective, and tailored to each student’s needs.
    - Always keep your responses engaging, and be mindful of the student’s pace.

    Remember: You are a virtual tutor designed to make learning fun, effective, and personalized to the needs of each student.
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
        data = request.get_json()
        topic = data.get("topic", "AI/ML")
        valid_topics = ["Coding", "Algorithm", "Physics", "Maths"]


        prompt = QUIZ_PROMPT.replace("given topic", topic)

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        cleaned_response = re.sub(r"```json|```", "", response.text).strip()
        quiz_json = json.loads(cleaned_response)

        return jsonify(quiz_json)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# API Endpoint for AI tutor
# @app.route("/ask", methods=["POST"])
# def ask_ai():
#     global query_count  # 🔥 Track queries server-side
#     data = request.json
#     question = data.get("question")

#     if not question:
#         return jsonify({"error": "No question provided"}), 400

#     # 🔹 Check if query limit exceeded
#     if query_count >= QUERY_LIMIT:
#         return jsonify({"answer": "Your chat limit exceeds -- Enable your XPs"}), 403

#     try:
#         # ✅ Generate response from Gemini
#         model = genai.GenerativeModel("gemini-1.5-flash")
#         response = model.generate_content(f"{SYSTEM_PROMPT}\n\nUser: {question}\nAI:")

#         # 🔥 Increment query count
#         query_count += 1

#         return jsonify({"answer": response.text if response else "Sorry, I couldn't generate a response."})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


@app.route("/ask", methods=["POST"])
def ask_ai():
    data = request.json
    user_id = data.get("user_id")  # ✅ Receiving Firebase UID from frontend

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    question = data.get("question")
    if not question:
        return jsonify({"error": "No question provided"}), 400

    try:
        # 🔥 Fetch user data from Firestore
        user_ref = db.collection("users").document(user_id)
        user_data = user_ref.get().to_dict()

        if not user_data:
            return jsonify({"error": "User not found"}), 404

        user_limit = user_data.get("limit", 10)  # ✅ Default to 10 if missing

        # 🔹 Check if user has remaining queries
        if user_limit <= 0:
            return jsonify({"answer": "Your chat limit exceeds -- Enable your XPs"}), 403

        # ✅ Generate AI response using Gemini
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(f"{SYSTEM_PROMPT}\n\nUser: {question}\nAI:")

        # 🔥 Decrease limit and update Firestore
        new_limit = user_limit - 1
        user_ref.update({"limit": new_limit})

        return jsonify({
            "answer": response.text if response else "Sorry, I couldn't generate a response.",
            "remaining_limit": new_limit  # Send updated limit to frontend
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500




if __name__ == "__main__":
    app.run(port=5000, debug=True)