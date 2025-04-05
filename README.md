# 🎓 EduNexa – AI-Powered Smart Learning Platform  

## 📖 Overview  
EduNexa is an **AI-powered learning platform** designed to **revolutionize education** with interactive classrooms, AI tutoring, and gamified learning experiences. It bridges the gap between **traditional learning** and **modern technology**, making education **engaging, adaptive, and accessible for all**.  

🔥 **Key Highlights:**  
✔ **AI-driven personalized learning assistant**  
✔ **Gamification to enhance engagement**  
✔ **Smart virtual classrooms for real-time collaboration**  
✔ **PDF Assignment Solver for instant academic support**  
✔ **Nexa Bot – Your 24/7 AI-powered assistant**  

---

## 🎯 Innovation & Impact  
🌍 **What Makes EduNexa Unique?**  
🔹 Combines **AI + Gamification + Smart Classrooms + PDF Solver + AI Chatbot** in one seamless platform  
🔹 Adapts learning paths based on **user behavior & performance**  
🔹 Makes learning **fun, interactive & effective** for students  

💡 **Who Can Use It?**  
👨‍🎓 **Students** – Personalized AI tutor, gamified quizzes, assignment helper  
👩‍🏫 **Educators** – Smart classrooms & engagement tools  
🏫 **Institutions** – Scalable modern learning infrastructure  

---

## 🚀 Features  

### 🔹 *AI-Powered Virtual Tutor*  
- Uses **Gemini API (gemini-2.0-flash)** for real-time question answering and tutoring  
- Provides **personalized learning recommendations** based on student performance  

### 🔹 *Gamified Learning & Student Engagement*  
- **Interactive quizzes, badges, and rewards** to keep students motivated  
- Backend powered by **Flask** for optimal performance and scalability  

### 🔹 *Smart Virtual Classrooms*  
- Seamless video conferencing using **Jitsi Meet**
- Features like real-time chat, student interaction, and teacher control panel  
- Supports a **collaborative digital environment** for remote and hybrid learning  

### 🔹 *Assignment Solver (PDF-Based)*  
- Upload **PDF assignments** and ask questions from the content  
- EduNexa reads your document and gives **contextual hints & explanations**  
- Designed to reduce academic stress and encourage understanding  

### 🔹 *Nexa Bot – Your Personal AI Assistant*  
- Powered by **Vertex AI**  
- Ask anything about EduNexa features, how-to guides, or general queries  
- Available 24/7 within the app for real-time help and guidance  

### 🔹 *Remote Learning & Accessibility*
- Online **AI-powered tutoring** for students worldwide  
- Seamless **digital accessibility** with a clean interface  
- Designed for students in **low-connectivity regions**  

### 🔹 *Digital Inclusion & Tech Accessibility*  
- **Optimized for low-bandwidth connections**  
- **Simple and intuitive UI** for all user levels and devices  

---

## 🛠️ Tech Stack  

