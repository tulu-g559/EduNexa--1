import os, re 
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
import google.generativeai as genai
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import fitz

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# ✅ Configure Gemini API at the start
genai.configure(api_key=GEMINI_API_KEY)

firebase_config_json = os.getenv("FIREBASE_CONFIG")

if firebase_config_json:
    firebase_config = json.loads(firebase_config_json)

    # Write the JSON to a file (if needed)
    firebase_json_path = "firebase.json"
    with open(firebase_json_path, "w") as json_file:
        json.dump(firebase_config, json_file)

    print("✅ firebase.json recreated successfully.")


# ✅ Initialize Firebase Admin SDK
cred = credentials.Certificate("firebase.json")  # 🔥 Replace with your Firebase key file
firebase_admin.initialize_app(cred)
db = firestore.client()

# app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')
app = Flask(__name__, static_folder='../frontend/dist/assets', template_folder='../frontend/dist')
# app = Flask(__name__)
CORS(app)  

# Setup for PDF uploads (from web_scrapper.py)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# query_count = 0  
QUERY_LIMIT = 100  # 🔥 Limit per session

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

SYSTEM_PROMPT_AI = """
    You are Edu, an AI-powered virtual tutor of EduNexa platform dedicated to helping students excel in their studies. Your primary role is to provide accurate, well-structured, and engaging educational assistance. Please follow these guidelines strictly:

    **Context Awareness**:
    - Review the provided conversation history before answering any new questions
    - Reference previous discussions when relevant to maintain continuity
    - If a student asks about something mentioned earlier, acknowledge and build upon that previous context
    - If you notice contradictions with previous answers, politely point them out
    - Use the context to provide more personalized and relevant responses

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
    - Do not generate off-topic or irrelevant responses. Always keep the answer focused on the student's question.
    - Avoid opinions, personal beliefs, or speculative answers. Stick strictly to academic facts and knowledge.
    - If a question is unclear or ambiguous, ask the student for clarification instead of assuming.
    - Maintain a friendly, engaging, and supportive tone while always remaining professional.
    - If referring to previous context, clearly indicate which part you're referencing.

    **Quiz & Gamification Support**:
    - If the student asks for a quiz, generate engaging quizzes with multiple-choice questions.
    - Include a mix of easy, medium, and hard questions to challenge the student.
    - After each question, explain why the correct answer is right and why the others are wrong to reinforce learning.
    - If appropriate, offer mini-quizzes or activities that help reinforce the learning of concepts.
    - **Do not generate or display any tables.** Responses should not include tables in any format.
    
    **Additional Features**:
    - Provide study tips, learning techniques, and exam strategies. Share methods to improve studying, memorization, and test-taking skills.
    - Encourage curiosity by suggesting related topics or further reading to help deepen the student's knowledge.
    - Offer practice exercises to reinforce key concepts and help the student strengthen their skills.
    - Use previous interactions to suggest relevant follow-up topics or exercises.

    **Tone & Attitude**:
    - You are patient, knowledgeable, and supportive. Your goal is to make learning enjoyable, effective, and tailored to each student's needs.
    - Always keep your responses engaging, and be mindful of the student's pace.
    - Maintain consistency in explanations across multiple interactions.
    - If you notice a student struggling with a concept based on previous interactions, offer additional support or alternative explanations.

    **Context Management**:
    - When answering follow-up questions, explicitly reference relevant parts of previous conversations
    - If a student refers to something discussed earlier, acknowledge it and provide continuity
    - Use previous interactions to gauge the student's understanding level and adjust explanations accordingly
    - If context is unclear or missing, politely ask for clarification

    Remember: You are a virtual tutor designed to make learning fun, effective, and personalized to the needs of each student. Use the conversation history wisely to provide more meaningful and connected learning experiences. Never introduce yourself or say hi more than once or if asked to.
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

def extract_text_from_pdf(pdf_path):
    """Extracts text from a PDF file and removes any HTML tags."""
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text("text") + "\n"
        
        # Remove any HTML tags
        clean_text = re.sub(r'<.*?>', '', text)
        return clean_text
    except Exception as e:
        return f"Error: {e}"

def get_gemini_hints(context, question):
    """Uses Gemini API to provide multiple hints and a final answer based on extracted PDF data."""
    prompt = f"""
    You are an AI tutor integrated into our educational platform EduNexa, designed to guide students in solving problems rather than giving direct answers.

    Using the provided assignment content:
    {context}

    Provide the following:
    1. A small hint to assist the student in thinking through the following question without revealing the complete answer:
    {question}

    2. An elaborate hint to further assist the student in understanding the question without revealing the complete answer.

    3. The final answer to the question.

    The hints should:
    - Encourage critical thinking.
    - Provide relevant clues without directly solving the problem.
    - Be concise and clear.

    Respond in plain text without any markdown or styling.
    """
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error: {e}"

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
        response_text = get_gemini_hints(user_data.get("context", ""), question)

        # 🔥 Decrease limit and update Firestore
        new_limit = user_limit - 1
        user_ref.update({"limit": new_limit})

        return jsonify({
            "answer": response_text,
            "remaining_limit": new_limit  # Send updated limit to frontend
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/ask-ai", methods=["POST"])
def ask_chat():
    data = request.json
    user_id = data.get("user_id")
    question = data.get("question")
    context = data.get("context", [])  # Will be empty list if no context provided

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    if not question:
        return jsonify({"error": "No question provided"}), 400

    try:
        # Fetch user data from Firestore
        user_ref = db.collection("users").document(user_id)
        user_data = user_ref.get().to_dict()

        if not user_data:
            return jsonify({"error": "User not found"}), 404

        user_limit = user_data.get("limit", 10)

        if user_limit <= 0:
            return jsonify({"answer": "Your chat limit exceeds -- Enable your XPs"}), 403

        # Format context for the prompt
        context_text = ""
        if context:
            context_text = "Previous Conversation:\n"
            for msg in context:
                context_text += f"{msg['role'].title()}: {msg['content']}\n"
        
        # Create complete prompt with context
        full_prompt = f"""{SYSTEM_PROMPT_AI}

