// Modal Module: Controls dialog, history panel, rendering
import { showMessage, copyToClipboard, loadFromStorage, saveToStorage, STORAGE_KEYS } from './utils.js';

const resultContainer = document.getElementById('resultContainer');
const historyPanel = document.getElementById('historyPanel');
const historyList = document.getElementById('historyList');
let localHistory = loadFromStorage(STORAGE_KEYS.HISTORY, []);

export function openModal() {
    document.getElementById('resultsModal').showModal();
    resultContainer.innerHTML = '';  // Clear for new session
}

export function closeModal() {
    document.getElementById('resultsModal').close();
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
}

export function toggleHistory() {
    historyPanel.hidden = !historyPanel.hidden;
    if (!historyPanel.hidden) renderHistory();
}

function renderHistory() {
    historyList.innerHTML = localHistory.slice(-50).reverse().map((item, idx) => `
        <li class="history-item" tabindex="0" role="button">
            <div class="history-item-content">
                <div class="history-item-text">
                    <p>${item.query.slice(0, 50)}...</p>
                    <small>${new Date(item.timestamp).toLocaleTimeString()}</small>
                </div>
                <button class="copy-query-btn" aria-label="Copy Query">📋</button>
            </div>
        </li>
    `).join('');
    // Add event listeners for copy/load
    historyList.querySelectorAll('.copy-query-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const query = e.target.closest('.history-item').querySelector('p').textContent;
            copyToClipboard(query);
        });
    });
}

export function addToHistory(query, answer, confidence) {
    localHistory.push({ query, answer, confidence, timestamp: Date.now() });
    saveToStorage(STORAGE_KEYS.HISTORY, localHistory);
    if (historyPanel.hidden) return;  // Lazy render
    renderHistory();
}

export function renderResult(data) {
    const { answer, confidence, source } = data;
    const html = marked.parse(answer || 'No response.');
    const block = `
        <section class="conversation-block" aria-labelledby="res-${Date.now()}">
            <h4 id="res-${Date.now()}">Result: ${source} [${confidence}%]</h4>
            <div class="content">${html}</div>
        </section>
    `;
    resultContainer.insertAdjacentHTML('beforeend', block);
    resultContainer.scrollTop = resultContainer.scrollHeight;
    addToHistory(lastQuery, answer, confidence);  // Global lastQuery from query.js
}

export function showLoading(query) {
    const id = `loading-${Date.now()}`;
    resultContainer.insertAdjacentHTML('beforeend', `
        <section class="conversation-block" id="${id}">
            <h4>${query}</h4>
            <div class="content"><span class="loading" aria-label="Loading"></span> Scanning...</div>
        </section>
    `);
    resultContainer.scrollTop = resultContainer.scrollHeight;
    return id;
}

export function removeLoading(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// Event Listeners (Attached in app.js)
export function initModalListeners() {
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('resultsModal').addEventListener('close', () => document.body.style.overflow = 'auto');
    document.getElementById('clearHistoryBtn').addEventListener('click', () => {
        localHistory = [];
        saveToStorage(STORAGE_KEYS.HISTORY, []);
        renderHistory();
        showMessage('History cleared.');
    });
    // ... (TTS, follow-up stubs)
}