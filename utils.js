// Utils: Storage, Messages, etc.
export const STORAGE_KEYS = {
    THEME: 'truth-theme',
    HISTORY: 'truth-history'
};

export function showMessage(msg, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), duration);
}

export function copyToClipboard(text, msg = 'Copied!') {
    navigator.clipboard.writeText(text).then(() => showMessage(msg));
}

export function loadFromStorage(key, defaultVal = null) {
    try {
        return JSON.parse(localStorage.getItem(key)) || defaultVal;
    } catch {
        return defaultVal;
    }
}

export function saveToStorage(key, val) {
    try {
        localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
        console.warn('Storage failed:', e);
    }
}

export function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

export function emit(event, data) {
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
}

export function on(event, handler) {
    window.addEventListener(event, handler);
}