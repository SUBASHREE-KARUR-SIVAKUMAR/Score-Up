# ScoreUp: Your AI-Powered Adaptive Study Companion 🚀
ScoreUp is a sophisticated full-stack learning platform designed to transform how students master complex subjects. Move beyond passive reading with a tool that uses Active Recall and Semantic AI Evaluation to challenge your understanding.
🌐 Live Demo
Check out the live application here: https://score-up-hack.netlify.app

# 🌟 Key Features

Deep Conceptual Questioning: Powered by Llama 3.3 (via Groq), ScoreUp generates unique questions based on your specific topic and chosen difficulty (Easy, Intermediate, Hard). It avoids simple definitions and focuses on "how" and "why" logic.
AI Semantic Review: Unlike basic quizzes, our AI analyzes the logic of your typed explanations. It catches misconceptions, logical errors, and even spelling slips, acting as a personal 24/7 tutor.
Personalized Experience: A custom login system that greets you by name and creates a unique study environment.
User-Specific Stats: Using scoped LocalStorage, your progress, practice history, and accuracy rates are kept private and unique to your profile.
Visual Progress Tracking: A high-tech dashboard featuring Chart.js to visualize your weekly study activity and identify your "Focus Areas."
Modern Glassmorphism UI: A sleek, responsive dark-themed interface designed for a premium, distraction-free user experience.


# 🛠️ Tech Stack

Frontend: HTML5, Modern CSS3 (Glassmorphism, Flexbox, Grid), Vanilla JavaScript (ES6+)
Backend: Python, Flask, Flask-CORS
AI Engine: Groq Cloud API (Llama 3.3 70B Versatile)
Data Visualization: Chart.js
Environment Management: Dotenv (Security-first approach)


# 🚀 Local Setup
Prerequisites

Python 3.8+
A Groq API Key (Get one for free at console.groq.com)

Installation

Set up Virtual Environment:
python -m venv venv
source venv/bin/activate  # Mac/Linux
(or)
venv\Scripts\activate  # Windows



Install Dependencies:
pip install -r requirements.txt



Environment Variables:
Create a .env file in the root folder:
GROQ_API_KEY=your_groq_api_key_here



Run the App:

Start the backend: python main.py
Start the frontend: Open index.html with Live Server in VS Code.




# 🛡️ Security
This project is configured with a .gitignore to ensure that sensitive data like .env and bulky folders like venv/ are never pushed to the public repository.

# 🏆 Recognition
*   **DATASET Edition 2 Hackathon:** This project was developed and presented during the DATASET Edition 2 Hackathon organized by VIT Chennai (Dec 2025).

Developed with ❤️ by Subashree
Connect with me on [LinkedIn](https://www.linkedin.com/in/subashree-karur-sivakumar/)
