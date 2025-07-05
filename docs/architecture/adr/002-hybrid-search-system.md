# ADR-002: Hybrid Search System

## Status
Accepted

## Context
The terminal interface needed a search system that would satisfy both technical users familiar with vim/terminal workflows and casual users expecting modern web search experiences.

## Decision
Implement a hybrid search system with two distinct modes:
1. **Vim-Style Search** (`/` key): Page-level search with real-time highlighting
2. **Command Palette** (`Ctrl+K`): Global search with action execution

## Rationale
1. **Dual User Base**: Serves both technical and casual users
2. **Context-Appropriate**: Different search needs require different interfaces
3. **Terminal Authenticity**: Vim-style search maintains terminal metaphor
4. **Modern Expectations**: Command palette provides familiar UX
5. **Keyboard Efficiency**: Both modes support full keyboard navigation

## Implementation Details

### Vim-Style Search
- Real-time highlighting as user types
- `n/N` navigation between matches
- Escape to clear search and highlighting
- Current page only

### Command Palette
- Global search across all content
- Action execution (`:goto`, `:download`, `:help`)
- Fuzzy matching for search terms
- Categorized results with icons

## Consequences

### Positive
- ✅ Satisfies both user types
- ✅ Maintains terminal authenticity
- ✅ Efficient keyboard navigation
- ✅ Discoverable features
- ✅ Scalable search architecture

### Negative
- ❌ Increased implementation complexity
- ❌ Potential user confusion with dual modes
- ❌ Additional maintenance overhead
- ❌ Need for user education

## Technical Architecture
```javascript
// Vim-style search
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && !isInputFocused()) {
    activateVimSearch();
  }
});

// Command palette
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'k') {
    activateCommandPalette();
  }
});
```

## Alternatives Considered
1. **Single Search Mode**: Either vim-style or command palette only
2. **Traditional Search Box**: Standard web search input
3. **Integrated Search**: Single interface combining both approaches

## Related Decisions
- [ADR-001: Terminal Interface Design](001-terminal-interface-design.md)
- [ADR-003: Vanilla JavaScript Architecture](003-vanilla-javascript-architecture.md)