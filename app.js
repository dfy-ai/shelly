// App: Bootstraps modules, event bus
import { initModalListeners, toggleHistory } from './modules/modal.js';
import { initQueryListeners } from './modules/query.js';
import { initAudio } from './modules/audio.js';  // Lazy if needed
import { loadFromStorage, saveToStorage, STORAGE_KEYS, on, emit } from './modules/utils.js';
import { setMode } from './modules/query.js';  // Reuse for themes

// Boot
document.addEventListener('DOMContentLoaded', async () => {
    // Init
    const body = document.body;
    const savedTheme = loadFromStorage(STORAGE_KEYS.THEME, 'silvery');
    body.dataset.mode = savedTheme;
    setMode(savedTheme);  // Query mode too? Nah, separate.

    const queryInput = document.getElementById('queryInput');
    initQueryListeners(queryInput);
    initModalListeners();

    // Theme Toggles
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            body.dataset.mode = mode;
            saveToStorage(STORAGE_KEYS.THEME, mode);
            showMessage(`Theme: ${mode}`);
        });
    });

    // History Toggle
    document.getElementById('historyToggle').addEventListener('click', toggleHistory);

    // Global Events (e.g., for backend hooks)
    on('backend:response', (e) => renderResult(e.detail));  // Example integration

    // Typing Animation
    const typedText = document.getElementById('typedText');
    setTimeout(() => typedText.classList.add('is-typing'), 500);
    setTimeout(() => typedText.classList.add('is-done'), 4000);

    // Lazy Audio Init
    document.getElementById('ttsBtn').addEventListener('click', initAudio);

    console.log('Truth Shell Booted - SoC Optimized 🚀');
});