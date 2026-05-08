document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;

    // --- USER SPECIFIC LOADING ---
    const history = loadFromLocalStorage(STORAGE_KEYS.PRACTICE_HISTORY, []);
    
    const totalQuestions = history.length;
    const correctAnswers = history.filter(item => item.isCorrect).length;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    document.getElementById('totalQuestionsStat').textContent = totalQuestions;
    document.getElementById('correctAnswersStat').textContent = `${accuracy}%`;

    // Chart logic (stays the same, but now uses the filtered user history)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = Array(7).fill(0);
    const labels = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        labels.push(days[d.getDay()]);
        const dateString = d.toLocaleDateString();
        const count = history.filter(item => new Date(item.timestamp).toLocaleDateString() === dateString).length;
        last7Days[6-i] = count;
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: last7Days,
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } } }
        }
    });

    // Weakest Topic Logic
    const topicStats = {};
    history.forEach(item => {
        if (!topicStats[item.topic]) topicStats[item.topic] = { total: 0, correct: 0 };
        topicStats[item.topic].total++;
        if (item.isCorrect) topicStats[item.topic].correct++;
    });

    let weakest = "N/A";
    let minRate = 101;
    for (const t in topicStats) {
        const rate = (topicStats[t].correct / topicStats[t].total) * 100;
        if (rate < minRate) {
            minRate = rate;
            weakest = t;
        }
    }
    document.getElementById('weakestTopicName').textContent = weakest;
});
