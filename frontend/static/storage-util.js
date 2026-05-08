// static/storage-util.js

// This function creates a unique key like "Suba_practice_history"
function getStorageKey(baseKey) {
    const userName = localStorage.getItem('scoreup_user_name') || 'default';
    return `${userName}_${baseKey}`;
}

const STORAGE_KEYS = {
    PRACTICE_HISTORY: 'practice_history',
    QUESTION_COUNT: 'question_count',
    CORRECT_COUNT: 'correct_count'
};

function saveToLocalStorage(key, data) {
    localStorage.setItem(getStorageKey(key), JSON.stringify(data));
}

function loadFromLocalStorage(key, defaultValue) {
    const data = localStorage.getItem(getStorageKey(key));
    return data ? JSON.parse(data) : defaultValue;
}

function clearUserLocalStorage() {
    const userName = localStorage.getItem('scoreup_user_name');
    if (userName) {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(`${userName}_${key}`);
        });
    }
}

// Global Alert
function showCustomAlert(message) {
    const modal = document.getElementById('customAlertModal');
    const msgContainer = document.getElementById('customAlertMessage');
    if (!modal || !msgContainer) return;

    msgContainer.textContent = message;
    modal.classList.remove('hidden');

    const okBtn = modal.querySelector('.modal-ok-btn');
    const closeModal = () => modal.classList.add('hidden');
    if (okBtn) okBtn.onclick = closeModal;
}
