import requests

url = "http://127.0.0.1:5001/game/generate_quiz"
payload = {"topics": ["Maths", "Coding", "Physics", "Algorithms"]}
 

response = requests.post(url, json=payload)

print("\n🔹 API Response:\n", response.json())