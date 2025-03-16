import os
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
        topic = data.get("topic", "General Knowledge")  

        # Ensure the topic is valid
        if topic not in valid_topics:
            topic = "Computer Science"

        prompt = f"""
        Generate a multiple-choice quiz question on the topic '{topic}' with exactly 4 answer options.
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

        try:
            # ✅ Remove backticks before parsing JSON
            cleaned_response = response.text.strip().strip("json").strip("")
            quiz_json = json.loads(cleaned_response)
            return jsonify({"questions": [quiz_json]})
        except json.JSONDecodeError:
            return jsonify({"error": "AI response is not valid JSON", "raw_response": response.text}), 500

    except Exception as e:
        print("🔴 Error:", str(e))
        return jsonify({"error": str(e)}), 500

    


if __name__ == "_main_":
    app.run(host="127.0.0.1", port=5001, debug=True)