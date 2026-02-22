// BOY B NYA BANNED - Main App
// Fix stuck splash screen

(function() {
    'use strict';
    
    // Prevent error kalau localStorage ga bisa (Android WebView restrictions)
    const storage = {
        get: (key, def) => {
            try { return localStorage.getItem(key) || def; } 
            catch(e) { return def; }
        },
        set: (key, val) => {
            try { localStorage.setItem(key, val); } 
            catch(e) {}
        }
    };

    // Loading texts
    const loadingTexts = [
        "Initializing system...",
        "Loading modules...",
        "Connecting to server...",
        "Verifying license...",
        "Preparing interface...",
        "Ready to launch..."
    ];

    let currentText = 0;
    let progress = 0;

    // Init app
    function init() {
        updateLoading();
        
        // Simulate loading
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            updateLoading();
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(showApp, 500);
            }
        }, 200);
    }

    function updateLoading() {
        const percentEl = document.getElementById('loading-percent');
        const textEl = document.getElementById('loading-status');
        
        if (percentEl) percentEl.textContent = Math.floor(progress) + '%';
        
        // Update text berdasarkan progress
        const textIndex = Math.floor((progress / 100) * loadingTexts.length);
        if (textEl && textIndex !== currentText && textIndex < loadingTexts.length) {
            currentText = textIndex;
            textEl.textContent = loadingTexts[currentText];
        }
        
        // Update circle animation
        const circles = document.querySelectorAll('.loading-ring');
        circles.forEach((circle, i) => {
            circle.style.opacity = progress > (i * 20) ? '1' : '0.3';
        });
    }

    function showApp() {
        const splash = document.getElementById('splash-screen');
        const app = document.getElementById('app');
        
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
                if (app) app.style.display = 'block';
                loadStats();
            }, 600);
        }
    }

    function loadStats() {
        const bans = storage.get('totalBans', '0');
        const unbans = storage.get('totalUnbans', '0');
        
        const bansEl = document.getElementById('total-bans');
        const unbansEl = document.getElementById('total-unbans');
        
        if (bansEl) bansEl.textContent = bans;
        if (unbansEl) unbansEl.textContent = unbans;
    }

    // Toggle sidebar
    window.toggleSidebar = function() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar && overlay) {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }
    };

    // Toggle theme
    window.toggleTheme = function() {
        const isDark = document.getElementById('dark-mode')?.checked ?? true;
        storage.set('darkMode', isDark);
        
        const themeLink = document.getElementById('theme-style');
        if (themeLink) {
            themeLink.disabled = isDark;
        }
        
        showToast(isDark ? 'Dark mode aktif' : 'Light mode aktif');
    };

    // Set accent color
    window.setAccent = function(color) {
        document.documentElement.style.setProperty('--primary', color);
        storage.set('accent', color);
        
        document.querySelectorAll('.color-option').forEach(opt => {
            opt.classList.remove('active');
        });
        if (event && event.target) {
            event.target.classList.add('active');
        }
    };

    // Change avatar
    window.changeAvatar = function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    const avatar = document.getElementById('user-avatar');
                    if (avatar) {
                        avatar.src = evt.target.result;
                        storage.set('avatar', evt.target.result);
                    }
                    showToast('Foto profil diupdate');
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    // Modal functions
    window.openBanTools = function() {
        const modal = document.getElementById('ban-modal');
        if (modal) modal.classList.add('active');
    };

    window.closeModal = function(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.remove('active');
    };

    // Tool selection
    window.selectTool = function(tool) {
        const toolsList = document.getElementById('tools-list');
        const toolConfig = document.getElementById('tool-config');
        const title = document.getElementById('config-title');
        
        const titles = {
            'spam': 'Spam Report',
            'abuse': 'Abuse Report',
            'mass': 'Mass Reporting',
            'fake': 'Fake News Report',
            'scam': 'Scam Report',
            'child': 'Child Abuse Report',
            'hack': 'Hacking Report',
            'illegal': 'Illegal Content Report'
        };
        
        if (toolsList) toolsList.style.display = 'none';
        if (toolConfig) {
            toolConfig.style.display = 'block';
            toolConfig.dataset.tool = tool;
        }
        if (title) title.textContent = titles[tool] || 'Konfigurasi';
    };

    window.backToTools = function() {
        const toolsList = document.getElementById('tools-list');
        const toolConfig = document.getElementById('tool-config');
        
        if (toolsList) toolsList.style.display = 'block';
        if (toolConfig) toolConfig.style.display = 'none';
    };

    // Adjust count
    window.adjustCount = function(delta) {
        const input = document.getElementById('report-count');
        if (input) {
            let val = parseInt(input.value) || 0;
            val += delta;
            if (val < 1) val = 1;
            if (val > 1000) val = 1000;
            input.value = val;
        }
    };

    // Set proxy
    window.setProxy = function(type) {
        document.querySelectorAll('.proxy-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (event && event.target) {
            event.target.classList.add('active');
        }
    };

    // Start attack
    window.startAttack = function() {
        const toolConfig = document.getElementById('tool-config');
        const progressPanel = document.getElementById('progress-panel');
        
        if (toolConfig) toolConfig.style.display = 'none';
        if (progressPanel) progressPanel.style.display = 'block';
        
        simulateAttack();
    };

    function simulateAttack() {
        const count = parseInt(document.getElementById('report-count')?.value) || 100;
        let current = 0;
        let success = 0;
        let failed = 0;
        
        const interval = setInterval(() => {
            current++;
            const isSuccess = Math.random() > 0.15;
            if (isSuccess) success++;
            else failed++;
            
            updateProgress(current, count, success, failed);
            addLog(`Report #${current} - ${isSuccess ? 'SUCCESS' : 'FAILED'}`, isSuccess ? 'success' : 'error');
            
            if (current >= count) {
                clearInterval(interval);
                addLog('Attack completed!', 'success');
                
                // Save stats
                const currentBans = parseInt(storage.get('totalBans', '0'));
                storage.set('totalBans', currentBans + success);
                
                setTimeout(() => {
                    showToast(`Attack selesai! ${success} sukses`);
                }, 500);
            }
        }, 100);
    }

    function updateProgress(current, total, success, failed) {
        const percent = Math.round((current / total) * 100);
        const circle = document.getElementById('progress-circle');
        const percentEl = document.getElementById('progress-percent');
        
        if (circle) {
            const offset = 339.292 - (339.292 * percent / 100);
            circle.style.strokeDashoffset = offset;
        }
        if (percentEl) percentEl.textContent = percent + '%';
        
        const successEl = document.getElementById('stat-success');
        const failedEl = document.getElementById('stat-failed');
        const remainingEl = document.getElementById('stat-remaining');
        
        if (successEl) successEl.textContent = success;
        if (failedEl) failedEl.textContent = failed;
        if (remainingEl) remainingEl.textContent = total - current;
    }

    function addLog(message, type) {
        const container = document.getElementById('logs-container');
        if (container) {
            const entry = document.createElement('div');
            entry.className = `log-entry log-${type}`;
            entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            container.appendChild(entry);
            container.scrollTop = container.scrollHeight;
        }
    }

    window.clearLogs = function() {
        const container = document.getElementById('logs-container');
        if (container) container.innerHTML = '';
    };

    window.stopAttack = function() {
        location.reload();
    };

    // Quick ban
    window.quickBan = function() {
        const number = document.getElementById('quick-number')?.value;
        const method = document.getElementById('quick-method')?.value;
        
        if (!number) {
            showToast('Masukkan nomor target!', 'error');
            return;
        }
        
        showToast(`Quick ${method} ke ${number} dimulai`);
    };

    // Toast
    window.showToast = function(message, type) {
        const toast = document.getElementById('toast');
        const msgEl = document.getElementById('toast-msg');
        
        if (toast && msgEl) {
            msgEl.textContent = message;
            toast.className = 'toast show ' + (type || '');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    };

    // Settings
    window.changeServer = function(region) {
        showToast(`Server: ${region.toUpperCase()}`);
    };

    window.resetSettings = function() {
        try { localStorage.clear(); } catch(e) {}
        showToast('Settings direset');
        setTimeout(() => location.reload(), 1000);
    };

    // Dummy functions
    window.openUnbanTools = function() {
        showToast('Unban Tools - Coming Soon');
    };

    window.openHistory = function() {
        showToast('History - Coming Soon');
    };

    window.openTutorial = function() {
        showToast('Tutorial - Coming Soon');
    };

    // Load saved avatar
    window.addEventListener('load', function() {
        const savedAvatar = storage.get('avatar');
        if (savedAvatar) {
            const avatar = document.getElementById('user-avatar');
            if (avatar) avatar.src = savedAvatar;
        }
        
        // Start init
        init();
    });

})();