{context_text}
Current Question: {question}

Please provide a response considering the above context if relevant."""

        # Generate AI response using Gemini
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(full_prompt)

        # Update user's limit
        new_limit = user_limit - 1
        user_ref.update({"limit": new_limit})

        return jsonify({
            "answer": response.text if response else "Sorry, I couldn't generate a response.",
            "remaining_limit": new_limit
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#### AI-POWERED QUIZ GENERATION ###
# filepath: [app.py](http://_vscodecontentref_/0)
@app.route("/game/generate_quiz", methods=["POST"])
def generate_quiz():
    try:
        print("🔹 API hit!")  # Debugging
        data = request.get_json()
        print("🔹 Received data:", data)  # Debugging

        if not data:
            return jsonify({"error": "Missing JSON payload"}), 400

        valid_topics = ["Coding", "Algorithm", "Physics", "Maths"]
        topic = data.get("topic", "General Knowledge")

        # Ensure the topic is valid
        if topic not in valid_topics:
            topic = "Computer Science"

        prompt = f"""
    Generate a unique multiple-choice quiz question on the topic '{topic}' with exactly 4 answer options. 
    Ensure that the question is **not repetitive** and is different from commonly asked questions.

    The response should be in valid JSON format:
    {{
        "question": "Your question?",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correct_answer": "Correct option"
    }}
"""


        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        print("\n🔹 RAW GEMINI RESPONSE:\n", response.text)  # Debugging

        # ✅ Clean the response to remove backticks and extra formatting
        cleaned_response = response.text.strip().strip("```").strip("json").strip()
        print("\n🔹 CLEANED RESPONSE:\n", cleaned_response)  # Debugging

        # ✅ Parse the cleaned response as JSON
        quiz_json = json.loads(cleaned_response)

        # ✅ Return the parsed quiz question
        return jsonify({"questions": [quiz_json]})

    except json.JSONDecodeError as e:
        print("🔴 JSON Decode Error:", e)  # Debugging
        return jsonify({"error": "AI response is not valid JSON", "raw_response": response.text}), 500
    except Exception as e:
        print("🔴 Unexpected Error:", e)  # Debugging
        return jsonify({"error": str(e)}), 500
    

# PDF upload endpoint (from web_scrapper.py)
@app.route("/upload", methods=["POST"])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)
    
    text = extract_text_from_pdf(file_path)
    return jsonify({"text": text})

if __name__ == "__main__":
    app.run(port=5000, debug=True)