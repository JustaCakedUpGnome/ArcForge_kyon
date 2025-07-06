# ADR-001: Terminal Interface Design

## Status
Accepted

## Context
ARCFORGE needed a distinctive interface that would:
1. Support the long-term vision of becoming a comprehensive library for documentation and studies
2. Differentiate from typical fitness websites
3. Provide an engaging experience for both technical and non-technical users
4. Scale across multiple content domains (training, programming, philosophy, etc.)

## Decision
Implement a terminal-inspired interface with **progressive enhancement**:
- CLI-style navigation with file tree structure (fully mouse/touch accessible)
- Vim-inspired keyboard shortcuts as **optional enhancements** (`j/k`, `/`, `Ctrl+K`)
- Monospace typography (JetBrains Mono) for readability
- Dark theme with terminal aesthetics
- Fortress metaphor expandable to library/laboratory domains

## Rationale
1. **Library Vision**: Terminal metaphor scales perfectly for documentation/study platform
2. **Progressive Enhancement**: Core functionality works without keyboard shortcuts
3. **Differentiation**: Unique aesthetic across fitness and technical content
4. **Dual Accessibility**: Mouse users get full functionality, keyboard users get efficiency boosts
5. **Content Agnostic**: Works equally well for training docs, programming tutorials, philosophy texts
6. **Professional Appeal**: Developer-friendly aesthetic attracts technical audience

## Consequences

### Positive
- ✅ **Universal Accessibility**: Full functionality via mouse/touch, enhanced by keyboard
- ✅ **Scalable Content Platform**: Works for training, tech docs, philosophy, etc.
- ✅ **Memorable Brand**: Distinctive aesthetic across all content domains
- ✅ **Progressive Enhancement**: Keyboard shortcuts are additive, not required
- ✅ **Professional Appeal**: Attracts both technical and serious learners
- ✅ **Future-Proof**: Terminal metaphor scales to any documentation domain

### Negative
- ❌ **Unique Learning Curve**: Non-standard web interface patterns
- ❌ **Implementation Complexity**: Dual interaction modes require careful design
- ❌ **Mobile Optimization**: Terminal aesthetics need mobile adaptation
- ❌ **Help System Overhead**: Need to educate users on available enhancements

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