# ADR-005: HTML Structure Organization

## Status
Accepted

## Context
ARCFORGE had inconsistent HTML file organization with content scattered across multiple patterns:
- Domain-based folders (`/foundation/`, `/methodology/`, `/advanced/`, `/forum/`)
- Generic content folder (`/pages/` with mixed files)
- HTML files mixed with project documentation in `/docs/`
- Random HTML files in root directory

This inconsistency made navigation updates complex and created maintenance overhead.

## Decision
Consolidate **all HTML content** under a single `/pages/` directory with logical subdirectories:

```
pages/
├── foundation/     # Free introductory content
├── methodology/    # Core Heavy Duty training
├── advanced/       # Premium content  
├── forum/          # Community discussions
├── user/           # User-related pages (profile, settings)
└── misc/           # Other site pages (routines, legacy)
```

## Rationale
1. **Consistency**: Single pattern for all HTML content organization
2. **Separation of Concerns**: Clear distinction between site content and project documentation
3. **Maintainability**: Easier to update navigation and routing logic
4. **Scalability**: Simple pattern to extend for new content types
5. **Developer Experience**: Predictable file locations

## Implementation Strategy

### File Moves Required
```
/foundation/         → /pages/foundation/
/methodology/        → /pages/methodology/
/advanced/           → /pages/advanced/
/forum/              → /pages/forum/
/docs/*.html         → /pages/misc/
/profile.html        → /pages/user/profile.html
/reset-password.html → /pages/user/reset-password.html
/upgrade.html        → /pages/user/upgrade.html
```

### Reference Updates
All hardcoded paths in these files need updating:
- Navigation links in `index.html`
- Breadcrumb navigation in page headers
- JavaScript routing in `search.js`
- Command palette navigation
- Inter-page links and references

## Consequences

### Positive
- ✅ **Consistent Organization**: All HTML follows same pattern
- ✅ **Clean Separation**: Site content vs. project documentation
- ✅ **Easier Maintenance**: Predictable file locations
- ✅ **Better Routing**: Simplified navigation logic
- ✅ **Professional Structure**: Industry-standard organization

### Negative
- ❌ **Migration Complexity**: Many files and references to update
- ❌ **Temporary Breakage**: Links will break during migration
- ❌ **URL Changes**: May affect bookmarks/external links
- ❌ **Testing Overhead**: All navigation must be re-validated

## Migration Plan
1. **Create migration branch** for safe experimentation
2. **Move directories** in logical order (foundation → methodology → advanced → forum)
3. **Update references** systematically after each move
4. **Test navigation** at each step
5. **Validate all functionality** before merging

## URL Impact
If the site is already deployed, consider:
- **Nginx redirects** from old URLs to new structure
- **404 handling** for any missed redirects
- **Update external links** if any exist

## Alternatives Considered
1. **Keep Domain Folders**: Maintain `/foundation/`, `/methodology/` structure
2. **Hybrid Approach**: Move only problematic files
3. **Flat Structure**: All HTML files in single `/pages/` directory

## Related Decisions
- [ADR-001: Terminal Interface Design](001-terminal-interface-design.md) - Navigation patterns
- [ADR-002: Hybrid Search System](002-hybrid-search-system.md) - Routing implications