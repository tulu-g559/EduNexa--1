import requests
import re

url = "http://127.0.0.1:5001/ask"

def clean_markdown(text):
    """Removes Markdown formatting from text."""
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)  # Bold (**text**)
    text = re.sub(r'\*(.*?)\*', r'\1', text)      # Italics (*text*)
    text = re.sub(r'`(.*?)`', r'\1', text)        # Inline code (`text`)
    text = re.sub(r'#+ ', '', text)               # Headings (# Text)
    text = re.sub(r'\n+', '\n', text).strip()     # Remove excessive new lines 
    return text

print("🔹 EduNexa AI Tutor (Type 'exit' to stop)\n")

while True:
    user_input = input("You: ")
    
    if user_input.lower() == "exit":
        print("🔹 Exiting EduNexa AI Tutor. Goodbye!")
        break

    payload = {"question": user_input}
    response = requests.post(url, json=payload)

    if response.status_code == 200:
        answer = response.json().get("answer", "No response received.")
        print("EduNexa:", clean_markdown(answer))
    else:
        print("🔴 Error:", response.json())
