// src/lib/local-storage-utils.js
// This file is not directly used by the useChallengeData hook anymore,
// but it's kept here for completeness if other parts of your app might use it.
// The logic for localStorage interaction is now primarily within useChallengeData.

// Example functions if you were to use them externally:
export const loadFromLocalStorage = (key) => {
    if (typeof window === 'undefined') return null;
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error(`Error loading from localStorage key "${key}":`, e);
        return null;
    }
};

export const saveToLocalStorage = (key, data) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`Error saving to localStorage key "${key}":`, e);
    }
};

export const removeFromLocalStorage = (key) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.error(`Error removing from localStorage key "${key}":`, e);
    }
};