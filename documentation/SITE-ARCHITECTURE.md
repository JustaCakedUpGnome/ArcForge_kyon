# ARCFORGE SITE ARCHITECTURE

> **Purpose**: Complete system overview for faster development context and clear technical vision

## 🏗️ **Infrastructure Overview**

### **VPS Environment**
- **Host**: Production VPS server
- **Process Manager**: PM2 (Node.js backend)
- **Web Server**: nginx (reverse proxy + static files)
- **Database**: PostgreSQL (direct connection, no Docker)
- **SSL**: HTTPS enabled
- **Domain**: arcforge.tech

### **Deployment Workflow**

# 🚨 **CRITICAL DEPLOYMENT PROCESS** 🚨

**IMPORTANT:** Always commit and push locally FIRST, then deploy to VPS

```bash
# LOCAL: Commit and push changes
git add .
git commit -m "Your commit message"
git push origin redesign

# VPS: Pull and deploy (wait for Claude to provide these commands)
# SSH to VPS, then Claude will give you:
# git pull origin redesign
# pm2 restart arcforge (if backend changes)
# psql commands (if database changes needed)
```

**⚠️ Never run VPS commands until Claude says "Ready to deploy" and provides exact commands**

### **Development Approach**
- **Environment**: Production debugging (small user base)
- **User Base**: Test accounts only (currently safe for breaking changes)
- **Testing**: Manual testing on production
- **Database Changes**: Direct SQL execution on production

## 💾 **Database Architecture**

### **Connection Details**
- **Type**: PostgreSQL
- **Host**: localhost:5432
- **Database**: arcforge_production
- **User**: arcforge_prod
- **Password**: Tucker_Lily_855365
- **Access**: psql commands from `/var/www/mysite/backend/` directory on VPS

### **Core Tables Schema**
```sql
-- Authentication & Users
users (
    id, email, password_hash, role, 
    subscription_status, stripe_customer_id,
    reset_token, reset_expires, created_at
)

-- Forum System
categories (id, name, description, access_level, post_count)
posts (id, user_id, category_id, title, content, upvotes, downvotes, reply_count)
replies (id, post_id, user_id, content, upvotes, downvotes)
votes (id, user_id, votable_type, votable_id, vote_type)
```

### **Migration Strategy**
- **Method**: Direct SQL execution on production
- **Files**: Store migrations in `/backend/migrations/`
- **Execution**: Manual psql commands on VPS
- **Backup**: [TODO: Define backup strategy]

## 🔧 **Backend Architecture**

### **Node.js + Express Setup**
```
backend/
├── server.js           # Main entry point
├── routes/
│   ├── auth.js         # Authentication endpoints
│   └── forum.js        # Forum CRUD operations
├── migrations/         # Database schema files
└── .env               # Environment variables
```

### **API Structure**
```
/api/auth/
├── signup              # User registration
├── login               # JWT authentication
├── forgot-password     # Password reset initiation
└── reset-password      # Password reset completion

/api/forum/
├── categories          # Get forum categories
├── posts               # CRUD operations for posts
├── posts/:id/replies   # Reply management
├── vote                # Upvote/downvote system
└── stats               # Forum statistics
```

### **Authentication System**
- **Method**: JWT tokens in localStorage
- **Middleware**: Token validation on protected routes
- **Roles**: regular, admin (arcforge.tech@gmail.com)
- **Access Control**: Premium content gating via subscription_status

## 🎨 **Frontend Architecture**

### **File Structure**
```
/
├── index.html          # Homepage with terminal interface
├── forum.html          # Main forum page
├── forum/
│   ├── category.html   # Category browsing
│   ├── post.html       # Individual post view
│   └── create-post.html # Post creation
├── foundation/         # Free content pages
├── methodology/        # Core training content
├── advanced/          # Premium content
└── js/
    ├── auth.js         # Authentication system
    ├── access-control.js # Premium content gating
    └── forum/
        └── forum-api.js # Forum API client
```

