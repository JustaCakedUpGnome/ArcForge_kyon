# ARCFORGE BACKLOG

## Priority 1 (Immediate - 2-4 weeks)

### Critical Bugs
- [ ] **Fix Mac keybind compatibility** - keyboard shortcuts not working on macOS
  - Investigate shift key detection differences
  - Test across Safari/Chrome on Mac

### Core Features (Current Sprint)
- [ ] **Backend Authentication System**
  - Set up Express.js server with basic structure
  - Create PostgreSQL users table
  - Implement JWT-based authentication
  - Password hashing with bcrypt
  - Login/signup API endpoints

- [ ] **Frontend Login Integration**
  - Terminal-style login modal (nvim command palette style)
  - Session state management in frontend
  - User indicator in bottom-left (`justin@arcforge`)
  - "Remember me" functionality
  - Connect frontend to backend APIs

### Future Features
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

*Last updated: 2025-06-30*