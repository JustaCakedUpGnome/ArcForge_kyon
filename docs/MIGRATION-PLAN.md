# ARCFORGE Structure Migration Plan

> **Status:** Planning Phase  
> **Goal:** Clean up the chaotic file structure and adopt professional documentation standards

## Current Problems

### File Structure Chaos
```
❌ CURRENT MESS:
/
├── docs/               # Mix of HTML content + old project docs
│   ├── forum.html      # Website content (wrong place)
│   ├── routines.html   # Website content (wrong place)
│   └── 6 other HTML files...
├── documentation/      # Old project docs (scattered)
│   ├── ARCHITECTURE.md
│   ├── BACKLOG.md
│   └── 8 other .md files...
├── forum.html          # Duplicate forum (newer version)
├── profile.html        # Random HTML in root
├── reset-password.html # Random HTML in root
├── upgrade.html        # Random HTML in root
└── arcForgeSite/       # Empty subfolder with .git
```

### Navigation Breakage Risk
- 4 files have hardcoded `/docs/` paths
- Moving files = broken links
- No systematic approach to testing

## Target Structure

```
✅ CLEAN TARGET:
/
├── index.html          # Main landing page
├── 404.html           # Nginx error page
├── pages/              # All website HTML content
│   ├── forum.html
│   ├── profile.html
│   ├── routines.html
│   └── ...
├── docs/               # Professional project documentation
│   ├── README.md
│   ├── architecture/
│   │   ├── README.md
│   │   └── adr/        # Architecture Decision Records
│   ├── development/
│   └── operations/
├── backend/            # API server
├── css/               # Stylesheets
├── js/                # Frontend code
└── content/           # Markdown source files
```

## Migration Phases

### Phase 1: Documentation Structure ✅
- [x] Create new `/docs/` structure
- [x] Add Architecture Decision Records (ADRs)
- [x] Create Mermaid system diagrams
- [x] Consolidate old `/documentation/` files

### Phase 2: File Reorganization 🔄
- [ ] Create git branch for safety
- [ ] Move HTML files from `/docs/` to `/pages/`
- [ ] Update hardcoded references in 4 files:
  - `index.html`
  - `methodology/goto-split.html`
  - `navigation/index.html`
  - `js/search.js`
- [ ] Remove duplicate `forum.html` files
- [ ] Clean up root directory

### Phase 3: Testing & Validation 🔄
- [ ] Test with `python3 -m http.server 8000`
- [ ] Verify all navigation links work
- [ ] Test search functionality
- [ ] Validate forum links
- [ ] Check mobile responsiveness

### Phase 4: Cleanup & Deploy 🔄
- [ ] Remove old `/documentation/` folder
- [ ] Update nginx configuration if needed
- [ ] Deploy to VPS
- [ ] Test production environment

## Risk Mitigation

### Git Branch Strategy
- Work in `structure-cleanup` branch
- Test thoroughly before merging
- Keep `redesign` branch as fallback

### Testing Checklist
- [ ] Main page loads correctly
- [ ] Terminal navigation works
- [ ] Search (both vim-style and Ctrl+K) functions
- [ ] Forum access works
- [ ] All links resolve correctly
- [ ] Mobile view intact

### Rollback Plan
If migration breaks:
1. `git checkout redesign`
2. `git branch -D structure-cleanup`
3. Restart with lessons learned

## Files That Need Updates

### Hardcoded `/docs/` References
1. **`/index.html:339`** - Main training link
2. **`/methodology/goto-split.html:16`** - Breadcrumb navigation
3. **`/navigation/index.html:247`** - Demo navigation
4. **`/navigation/index.html:462`** - JavaScript routes
5. **`/js/search.js:328`** - Forum navigation route

### Duplicate Files to Resolve
- `/docs/forum.html` (old placeholder) → DELETE
- `/forum.html` (current version) → MOVE to `/pages/`

## Success Criteria

✅ **Clean Structure**
- All HTML content in `/pages/`
- Professional docs in `/docs/`
- No random files in root

✅ **Working Navigation**
- All links resolve correctly
- Search functionality intact
- Forum access maintained

✅ **Documentation Quality**
- Architecture diagrams render on GitHub
- ADRs explain key decisions
- Future developers can understand the system

## Next Steps

1. **Complete documentation structure** (this phase)
2. **Create git branch** for safe experimentation
3. **Execute file migration** with careful testing
4. **Validate everything works** before merging

---

*This migration will transform ARCFORGE from a chaotic file structure into a professional, maintainable codebase with clear documentation and logical organization.*