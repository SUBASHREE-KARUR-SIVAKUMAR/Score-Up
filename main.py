import os
import json
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

app = Flask(__name__)
# Aggressive CORS for local testing
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# --- API KEY CHECK ---
api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    print("❌ ERROR: GROQ_API_KEY not found! Check your .env file.")
else:
    print("✅ Groq API Key loaded successfully!")

# Setup Groq Client
client = Groq(api_key=api_key)

@app.route('/generate_question', methods=['POST'])
def generate_question():
    try:
        data = request.get_json(silent=True)
        topic = data.get('topic', 'General Knowledge')
        num = int(data.get('num_questions', 1))
        diff = data.get('difficulty', 'Intermediate')

        print(f"🧠 Groq is thinking about {topic}...")

        prompt = f"""
        Task: Generate {num} unique, deep conceptual study questions about {topic} at {diff} difficulty. 
        Constraints:
        - Focus on 'how' and 'why' logic. 
        - No multiple choice.
        - Return ONLY a valid JSON object with a key "questions" containing a list of strings.
        
        Example Format:
        {{
            "questions": ["Question 1", "Question 2"]
        }}
        """

        # UPDATED MODEL NAME HERE
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        
        return completion.choices[0].message.content
    
    except Exception as e:
        print(f"❌ Gen Error: {str(e)}")
        return jsonify({"error": f"AI Brain Snag: {str(e)}"}), 500

@app.route('/evaluate_answer', methods=['POST'])
def evaluate_answer():
    try:
        data = request.get_json(silent=True)
        question = data.get('question')
        student_answer = data.get('student_answer')
        topic = data.get('topic', 'General Knowledge')
        user_name = data.get('name', 'Subashree')

        print(f"📝 Evaluating {user_name}'s answer...")

        prompt = f"""
        You are a friendly AI study companion named ScoreUp.
        User: {user_name}
        Topic: {topic}
        Question: {question}
        Student's Answer: {student_answer}

        Task:
        1. Evaluate if the answer is factually correct. Be smart—if they say "idk" or give nonsense, it's False.
        2. Provide a 1-sentence friendly critique to {user_name}.
        3. Provide a concise 'Ideal Explanation' (max 2 sentences).

        Return ONLY a JSON object:
        {{
            "is_correct": boolean,
            "ai_feedback": "string",
            "ideal_answer": "string"
        }}
        """

        # UPDATED MODEL NAME HERE
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        
        return completion.choices[0].message.content
    
    except Exception as e:
        print(f"❌ Eval Error: {str(e)}")
        return jsonify({"error": "Evaluation failed"}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
