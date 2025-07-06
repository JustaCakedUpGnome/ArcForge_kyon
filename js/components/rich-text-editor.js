// Rich Text Editor Component for ARCFORGE
class RichTextEditor {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            placeholder: options.placeholder || 'Write your content...',
            initialValue: options.initialValue || '',
            mode: options.mode || 'rich', // 'rich' or 'markdown'
            showModeToggle: options.showModeToggle !== false,
            minHeight: options.minHeight || '120px',
            ...options
        };
        
        this.currentMode = this.options.mode;
        this.content = this.options.initialValue;
        
        this.init();
    }
    
    init() {
        this.render();
        this.attachEventListeners();
        this.setValue(this.content);
    }
    
    render() {
        this.container.innerHTML = `
            <div class="rich-text-editor">
                ${this.renderToolbar()}
                ${this.renderEditor()}
                ${this.renderModeToggle()}
            </div>
        `;
        
        this.toolbar = this.container.querySelector('.rte-toolbar');
        this.editor = this.container.querySelector('.rte-editor');
        this.textarea = this.container.querySelector('.rte-textarea');
        this.modeToggle = this.container.querySelector('.rte-mode-toggle');
    }
    
    renderToolbar() {
        return `
            <div class="rte-toolbar">
                <div class="rte-toolbar-group">
                    <button type="button" class="rte-btn" data-action="bold" title="Bold (Ctrl+B)">
                        <strong>B</strong>
                    </button>
                    <button type="button" class="rte-btn" data-action="italic" title="Italic (Ctrl+I)">
                        <em>I</em>
                    </button>
                    <button type="button" class="rte-btn" data-action="strikethrough" title="Strikethrough">
                        <span style="text-decoration: line-through">S</span>
                    </button>
                </div>
                
                <div class="rte-toolbar-group">
                    <button type="button" class="rte-btn" data-action="code" title="Inline Code">
                        &lt;/&gt;
                    </button>
                    <button type="button" class="rte-btn" data-action="codeblock" title="Code Block">
                        { }
                    </button>
                </div>
                
                <div class="rte-toolbar-group">
                    <button type="button" class="rte-btn" data-action="link" title="Link">
                        🔗
                    </button>
                    <button type="button" class="rte-btn" data-action="bulletlist" title="Bullet List">
                        • List
                    </button>
                    <button type="button" class="rte-btn" data-action="numberlist" title="Numbered List">
                        1. List
                    </button>
                </div>
            </div>
        `;
    }
    
    renderEditor() {
        return `
            <div class="rte-editor-container">
                <div class="rte-editor" 
                     contenteditable="true" 
                     style="min-height: ${this.options.minHeight}"
                     data-placeholder="${this.options.placeholder}">
                </div>
                <textarea class="rte-textarea" 
                          style="min-height: ${this.options.minHeight}; display: none;"
                          placeholder="${this.options.placeholder}"></textarea>
            </div>
        `;
    }
    
    renderModeToggle() {
        if (!this.options.showModeToggle) return '';
        
        return `
            <div class="rte-mode-toggle">
                <button type="button" class="rte-mode-btn ${this.currentMode === 'rich' ? 'active' : ''}" 
                        data-mode="rich">
                    📝 Rich Text
                </button>
                <button type="button" class="rte-mode-btn ${this.currentMode === 'markdown' ? 'active' : ''}" 
                        data-mode="markdown">
                    ⌨️ Markdown
                </button>
            </div>
        `;
    }
    
    attachEventListeners() {
        // Toolbar button clicks
        this.toolbar.addEventListener('click', (e) => {
            const btn = e.target.closest('.rte-btn');
            if (btn) {
                e.preventDefault();
                const action = btn.dataset.action;
                this.executeCommand(action);
            }
        });
        
        // Mode toggle
        if (this.modeToggle) {
            this.modeToggle.addEventListener('click', (e) => {
                const btn = e.target.closest('.rte-mode-btn');
                if (btn) {
                    const mode = btn.dataset.mode;
                    this.switchMode(mode);
                }
            });
        }
        
        // Content change tracking
        this.editor.addEventListener('input', () => {
            this.content = this.editor.innerHTML;
            this.triggerChange();
        });
        
        this.textarea.addEventListener('input', () => {
            this.content = this.textarea.value;
            this.triggerChange();
        });
        
        // Keyboard shortcuts
        this.editor.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        this.textarea.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }
    
    executeCommand(action) {
        if (this.currentMode === 'markdown') {
            this.executeMarkdownCommand(action);
        } else {
            this.executeRichTextCommand(action);
        }
    }
    
    executeRichTextCommand(action) {
        this.editor.focus();
        
        switch (action) {
            case 'bold':
                document.execCommand('bold');
                break;
            case 'italic':
                document.execCommand('italic');
                break;
            case 'strikethrough':
                document.execCommand('strikeThrough');
                break;
            case 'code':
                this.wrapSelection('code');
                break;
            case 'codeblock':
                this.wrapSelection('pre');
                break;
            case 'link':
                const url = prompt('Enter URL:');
                if (url) {
                    document.execCommand('createLink', false, url);
                }
                break;
            case 'bulletlist':
                document.execCommand('insertUnorderedList');
                break;
            case 'numberlist':
                document.execCommand('insertOrderedList');
                break;
        }
        
        this.content = this.editor.innerHTML;
        this.triggerChange();
    }
    
    executeMarkdownCommand(action) {
        const textarea = this.textarea;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const beforeText = textarea.value.substring(0, start);
        const afterText = textarea.value.substring(end);
        
        let replacement = '';
        let newCursorPos = start;
        
        switch (action) {
            case 'bold':
                replacement = `**${selectedText || 'bold text'}**`;
                newCursorPos = start + (selectedText ? replacement.length : 2);
                break;
            case 'italic':
                replacement = `*${selectedText || 'italic text'}*`;
                newCursorPos = start + (selectedText ? replacement.length : 1);
                break;
            case 'strikethrough':
                replacement = `~~${selectedText || 'strikethrough text'}~~`;
                newCursorPos = start + (selectedText ? replacement.length : 2);
                break;
            case 'code':
                replacement = `\`${selectedText || 'code'}\``;
                newCursorPos = start + (selectedText ? replacement.length : 1);
                break;
            case 'codeblock':
                replacement = `\n\`\`\`\n${selectedText || 'code block'}\n\`\`\`\n`;
                newCursorPos = start + (selectedText ? replacement.length : 4);
                break;
            case 'link':
                const url = prompt('Enter URL:');
                if (url) {
                    replacement = `[${selectedText || 'link text'}](${url})`;
                    newCursorPos = start + replacement.length;
                }
                break;
            case 'bulletlist':
                replacement = `\n- ${selectedText || 'list item'}\n`;
                newCursorPos = start + replacement.length;
                break;
            case 'numberlist':
                replacement = `\n1. ${selectedText || 'list item'}\n`;
                newCursorPos = start + replacement.length;
                break;
        }
        
        if (replacement) {
            textarea.value = beforeText + replacement + afterText;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
            textarea.focus();
            
            this.content = textarea.value;
            this.triggerChange();
        }
    }
    
    wrapSelection(tag) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const element = document.createElement(tag);
            element.appendChild(range.extractContents());
            range.insertNode(element);
        }
    }
    
    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault();
                    this.executeCommand('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    this.executeCommand('italic');
                    break;
            }
        }
    }
    
    switchMode(mode) {
        if (mode === this.currentMode) return;
        
        const oldMode = this.currentMode;
        this.currentMode = mode;
        
        // Convert content between modes
        if (oldMode === 'rich' && mode === 'markdown') {
            // Convert HTML to Markdown
            this.content = this.htmlToMarkdown(this.editor.innerHTML);
            this.textarea.value = this.content;
        } else if (oldMode === 'markdown' && mode === 'rich') {
            // Convert Markdown to HTML
            this.content = this.markdownToHtml(this.textarea.value);
            this.editor.innerHTML = this.content;
        }
        
        // Update UI
        this.updateModeDisplay();
        this.triggerChange();
    }
    
    updateModeDisplay() {
        // Show/hide editor elements
        if (this.currentMode === 'rich') {
            this.editor.style.display = 'block';
            this.textarea.style.display = 'none';
            this.toolbar.style.display = 'flex';
        } else {
            this.editor.style.display = 'none';
            this.textarea.style.display = 'block';
            this.toolbar.style.display = 'flex'; // Keep toolbar for Markdown shortcuts
        }
        
        // Update mode buttons
        if (this.modeToggle) {
            this.modeToggle.querySelectorAll('.rte-mode-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.mode === this.currentMode);
            });
        }
    }
    
    // Simple HTML to Markdown conversion
    htmlToMarkdown(html) {
        let markdown = html;
        
        // Convert common HTML tags to Markdown
        markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
        markdown = markdown.replace(/<b>(.*?)<\/b>/g, '**$1**');
        markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*');
        markdown = markdown.replace(/<i>(.*?)<\/i>/g, '*$1*');
        markdown = markdown.replace(/<code>(.*?)<\/code>/g, '`$1`');
        markdown = markdown.replace(/<pre>(.*?)<\/pre>/g, '\n```\n$1\n```\n');
        markdown = markdown.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)');
        markdown = markdown.replace(/<br\s*\/?>/g, '\n');
        markdown = markdown.replace(/<p>(.*?)<\/p>/g, '$1\n\n');
        markdown = markdown.replace(/<div>(.*?)<\/div>/g, '$1\n');
        
        // Clean up extra whitespace
        markdown = markdown.replace(/\n{3,}/g, '\n\n');
        markdown = markdown.trim();
        
        return markdown;
    }
    
    // Simple Markdown to HTML conversion
    markdownToHtml(markdown) {
        let html = markdown;
        
        // Convert Markdown to HTML
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/`(.*?)`/g, '<code>$1</code>');
        html = html.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>');
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
        html = html.replace(/\n/g, '<br>');
        
        return html;
    }
    
    // Public API
    getValue() {
        if (this.currentMode === 'rich') {
            return this.htmlToMarkdown(this.editor.innerHTML);
        } else {
            return this.textarea.value;
        }
    }
    
    setValue(value) {
        this.content = value;
        
        if (this.currentMode === 'rich') {
            this.editor.innerHTML = this.markdownToHtml(value);
        } else {
            this.textarea.value = value;
        }
    }
    
    focus() {
        if (this.currentMode === 'rich') {
            this.editor.focus();
        } else {
            this.textarea.focus();
        }
    }
    
    triggerChange() {
        // Dispatch custom event for external listeners
        const event = new CustomEvent('rte-change', {
            detail: { value: this.getValue(), mode: this.currentMode }
        });
        this.container.dispatchEvent(event);
    }
    
    // Event listener methods
    onChange(callback) {
        this.container.addEventListener('rte-change', (e) => {
            callback(e.detail.value, e.detail.mode);
        });
    }
}

// Global instance for easy access
window.RichTextEditor = RichTextEditor;