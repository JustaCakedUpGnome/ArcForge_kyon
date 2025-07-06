// Global Search System for ARCFORGE
class SearchSystem {
    constructor() {
        this.searchIndex = null;
        this.currentMatches = [];
        this.currentMatchIndex = -1;
        this.isSearchMode = false;
        this.isPaletteOpen = false;
        this.searchQuery = '';
        
        this.init();
    }

    async init() {
        await this.buildSearchIndex();
        this.bindEvents();
        this.injectSearchStyles();
    }

    // Build searchable content index
    async buildSearchIndex() {
        this.searchIndex = {
            // Foundation content
            'motivation-and-identity': {
                title: 'Why Do You Want the Muscles?',
                url: '/pages/foundation/motivation-and-identity.html',
                content: 'motivation identity training mindset why muscles self-filtering intro',
                category: 'foundation'
            },
            'muscle-fiber-primer': {
                title: 'Muscle Fibers & Nervous System Primer', 
                url: '/pages/foundation/muscle-fiber-primer.html',
                content: 'muscle fiber type I type II recruitment CNS fatigue nervous system primer',
                category: 'foundation'
            },
            'training-philosophy': {
                title: 'Training Philosophy & Structural Realism',
                url: '/pages/foundation/training-philosophy.html', 
                content: 'philosophy structural realism genetics leverages exercise selection calisthenics weights',
                category: 'foundation'
            },
            'myths-and-qa': {
                title: 'Training Myths & Reader Misfires',
                url: '/pages/foundation/myths-and-qa.html',
                content: 'myths misconceptions debunking logic fallacies reader misfires Q&A',
                category: 'foundation'
            },
            
            // Methodology content
            'heavy-duty-principles': {
                title: 'Heavy Duty Principles',
                url: '/pages/methodology/heavy-duty-principles.html',
                content: 'heavy duty mike mentzer intensity failure progressive overload',
                category: 'methodology'
            },
            'goto-split': {
                title: 'Goto Split Routine',
                url: '/pages/methodology/goto-split.html', 
                content: 'goto split routine workout back shoulders chest legs recovery 8-9 day cycle',
                category: 'methodology'
            },
            'progression-protocols': {
                title: 'Progression Protocols',
                url: '/pages/methodology/progression-protocols.html',
                content: 'progression protocols strength size advancement autoregulation recovery indicators',
                category: 'methodology'
            },
            
            // Advanced content (premium)
            'recovery-guide': {
                title: 'The Recovery Guide',
                url: '/pages/advanced/recovery-guide.html',
                content: 'recovery CNS fatigue local muscle fatigue rest optimization sleep premium',
                category: 'advanced',
                premium: true
            },
            
            // Navigation
            'navigation': {
                title: 'Navigation & Terminal Interface',
                url: '/pages/navigation/index.html',
                content: 'navigation terminal interface command palette search keyboard shortcuts keybinds',
                category: 'navigation'
            },
            
            // Forum content
            'forum': {
                title: 'Heavy Duty Forum',
                url: '/pages/forum/forum.html',
                content: 'forum community discussions training methodology progress logs questions',
                category: 'forum'
            }
        };
    }