### 🎨 Frontend  
- ![React](https://img.shields.io/badge/ReactJS-61DAFB?style=for-the-badge&logo=react&logoColor=white) **ReactJS (Vite)**  
- ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) **Tailwind CSS**  
- ![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white) **Figma** – UI/UX prototyping   
- ![React](https://img.shields.io/badge/Jitsi-61DAFB?style=for-the-badge&logo=jitsi&logoColor=white) **Jitsi Meet SDK**

### 🧠 Backend & AI  
- ![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white) **Flask**  
- ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black) **Firebase** – Authentication & Datastore  
- ![AI](https://img.shields.io/badge/AI%20Models-764ABC?style=for-the-badge&logo=ai&logoColor=white) **AI/ML Models**  
- ![Gemini API](https://img.shields.io/badge/Gemini%20API-blueviolet?style=for-the-badge&logo=google) **Gemini-2.0-Flash API** – For AI tutoring  
- ![GCP](https://img.shields.io/badge/GCP%20-red?style=for-the-badge&logo) **Vertex AI Conversational Agents**
---

## 🎨 UI/UX & Presentation  
✔ **Modern, interactive, and visually appealing design**  
✔ **Smooth navigation & intuitive flows**  
✔ **Gamified animations and interactive elements**  

---

## 📸 Screenshots  

| **Home Page** | **AI Tutor** | **Gamification** |
|:------------:|:------------:|:------------:|
| ![Home](https://github.com/user-attachments/assets/3877c8eb-6b52-48cd-a750-e92e52fc304d)| ![image](https://github.com/user-attachments/assets/001007aa-fe55-44d2-8b61-7f1f683839ad)| ![image](https://github.com/user-attachments/assets/df3d3e5a-b785-4667-ac64-dd4e14653ee4)|

## ⚙️ How It Works  
1️⃣ **User Registration & Login –** Sign up and set learning preferences.  
2️⃣ **Classroom for Seamless Video Conferencing –** Join virtual classrooms for interactive learning and collaboration.  
3️⃣ **AI Tutor for Any Problem –** Get instant AI-powered assistance with a limited number of chat interactions.   
4️⃣ **Solver for Assignment Help –** Upload questions from your assignment and receive AI-generated hints (limited usage).   
5️⃣ **Earn Rewards for More Access –** If the chat or solver limit is exceeded, play interactive quizzes to earn reward points.   
6️⃣ **Use Rewards to Extend Limits –** Redeem reward points to unlock more AI tutor interactions and solver hints.

---

## ⚡ Installation  
1️⃣ **Clone the Repository:**  
```bash   
git clone https://github.com/yourusername/EduNexa--1.git  
cd EduNexa--1  
```  

2️⃣ **Create & Activate Virtual Environment:**  
```sh  
python -m venv venv  
source venv/bin/activate   # For macOS/Linux  
venv\Scripts\activate    # For Windows  
```  

3️⃣ **Install Dependencies:**  
```sh  
pip install -r requirements.txt  
```  

4️⃣ **Set Up API Keys (Gemini API):**  
Create a `.env` file and add your Gemini API Key:  
```env  
GEMINI_API_KEY=your_api_key_here  
```  

5️⃣ **Run the Application:**  
**Backend:**
```sh  
python app.py
```  
Access EduNexa backend at **[http://127.0.0.1:5000/](http://127.0.0.1:5000/)**  

**Frontend:**
```
cd frontend
npm install
npm run dev
```
Access EduNexa frontend at **[http://localhost:5173/](http://localhost:5173/)**  

## ⚠️ Caution  

### 🚨 Firebase Configuration Required  
> ⚠️ Firebase Configuration Required: Add your Firebase credentials in `firebase.js` file to enable authentication and database services.  
> ⚠️ Get your Firebase configurations from [**Firebase Console**](https://firebase.google.com/) before running the application.
>
>**Showcase:** 
```sh
const firebaseConfig = {
  apiKey: you_api_key,
  authDomain: your_authDomain,
  projectId: your_projectId,
  storageBucket: your_storageBucket,
  messagingSenderId: your_messagingSenderId,
  appId: your_appId,
  measurementId: your_measurementId,
};
```

### 🔑 Gemini API Key Setup  
> ⚠️ Please add your Gemini API key in the `.env` file before running the application.
> 
> **Showcase:**  
``` .env 
GEMINI_API_KEY=your_api_key_here
``` 

---

## 🤝 Contributing  
Want to contribute? 🎉 Fork the repo, make your improvements, and submit a PR!  

- **🐞 Report Bugs** – Found an issue? Let us know!  
- **💡 Feature Requests** – Have an idea? We'd love to hear it!  

## 🔗 Connect with us  
* [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/tulu-g559)  
* [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/tulug559/)  
* [![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:ayonpaul8906@gmail.com)**ayonpaul8906@gmail.com**