### **Design System**
- **Theme**: Terminal/hacker aesthetic (kyon.dev inspired)
- **Typography**: JetBrains Mono monospace
- **Colors**: Dark theme (#111 backgrounds, #ff6b6b accents)
- **Components**: Consistent across all pages
- **Responsive**: Mobile-first design

### **JavaScript Architecture**
- **Auth System**: Global auth state management
- **API Client**: Centralized API calls via classes
- **Module Pattern**: Self-contained page classes
- **Event Handling**: Modern addEventListener patterns

## 🔐 **Security & Access Control**

### **Authentication Flow**
1. User signs up/logs in → JWT token generated
2. Token stored in localStorage
3. Token sent with API requests in Authorization header
4. Backend validates token and extracts user info

### **Premium Content System**
- **Free Users**: foundation/ content access
- **Premium Users**: advanced/ content + premium forum categories
- **Gating**: JavaScript checks subscription_status before showing content
- **Fallback**: Redirect to upgrade page for premium content

### **Admin System**
- **Admin Detection**: JWT token email === 'arcforge.tech@gmail.com'
- **Admin Features**: Delete posts, manage forum content
- **UI**: Admin controls only visible to admin users

## 📧 **Email System**

### **Configuration**
- **Service**: Gmail SMTP with App Passwords
- **From Address**: noreply@arcforge.tech
- **Forwarding**: → arcforge.tech@gmail.com
- **Purpose**: Password reset emails only

### **Email Templates**
- **Style**: Terminal-themed HTML emails
- **Content**: Matches site aesthetic
- **Links**: Direct back to site with proper routing

## 🏛️ **Content Architecture**

### **Content Organization**
```
foundation/     # Free introductory content
├── motivation-and-identity.html
├── muscle-fiber-primer.html
├── training-philosophy.html
├── hydration-and-nutrients.html
└── myths-and-qa.html

methodology/    # Core Heavy Duty training
├── goto-split.html
├── heavy-duty-principles.html
└── progression-protocols.html

advanced/       # Premium subscription content
├── recovery-guide.html
└── [future premium content]

content/        # Source markdown files (Obsidian)
├── [markdown source files]
└── [future: automated conversion pipeline]
```

### **Content Strategy**
- **Foundation**: High-quality free content (motivation, science, basics)
- **Methodology**: Core training methods (some free, some premium)
- **Advanced**: Premium-only content (CNS management, advanced techniques)
- **Forum**: Community discussions tied to content sections

## 🔄 **Current Status & Known Issues**

### **✅ Working Systems**
- Authentication (signup/login/password reset)
- Forum (posts, replies, voting, admin controls)
- Premium content gating
- Email system (password resets)
- VPS deployment pipeline
- Custom 404 pages

### **🚨 Critical Issues**
- **Email Privacy**: Forum displays user emails instead of usernames (URGENT)
- **Search Missing**: Forum search backend endpoint not implemented
- **Search Conflicts**: Multiple search systems causing UI conflicts

### **📋 Next Priorities**
1. Add username field to users table + update forum displays
2. Implement forum search backend endpoint
3. Resolve search system conflicts
4. Complete methodology content placeholders

## 🎯 **Development Guidelines**

### **Code Standards**
- **JavaScript**: Modern ES6+, no unnecessary dependencies
- **CSS**: Inline styles for components, consistent terminal theme
- **HTML**: Semantic markup, accessibility considerations
- **API**: RESTful endpoints, consistent error handling

### **Testing Approach**
- **Method**: Manual testing on production (small user base)
- **Browser Testing**: Chrome/Firefox/Safari compatibility
- **Mobile Testing**: Responsive design validation
- **Error Handling**: Graceful fallbacks for API failures

### **Performance Considerations**
- **Database**: Indexed queries, PostgreSQL triggers for counts
- **Frontend**: Minimal JavaScript, efficient DOM manipulation
- **Assets**: Optimized fonts, compressed images
- **Caching**: Static file caching via nginx

## 📞 **Quick Reference Commands**

### **VPS Database Access**
```bash
# IMPORTANT: Run from /var/www/mysite/backend/ directory

# Connect to PostgreSQL
psql -h localhost -U arcforge_prod -d arcforge_production
# Password: Tucker_Lily_855365

# Alternative: Connect as postgres superuser
sudo -u postgres psql

# Check table structure
\d users
\d posts

# Run migration
psql -h localhost -U arcforge_prod -d arcforge_production -f migrations/file.sql
```

### **PM2 Management**
```bash
# Restart backend
pm2 restart arcforge

# Check logs
pm2 logs arcforge

# Update environment variables
pm2 restart arcforge --update-env
```

### **nginx Management**
```bash
# Test configuration
nginx -t

# Reload configuration
systemctl reload nginx

# Check status
systemctl status nginx
```

---

*Last updated: 2025-07-03 - Initial architecture documentation*