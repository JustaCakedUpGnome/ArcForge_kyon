# ARCFORGE BACKLOG

## Priority 1 (Immediate - 2-4 weeks)

### Next Sprint - High Priority
- [x] **Core Forum Platform** ✅ **COMPLETED - PHASE 1**
  - ✅ **Dedicated create post page** (replaced modal with full page editor)
  - ✅ **Individual post detail pages with replies system** 
    - ✅ Built `/forum/post.html?id=123` pages for viewing full posts
    - ✅ Added threaded reply/comment system with CRUD operations
    - ✅ Made recent activity + category posts clickable
    - ✅ Implemented reply creation with authentication
    - ✅ Added voting on replies and posts
    - ✅ Show post author, timestamps, voting stats
    - ✅ Admin moderation controls from post detail view
  - ✅ **Complete forum ecosystem** with professional UX

- [ ] **Forum Critical Fixes** (URGENT - Security/Privacy)
  - **🚨 Username system implementation** - Replace email exposure with usernames/display names (CRITICAL PRIVACY ISSUE)
  - **Forum search functionality** across all posts and replies (backend endpoint missing)
  - **Fix search system conflicts** - Unify global search vs forum search implementations
  - **Fix logout redirect bug** - Top-right logout button doesn't redirect to home
  - **Search highlighting repair** - Old search system doesn't highlight found text

- [ ] **Forum Enhancements - Phase 2** (Future Development)
  - **Rich text editor** for post content (markdown support)
  - **Post editing functionality** for authors/admins
  - **User reputation/karma system** with badges and levels
  - **Post categories/tags management** interface for admins
  - **Email notifications** for replies and mentions
  - **User profiles** with post history and statistics
  - **Forum moderation tools** (report system, user bans, content flagging)
  - **Image uploads** for progress photos in posts
  - **Pinned posts functionality** for important announcements
  - **Real-time notifications** with WebSocket integration
  
- [ ] **Technical Infrastructure**
  - ✅ **Fix nginx 404 handling** (COMPLETED)
    - ✅ Configured nginx to serve custom 404.html instead of default
    - ✅ Tested 404 behavior across all missing pages
    - ✅ Added proper error_page directive to nginx configuration
  - **Performance optimization** (database indexing, caching, CDN)
  - **Mobile app API** endpoints for potential mobile client
  - **Real-time notifications** with WebSocket integration

- [ ] **Cross-platform compatibility fixes**
  - Fix Mac keybind compatibility (keyboard shortcuts not working on macOS)  
  - Mobile keyboard shortcut alternatives
  - Test across Safari/Chrome/Firefox on different platforms
  - Touch-friendly navigation for mobile users

- [ ] **Terminal search/grep functionality**
  - Add search command (`:search` or `/` like vim)
  - Search across current page content  
  - Highlight search results
  - Navigate between matches with `n`/`N`
  - Global search across all docs

- [ ] **Protected content system**
  - User role management (free/premium)
  - Content gating for premium docs
  - "Preview" mode for paywalled content

### Completed Features
- [x] **Backend Authentication System - COMPLETE** 🎉
  - ✅ Set up Express.js server with basic structure
  - ✅ Create placeholder login/signup API endpoints
  - ✅ Test API endpoints with curl
  - ✅ Install PostgreSQL (Docker container)
  - ✅ Create PostgreSQL users table
  - ✅ Implement JWT-based authentication
  - ✅ Password hashing with bcrypt (10 salt rounds)
  - ✅ Connect endpoints to database
  - ✅ Full user registration and login working
  - ✅ Complete documentation written

- [x] **Frontend Login Integration - COMPLETE** 🎉
  - ✅ Terminal-style login modal (nvim command palette style)
  - ✅ Session state management in frontend (localStorage)
  - ✅ User indicator in bottom-left (`username@arcforge`)
  - ✅ Persistent login sessions
  - ✅ Connect frontend to backend APIs
  - ✅ Login/logout functionality working
  - ✅ Error handling and loading states
  - ✅ Form validation and user feedback

- [x] **Content Structure Reorganization - COMPLETE** 🎉
  - ✅ Created foundation/ directory for free intro content
  - ✅ Created methodology/ directory for core Heavy Duty content
  - ✅ Created advanced/ directory for premium content
  - ✅ Moved existing content to new logical structure
  - ✅ Updated all navigation links and file references
  - ✅ Added premium content styling with paywall notices
  - ✅ Cleaned up old directory structure

- [x] **Hybrid Search System - COMPLETE** 🎉
  - ✅ Vim-style page search (/ key) with real-time highlighting
  - ✅ Modern command palette (Ctrl+K) with global search
  - ✅ Smart keyboard navigation (n/N for matches)
  - ✅ Command execution system (:goto, :download, :help)
  - ✅ Pre-built search index for fast cross-page search
  - ✅ Category-organized results with visual icons
  - ✅ Mobile-responsive design for both search modes
  - ✅ Complete documentation and technical reference

### Future Features
- [ ] **Markdown Content System** 🔄
  - Dynamic markdown renderer with existing CSS styling
  - `/content/` folder for .md files from Obsidian
  - Auto-generated download links for .md files
  - Client-side rendering with marked.js
  - Frictionless Obsidian → site workflow
  - Maintain beautiful styling from current HTML system

- [ ] **Terminal search/grep functionality**
  - Add search command (`:search` or `/` like vim)
  - Search across current page content
  - Highlight search results
  - Navigate between matches with `n`/`N`

- [ ] **Stripe integration + paywall system**
  - Subscription tiers
  - Content gating for premium docs
  - Payment flow integration

- [ ] **Comment system on docs**
  - Simple threaded comments per page
  - User attribution (tied to auth)
  - Basic moderation tools

## Priority 2 (1-2 months)

### Terminal Enhancement
- [ ] **Advanced terminal interface**
  - Command history (up arrow)
  - Tab completion for commands
  - Help system (`:help`)
  - File navigation commands (`cd`, `ls`)

- [ ] **Enhanced search features**
  - Fuzzy finding across all docs
  - Filter by content type
  - Search within specific sections
  - Search results page

### User Features
- [ ] **Training log/dashboard** (if user demand exists)
  - Workout tracking
  - Progress visualization
  - Personal notes

- [ ] **Content expansion**
  - Complete Heavy Duty methodology docs
  - Exercise database with videos
  - Training templates

## Priority 3 (Future)

### Platform Expansion
- [ ] **Additional domains**
  - `/laboratory` - tech/programming content
  - `/library` - philosophy/reading
  - `/workshop` - tools/utilities

### Advanced Features
- [ ] **Terminal power features**
  - Custom aliases
  - Vim-like modes (normal/insert)
  - Macro recording
  - Advanced navigation shortcuts

- [ ] **Community Features**
  - User profiles
  - Progress sharing
  - Community challenges
  - Expert Q&A

## Technical Debt
- [ ] Separate CSS into external files
- [ ] Add loading states
- [ ] Implement local storage for preferences
- [ ] Optimize performance for larger datasets
- [ ] Add proper error handling
- [ ] Mobile app considerations

## Completed ✅
- [x] Terminal-style redesign inspired by kyon.dev
- [x] Interactive collapsible file tree navigation
- [x] Keyboard shortcuts (j/k/Shift+J)
- [x] Auto-dismissing keybind notification
- [x] JetBrains Mono typography
- [x] Mike Mentzer profile integration
- [x] All docs pages styled consistently
- [x] Responsive mobile design
- [x] Starfield background animation

---

*Last updated: 2025-07-03 - Updated forum priorities after codebase analysis, identified critical email privacy issue*