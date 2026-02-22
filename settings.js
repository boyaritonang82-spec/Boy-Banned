// Settings handler untuk BOY B NYA BANNED

const Settings = {
    init() {
        this.loadTheme();
        this.loadAccent();
    },

    loadTheme() {
        const isDark = localStorage.getItem('darkMode') !== 'false';
        const checkbox = document.getElementById('dark-mode');
        if (checkbox) checkbox.checked = isDark;
        
        const themeLink = document.getElementById('theme-style');
        if (themeLink) themeLink.disabled = isDark;
    },

    loadAccent() {
        const accent = localStorage.getItem('accent') || '#ff0040';
        document.documentElement.style.setProperty('--primary', accent);
    }
};

// Init saat load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Settings.init());
} else {
    Settings.init();
}
