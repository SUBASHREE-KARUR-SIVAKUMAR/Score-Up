document.addEventListener('DOMContentLoaded', () => {
    const topicInput = document.getElementById('topicInput');
    const numQuestionsInput = document.getElementById('numQuestionsInput');
    const generateBtn = document.getElementById('generateBtn');
    const aiLoader = document.getElementById('aiLoader');
    
    const generatorSection = document.getElementById('question-generator');
    const selectionArea = document.getElementById('question-selection-area');
    const questionListItems = document.getElementById('questionListItems');
    
    const answerArea = document.getElementById('question-answer-area');
    const questionText = document.querySelector('.question-text');
    const answerInput = document.getElementById('answerInput');
    const submitAnswerBtn = document.getElementById('submitAnswerBtn');
    
    const feedbackDisplay = document.getElementById('feedbackDisplay');
    const statusText = document.querySelector('.status-text');
    const feedbackContent = document.querySelector('.feedback-content');
    const correctAnswerBox = document.querySelector('.correct-answer-box');
    const correctText = document.querySelector('.correct-text');

    let currentQuestion = null;
    let questionsPool = [];
    let currentActiveTopic = ""; 

    // --- INITIALIZATION ---
    // We still get the name directly to know WHICH user's data to load
    const savedName = localStorage.getItem('scoreup_user_name') || 'Student';
    if (document.getElementById('userName')) {
        document.getElementById('userName').textContent = savedName;
    }

    generateBtn.addEventListener('click', async () => {
        const topic = topicInput.value.trim();
        const num = numQuestionsInput.value;
        const difficulty = document.querySelector('.chip.active')?.dataset.level || 'Intermediate';

        if (!topic) {
            showCustomAlert(`Hey ${savedName}! You forgot to enter a topic. What are we studying today?`);
            return;
        }

        generateBtn.disabled = true;
        if (aiLoader) aiLoader.classList.remove('hidden');

        try {
            const response = await fetch('https://score-up-backend.onrender.com/generate_question', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, num_questions: parseInt(num), difficulty })
            });

            const data = await response.json();

            if (data.questions && data.questions.length > 0) {
                questionsPool = data.questions;
                currentActiveTopic = topic; 
                renderQuestionList();
                generatorSection.classList.add('hidden');
                selectionArea.classList.remove('hidden');
            } else {
                showCustomAlert("The AI couldn't generate questions. Try a different topic!");
            }
        } catch (error) {
            showCustomAlert(`Sorry ${savedName}, I can't reach the AI brain. Check if the server is live!`);
        } finally {
            generateBtn.disabled = false;
            if (aiLoader) aiLoader.classList.add('hidden');
        }
    });

    function renderQuestionList() {
        questionListItems.innerHTML = '';
        questionsPool.forEach((q, index) => {
            const item = document.createElement('div');
            item.className = 'q-item';
            item.innerHTML = `
                <div class="q-number" style="font-weight: 800; color: var(--accent); margin-bottom: 5px;">Question ${index + 1}</div>
                <p style="color: white; font-weight: 500;">${q}</p>
            `;
            item.onclick = () => startQuestion(q);
            questionListItems.appendChild(item);
        });
    }

    function startQuestion(q) {
        currentQuestion = q;
        questionText.textContent = q;
        answerInput.value = '';
        feedbackDisplay.classList.add('hidden');
        answerArea.classList.remove('hidden');
        answerInput.focus();
        answerArea.scrollIntoView({ behavior: 'smooth' });
    }

    submitAnswerBtn.addEventListener('click', async () => {
        const answer = answerInput.value.trim();
        if (!answer) return;

        submitAnswerBtn.disabled = true;
        submitAnswerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';

        try {
            const response = await fetch('http://127.0.0.1:5000/evaluate_answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    question: currentQuestion, 
                    student_answer: answer,
                    name: savedName,
                    topic: currentActiveTopic
                })
            });

            const result = await response.json();

            if (result.is_correct) {
                statusText.textContent = "Great Job! 🎉";
                statusText.style.color = "var(--success)";
            } else {
                statusText.textContent = "Not Quite! 🤔";
                statusText.style.color = "var(--error)";
            }
            
            feedbackContent.innerHTML = `<strong>My Critique:</strong> <p>${result.ai_feedback}</p>`;
            correctText.textContent = result.ideal_answer;
            correctAnswerBox.classList.remove('hidden');
            feedbackDisplay.classList.remove('hidden');
            
            // --- USER SPECIFIC SAVING ---
            const history = loadFromLocalStorage(STORAGE_KEYS.PRACTICE_HISTORY, []);
            history.push({
                question: currentQuestion,
                studentAnswer: answer,
                aiFeedback: result.ai_feedback,
                isCorrect: result.is_correct,
                correctAnswer: result.ideal_answer,
                timestamp: new Date().toLocaleString(),
                topic: currentActiveTopic
            });
            saveToLocalStorage(STORAGE_KEYS.PRACTICE_HISTORY, history);

        } catch (error) {
            showCustomAlert("Error evaluating answer.");
        } finally {
            submitAnswerBtn.disabled = false;
            submitAnswerBtn.innerHTML = 'Submit for Review';
        }
    });

    const resetBtn = document.getElementById('resetDataBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm("Are you sure? This will wipe YOUR practice history!")) {
                clearUserLocalStorage();
                window.location.reload();
            }
        });
    }
});