    // Keyboard event handling
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            // Command Palette: Ctrl+K or Cmd+K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openCommandPalette();
                return;
            }

            // Page Search: /
            if (e.key === '/' && !this.isInputActive()) {
                e.preventDefault();
                this.openPageSearch();
                return;
            }

            // Search navigation: n/N 
            if (this.isSearchMode && this.currentMatches.length > 0) {
                if (e.key === 'n' && !e.shiftKey) {
                    e.preventDefault();
                    this.nextMatch();
                    return;
                }
                if (e.key === 'N' && e.shiftKey) {
                    e.preventDefault();
                    this.previousMatch();
                    return;
                }
            }

            // Escape to close
            if (e.key === 'Escape') {
                this.closeAll();
                return;
            }
        });
    }

    // Check if user is typing in an input field
    isInputActive() {
        const activeElement = document.activeElement;
        return activeElement && (
            activeElement.tagName === 'INPUT' || 
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.contentEditable === 'true'
        );
    }

    // Open command palette
    openCommandPalette() {
        this.closePageSearch();
        this.isPaletteOpen = true;
        
        // Create or show command palette
        let palette = document.getElementById('global-command-palette');
        if (!palette) {
            palette = this.createCommandPalette();
            document.body.appendChild(palette);
        }
        
        palette.classList.remove('hidden');
        const input = palette.querySelector('.palette-input');
        input.focus();
        input.value = '';
        
        this.updatePaletteResults('');
    }

    // Create command palette DOM
    createCommandPalette() {
        const palette = document.createElement('div');
        palette.id = 'global-command-palette';
        palette.className = 'command-palette hidden';
        
        palette.innerHTML = `
            <div class="palette-overlay"></div>
            <div class="palette-container">
                <div class="palette-header">
                    <span class="palette-prompt">arcforge@fortress:~$</span>
                    <input type="text" class="palette-input" placeholder="Type a command or search...">
                    <button class="palette-close">×</button>
                </div>
                <div class="palette-results">
                    <div class="result-section">
                        <div class="section-title">Quick Actions</div>
                        <div class="quick-actions"></div>
                    </div>
                    <div class="result-section">
                        <div class="section-title">Search Results</div>
                        <div class="search-results"></div>
                    </div>
                </div>
            </div>
        `;

        // Bind palette events
        const input = palette.querySelector('.palette-input');
        const closeBtn = palette.querySelector('.palette-close');
        const overlay = palette.querySelector('.palette-overlay');

        input.addEventListener('input', (e) => {
            this.updatePaletteResults(e.target.value);
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.executePaletteCommand(e.target.value);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigatePaletteResults('down');
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigatePaletteResults('up');
            }
        });

        closeBtn.addEventListener('click', () => this.closeCommandPalette());
        overlay.addEventListener('click', () => this.closeCommandPalette());

        return palette;
    }

    // Update command palette results
    updatePaletteResults(query) {
        const palette = document.getElementById('global-command-palette');
        const quickActions = palette.querySelector('.quick-actions');
        const searchResults = palette.querySelector('.search-results');

        // Quick actions
        const actions = [
            { icon: '🏠', text: 'Go to Home', command: ':goto home' },
            { icon: '📚', text: 'Browse Foundation', command: ':goto foundation' },
            { icon: '⚡', text: 'View Methodology', command: ':goto methodology' },
            { icon: '🔒', text: 'Premium Content', command: ':goto advanced' },
            { icon: '⬇️', text: 'Download Goto Split', command: ':download goto' },
            { icon: '⌨️', text: 'Show Keybinds', command: ':help' }
        ];

        quickActions.innerHTML = actions.map(action => `
            <div class="result-item" data-command="${action.command}">
                <span class="result-icon">${action.icon}</span>
                <span class="result-text">${action.text}</span>
                <span class="result-shortcut">${action.command}</span>
            </div>
        `).join('');

        // Search results
        if (query.length > 1) {
            const results = this.searchContent(query);
            searchResults.innerHTML = results.map(result => `
                <div class="result-item" data-url="${result.url}">
                    <span class="result-icon">${this.getCategoryIcon(result.category)}</span>
                    <span class="result-text">${result.title}</span>
                    <span class="result-category">${result.category}${result.premium ? ' 🔒' : ''}</span>
                </div>
            `).join('');
        } else {
            searchResults.innerHTML = '<div class="no-results">Start typing to search...</div>';
        }

        // Add click handlers
        palette.querySelectorAll('.result-item').forEach(item => {
            item.addEventListener('click', () => {
                const command = item.dataset.command;
                const url = item.dataset.url;
                
                if (command) {
                    this.executePaletteCommand(command);
                } else if (url) {
                    window.location.href = url;
                    this.closeCommandPalette();
                }
            });
        });
    }

    // Search through content index
    searchContent(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();

        for (const [key, item] of Object.entries(this.searchIndex)) {
            const titleMatch = item.title.toLowerCase().includes(lowerQuery);
            const contentMatch = item.content.toLowerCase().includes(lowerQuery);
            
            if (titleMatch || contentMatch) {
                results.push({
                    ...item,
                    score: titleMatch ? 10 : 1
                });
            }
        }

        return results.sort((a, b) => b.score - a.score);
    }

    // Get category icon
    getCategoryIcon(category) {
        const icons = {
            foundation: '📖',
            methodology: '⚡',
            advanced: '🔒',
            navigation: '⌨️',
            forum: '💬'
        };
        return icons[category] || '📄';
    }

    // Execute command palette command
    executePaletteCommand(command) {
        const cmd = command.toLowerCase().trim();
        
        if (cmd.startsWith(':goto ') || cmd.startsWith('goto ')) {
            const page = cmd.replace(/^:?goto\s+/, '');
            this.navigateToPage(page);
        } else if (cmd === ':help' || cmd === 'help') {
            this.showHelp();
        } else if (cmd.startsWith(':download ') || cmd.startsWith('download ')) {
            const item = cmd.replace(/^:?download\s+/, '');
            this.downloadItem(item);
        } else if (cmd.startsWith(':search ') || cmd.startsWith('search ')) {
            const query = cmd.replace(/^:?search\s+/, '');
            this.performGlobalSearch(query);
        } else {
            // Treat as search query
            this.performGlobalSearch(cmd);
        }
        
        this.closeCommandPalette();
    }

    // Navigation
    navigateToPage(page) {
        const routes = {
            'home': '/',
            'foundation': '/pages/foundation/motivation-and-identity.html',
            'methodology': '/pages/methodology/heavy-duty-principles.html',
            'advanced': '/pages/advanced/recovery-guide.html',
            'navigation': '/pages/navigation/index.html',
            'forum': '/pages/forum/forum.html'
        };

        const url = routes[page];
        if (url) {
            // Handle relative paths based on current location
            const currentPath = window.location.pathname;
            let finalUrl = url;
            
            if (url.startsWith('/') && !currentPath.includes('/arcForgeSite/')) {
                finalUrl = url.substring(1); // Remove leading slash for relative
            } else if (url.startsWith('/')) {
                // Determine relative path based on current directory depth
                const depth = (currentPath.match(/\//g) || []).length - 1;
                const prefix = '../'.repeat(Math.max(0, depth - 1));
                finalUrl = prefix + url.substring(1);
            }
            
            window.location.href = finalUrl;
        } else {
            alert(`Page "${page}" not found. Try: ${Object.keys(routes).join(', ')}`);
        }
    }

    // Download item
    downloadItem(item) {
        alert(`Download for "${item}" not available yet.`);
    }

    // Show help
    showHelp() {
        alert(`ARCFORGE Command Reference:

Navigation:
:goto <page> - Navigate to page (home, foundation, methodology, advanced, navigation, forum)
:download <item> - Download content (goto)
:help - Show this help

Search:
/ - Search current page
Ctrl+K - Open command palette
:search <query> - Global search
n/N - Navigate search matches

Keyboard Shortcuts:
j/k - Navigate file tree
Shift+J - Expand all folders
ESC - Close search/commands`);
    }

    // Open page search
    openPageSearch() {
        this.closeCommandPalette();
        this.isSearchMode = true;
        
        let overlay = document.getElementById('page-search-overlay');
        if (!overlay) {
            overlay = this.createPageSearchOverlay();
            document.body.appendChild(overlay);
        }
        
        overlay.classList.remove('hidden');
        const input = overlay.querySelector('.search-input');
        input.focus();
        input.value = '';
    }

    // Create page search overlay
    createPageSearchOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'page-search-overlay';
        overlay.className = 'search-overlay hidden';
        
        overlay.innerHTML = `
            <div class="search-container">
                <div class="search-header">
                    <span class="search-prompt">/</span>
                    <input type="text" class="search-input" placeholder="search current page...">
                    <span class="search-help">ESC to exit • Enter to search • n/N to navigate</span>
                </div>
                <div class="search-status">
                    <span class="match-count"></span>
                </div>
            </div>
        `;

        const input = overlay.querySelector('.search-input');
        
        input.addEventListener('input', (e) => {
            this.performPageSearch(e.target.value);
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.performPageSearch(e.target.value);
            }
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closePageSearch();
            }
        });

        return overlay;
    }

    // Perform page search with highlighting
    performPageSearch(query) {
        this.clearSearchHighlights();
        this.currentMatches = [];
        this.currentMatchIndex = -1;
        
        if (!query || query.length < 2) {
            this.updateSearchStatus(0);
            return;
        }

        this.searchQuery = query;
        const content = document.querySelector('.terminal-content, .container, main, body');
        
        if (content) {
            this.highlightMatches(content, query);
            this.updateSearchStatus(this.currentMatches.length);
            
            if (this.currentMatches.length > 0) {
                this.currentMatchIndex = 0;
                this.scrollToMatch(0);
            }
        }
    }

    // Highlight search matches
    highlightMatches(container, query) {
        const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // Skip script/style tags and already highlighted content
                    const parent = node.parentElement;
                    if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE' || 
                        parent.classList.contains('search-highlight')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        
        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            if (regex.test(text)) {
                const highlightedHTML = text.replace(regex, 
                    `<mark class="search-highlight" data-match="${this.currentMatches.length}">$1</mark>`
                );
                
                const wrapper = document.createElement('span');
                wrapper.innerHTML = highlightedHTML;
                
                // Count matches in this node
                const matches = wrapper.querySelectorAll('.search-highlight');
                matches.forEach(() => {
                    this.currentMatches.push(wrapper);
                });
                
                textNode.parentNode.replaceChild(wrapper, textNode);
            }
        });
    }

    // Update search status
    updateSearchStatus(count) {
        const overlay = document.getElementById('page-search-overlay');
        if (overlay) {
            const matchCount = overlay.querySelector('.match-count');
            if (count === 0) {
                matchCount.textContent = this.searchQuery ? 'No matches found' : '';
            } else {
                matchCount.textContent = `${count} matches found`;
            }
        }
    }

    // Navigate to next match
    nextMatch() {
        if (this.currentMatches.length === 0) return;
        
        this.currentMatchIndex = (this.currentMatchIndex + 1) % this.currentMatches.length;
        this.scrollToMatch(this.currentMatchIndex);
    }

    // Navigate to previous match
    previousMatch() {
        if (this.currentMatches.length === 0) return;
        
        this.currentMatchIndex = this.currentMatchIndex <= 0 ? 
            this.currentMatches.length - 1 : this.currentMatchIndex - 1;
        this.scrollToMatch(this.currentMatchIndex);
    }

    // Scroll to specific match
    scrollToMatch(index) {
        if (index < 0 || index >= this.currentMatches.length) return;
        
        // Remove active class from all matches
        document.querySelectorAll('.search-highlight').forEach(el => {
            el.classList.remove('active-match');
        });
        
        // Add active class to current match
        const highlights = document.querySelectorAll('.search-highlight');
        if (highlights[index]) {
            highlights[index].classList.add('active-match');
            highlights[index].scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Update status
            this.updateSearchStatus(`${index + 1}/${this.currentMatches.length} matches`);
        }
    }

    // Clear search highlights
    clearSearchHighlights() {
        document.querySelectorAll('.search-highlight').forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });
        
        // Remove wrapper spans
        document.querySelectorAll('span').forEach(span => {
            if (span.childNodes.length === 1 && span.childNodes[0].nodeType === Node.TEXT_NODE) {
                const parent = span.parentNode;
                if (parent) {
                    parent.replaceChild(span.childNodes[0], span);
                }
            }
        });
    }

    // Escape regex special characters
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Close all search interfaces
    closeAll() {
        this.closeCommandPalette();
        this.closePageSearch();
    }

    // Close command palette
    closeCommandPalette() {
        const palette = document.getElementById('global-command-palette');
        if (palette) {
            palette.classList.add('hidden');
        }
        this.isPaletteOpen = false;
    }

    // Close page search
    closePageSearch() {
        const overlay = document.getElementById('page-search-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
        this.clearSearchHighlights();
        this.isSearchMode = false;
        this.currentMatches = [];
        this.currentMatchIndex = -1;
    }

    // Global search across all pages
    performGlobalSearch(query) {
        const results = this.searchContent(query);
        
        if (results.length === 0) {
            alert(`No results found for "${query}"`);
            return;
        }
        
        // For now, navigate to first result
        // In the future, could show results page
        window.location.href = results[0].url;
    }

    // Inject additional CSS for search functionality
    injectSearchStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .search-highlight {
                background: rgba(255, 204, 0, 0.3);
                color: #000;
                padding: 1px 2px;
                border-radius: 2px;
            }
            
            .search-highlight.active-match {
                background: #ffcc00;
                color: #000;
                font-weight: bold;
                box-shadow: 0 0 4px rgba(255, 204, 0, 0.8);
            }
            
            .no-results {
                color: #666;
                font-style: italic;
                padding: 20px;
                text-align: center;
            }
            
            .result-category {
                font-size: 11px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .search-status {
                padding: 10px 20px;
                border-top: 1px solid #333;
            }
            
            .match-count {
                font-size: 12px;
                color: #aaa;
            }
        `;
        document.head.appendChild(styles);
    }
}

// Initialize search system when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.searchSystem = new SearchSystem();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchSystem;
}