# ADR-001: Terminal Interface Design

## Status
Accepted

## Context
ARCFORGE needed a distinctive user interface that would differentiate it from typical fitness websites while providing an engaging experience for technically-minded users interested in heavy duty training methodology.

## Decision
Implement a terminal-inspired interface with:
- CLI-style navigation with file tree structure
- Vim-inspired keyboard shortcuts (`j/k` navigation, `/` search, `Ctrl+K` command palette)
- Monospace typography (JetBrains Mono)
- Dark theme with terminal aesthetics
- Fortress metaphor for navigation (`/fortress/foundation/`, etc.)

## Rationale
1. **Target Audience**: Technical users appreciate terminal interfaces
2. **Differentiation**: Unique aesthetic in the fitness/training space
3. **Efficiency**: Keyboard navigation is faster than mouse for power users
4. **Scalability**: Modular structure supports multiple content domains
5. **Accessibility**: Keyboard navigation benefits users with disabilities

## Consequences

### Positive
- ✅ Memorable brand identity and user experience
- ✅ Efficient navigation for technical users
- ✅ Scalable architecture for content organization
- ✅ Built-in keyboard accessibility
- ✅ Mobile-responsive design possible

### Negative
- ❌ Learning curve for non-technical users
- ❌ Potential barriers for casual fitness enthusiasts
- ❌ Additional complexity in implementation
- ❌ Need for comprehensive help system

## Implementation
- Inspired by [kyon.dev](https://kyon.dev) terminal aesthetics
- Vim keybindings with JavaScript event handlers
- File tree navigation with collapsible folders
- Auto-dismissing notifications for feature discovery

## Alternatives Considered
1. **Traditional Web UI**: Standard navigation and sidebar
2. **Card-Based Design**: Material design approach
3. **Minimalist Interface**: Clean, simple layout

## Related Decisions
- [ADR-002: Hybrid Search System](002-hybrid-search-system.md)
- [ADR-003: Vanilla JavaScript Architecture](003-vanilla-javascript-architecture.md)