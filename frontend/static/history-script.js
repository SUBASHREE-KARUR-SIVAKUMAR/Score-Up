document.addEventListener('DOMContentLoaded', () => {
    const historyList = document.getElementById('historyList');
    
    // --- USER SPECIFIC LOADING ---
    const history = loadFromLocalStorage(STORAGE_KEYS.PRACTICE_HISTORY, []);

    function renderHistory() {
        if (!historyList) return;
        historyList.innerHTML = '';

        if (history.length === 0) {
            historyList.innerHTML = '<div class="card glass-card" style="text-align:center">No history yet! Start practicing to see your sessions here.</div>';
            return;
        }

        [...history].reverse().forEach((item, index) => {
            const card = document.createElement('div');
            const realIndex = history.length - 1 - index;
            card.className = `history-item ${item.isCorrect ? 'correct' : 'incorrect'}`;
            
            card.innerHTML = `
                <div class="history-card-header">
                    <span class="topic-tag">${item.topic || 'General'}</span>
                    <span class="date-tag">${item.timestamp}</span>
                </div>
                <p class="history-question">${item.question}</p>
                <button class="chip active" onclick="viewDetails(${realIndex})">View Analysis</button>
            `;
            historyList.appendChild(card);
        });
    }

    window.viewDetails = (idx) => {
        const item = history[idx];
        const modal = document.getElementById('historyDetailModal');
        const content = document.getElementById('modalContent');
        const closeBtn = modal.querySelector('.close-button');
        
        content.innerHTML = `
            <h3 style="color: var(--accent); margin-bottom: 1rem;">Analysis</h3>
            <p style="margin-bottom: 1rem;"><strong>Your Answer:</strong> ${item.studentAnswer}</p>
            <div class="feedback-box" style="margin: 1rem 0; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 10px;">
                <strong>Critique:</strong>
                <p>${item.aiFeedback}</p>
            </div>
            <div class="correct-answer-box" style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: 10px;">
                <strong>Ideal Answer:</strong>
                <p>${item.correctAnswer}</p>
            </div>
        `;
        modal.classList.remove('hidden');

        if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
    };

    renderHistory();
});
