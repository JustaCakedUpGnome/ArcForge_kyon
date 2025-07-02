// ARCFORGE Access Control System
class AccessControl {
    constructor() {
        this.authSystem = window.authSystem || new AuthSystem();
    }

    // Check if user has access to specific content level
    hasAccess(requiredLevel) {
        const user = this.authSystem.user;
        
        // Anonymous users
        if (!user) {
            return requiredLevel === 'foundation';
        }
        
        const userLevel = user.subscriptionStatus || 'free';
        
        // Access levels hierarchy
        const accessLevels = {
            'foundation': ['foundation', 'free', 'premium'],
            'methodology': ['free', 'premium'], 
            'advanced': ['premium']
        };
        
        return accessLevels[requiredLevel]?.includes(userLevel) || false;
    }
    
    // Get user's subscription status
    getUserLevel() {
        const user = this.authSystem.user;
        return user?.subscriptionStatus || (user ? 'free' : 'anonymous');
    }
    
    // Check access and redirect if needed
    checkPageAccess(requiredLevel, pageName) {
        if (!this.hasAccess(requiredLevel)) {
            this.redirectToUpgrade(requiredLevel, pageName);
            return false;
        }
        return true;
    }
    
    // Redirect to upgrade page with context
    redirectToUpgrade(requiredLevel, pageName) {
        const params = new URLSearchParams({
            required: requiredLevel,
            page: pageName,
            return_to: window.location.pathname
        });
        
        window.location.href = `/upgrade.html?${params.toString()}`;
    }
    
    // Show upgrade prompt for content sections
    showUpgradePrompt(contentElement, requiredLevel) {
        const upgradeHTML = `
            <div class="upgrade-prompt">
                <div class="upgrade-icon">🔒</div>
                <h3>Premium Content</h3>
                <p>This ${requiredLevel} content requires a subscription to access.</p>
                <button class="upgrade-btn" onclick="accessControl.redirectToUpgrade('${requiredLevel}', '${document.title}')">
                    Upgrade to Premium
                </button>
                <div class="upgrade-info">
                    <small>$9.99/month • Full access to advanced training content</small>
                </div>
            </div>
        `;
        
        contentElement.innerHTML = upgradeHTML;
        contentElement.classList.add('restricted-content');
    }
    
    // Initialize access control for current page
    initPageAccess(requiredLevel, pageName) {
        // If user doesn't have access, show upgrade page immediately
        if (!this.hasAccess(requiredLevel)) {
            this.redirectToUpgrade(requiredLevel, pageName);
            return false;
        }
        
        // Add user level indicator to page
        this.addAccessIndicator();
        return true;
    }
    
    // Add visual indicator of user's access level
    addAccessIndicator() {
        const userLevel = this.getUserLevel();
        const indicator = document.createElement('div');
        indicator.className = 'access-indicator';
        indicator.innerHTML = `
            <span class="access-badge access-${userLevel}">
                ${userLevel.toUpperCase()}
            </span>
        `;
        
        // Add to page (could be customized per page)
        document.body.appendChild(indicator);
    }
}

// Global access control instance
window.accessControl = new AccessControl();

// CSS for upgrade prompts and indicators
const accessControlCSS = `
<style>
    .upgrade-prompt {
        background: rgba(26, 26, 26, 0.95);
        border: 2px solid #444;
        border-radius: 8px;
        padding: 40px;
        text-align: center;
        margin: 40px auto;
        max-width: 500px;
        color: #e0e0e0;
        font-family: "JetBrains Mono", monospace;
    }
    
    .upgrade-icon {
        font-size: 48px;
        margin-bottom: 20px;
    }
    
    .upgrade-prompt h3 {
        font-size: 24px;
        margin-bottom: 15px;
        color: #fff;
    }
    
    .upgrade-prompt p {
        font-size: 16px;
        margin-bottom: 25px;
        color: #ccc;
        line-height: 1.5;
    }
    
    .upgrade-btn {
        background: #2a2a2a;
        border: 1px solid #444;
        border-radius: 4px;
        padding: 12px 24px;
        color: #fff;
        font-family: "JetBrains Mono", monospace;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-bottom: 15px;
    }
    
    .upgrade-btn:hover {
        background: #333;
        border-color: #666;
    }
    
    .upgrade-info {
        color: #888;
        font-size: 12px;
    }
    
    .access-indicator {
        position: fixed;
        top: 70px;
        right: 20px;
        z-index: 1000;
    }
    
    .access-badge {
        background: rgba(17, 17, 17, 0.9);
        border: 1px solid #333;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 1px;
    }
    
    .access-free {
        color: #ccc;
        border-color: #444;
    }
    
    .access-premium {
        color: #4CAF50;
        border-color: #4CAF50;
    }
    
    .access-anonymous {
        color: #888;
        border-color: #333;
    }
    
    .restricted-content {
        filter: blur(2px);
        pointer-events: none;
        user-select: none;
    }
</style>
`;

// Inject CSS
document.head.insertAdjacentHTML('beforeend', accessControlCSS);