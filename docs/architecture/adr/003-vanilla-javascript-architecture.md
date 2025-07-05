# ADR-003: Vanilla JavaScript Architecture

## Status
Accepted

## Context
The frontend architecture needed to balance terminal interface authenticity, performance, and maintainability while supporting complex features like hybrid search, authentication, and forum functionality.

## Decision
Use **Vanilla JavaScript** (no frontend frameworks) with:
- Modular JavaScript with ES6 modules
- Event-driven architecture for interactions
- Local storage for client-side state
- Direct DOM manipulation for UI updates

## Rationale
1. **Performance**: Zero framework overhead, faster page loads
2. **Terminal Authenticity**: Direct control over interface behavior
3. **Simplicity**: Reduced complexity and dependencies
4. **Educational Value**: Understanding core web technologies
5. **Deployment**: No build process required

## Architecture Patterns

### Module Structure
```
js/
├── auth.js              # Authentication management
├── search.js            # Hybrid search system
├── access-control.js    # Premium content gating
└── forum/
    └── forum-api.js     # Forum functionality
```

### State Management
```javascript
// Local storage for persistence
const UserState = {
  get: () => JSON.parse(localStorage.getItem('user') || '{}'),
  set: (data) => localStorage.setItem('user', JSON.stringify(data)),
  clear: () => localStorage.removeItem('user')
};
```

### Event-Driven Communication
```javascript
// Custom events for module communication
document.addEventListener('userLoggedIn', (e) => {
  updateUserInterface(e.detail.user);
});

document.dispatchEvent(new CustomEvent('userLoggedIn', {
  detail: { user: userData }
}));
```

## Consequences

### Positive
- ✅ **Zero Framework Overhead**: Faster initial loads
- ✅ **Direct Control**: Precise terminal behavior
- ✅ **No Build Process**: Simple deployment
- ✅ **Educational Value**: Core web fundamentals
- ✅ **Debugging**: No framework abstractions
- ✅ **Stability**: No framework migrations

### Negative
- ❌ **More Boilerplate**: Manual DOM manipulation
- ❌ **State Complexity**: No built-in state management
- ❌ **Organization**: Requires architectural discipline
- ❌ **Modern Tooling**: Limited development tools
- ❌ **Learning Curve**: Requires strong JavaScript fundamentals

## Quality Measures
- **Code Reviews**: Manual architecture consistency
- **Documentation**: Comprehensive function comments
- **Testing**: Manual and integration tests
- **Linting**: ESLint for code quality

## Migration Path
If complexity grows beyond vanilla capabilities:
1. **TypeScript**: Add type safety
2. **Bundler**: Vite for module management
3. **Framework**: Consider Alpine.js or Lit

## Alternatives Considered
1. **React**: Component-based with state management
2. **Vue.js**: Progressive framework with templates
3. **Svelte**: Compiled framework with minimal runtime
4. **Alpine.js**: Minimal framework for enhancement

## Related Decisions
- [ADR-001: Terminal Interface Design](001-terminal-interface-design.md)
- [ADR-002: Hybrid Search System](002-hybrid-search-system.md)
- [ADR-004: Node.js Backend Choice](004-nodejs-backend-choice.md)