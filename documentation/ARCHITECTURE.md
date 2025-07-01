# ARCFORGE ARCHITECTURE

## Overview
ARCFORGE is a terminal-inspired web platform designed around the metaphor of navigating a digital fortress. The architecture supports modular expansion into multiple domains while maintaining a consistent terminal aesthetic.

## Core Concept
```
/arcforge/
├── fortress/          # Heavy Duty training & philosophy (current)
├── laboratory/        # Tech & programming content (planned)
├── library/           # Philosophy & reading (planned)
└── workshop/          # Tools & utilities (planned)
```

## Tech Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript
- **Backend**: Node.js with Express.js framework
- **Database**: PostgreSQL
- **Typography**: JetBrains Mono (developer-focused)
- **Styling**: Terminal/CLI aesthetic inspired by kyon.dev
- **Version Control**: Git with feature branching
- **Hosting**: VPS deployment (frontend + backend)
- **Authentication**: JWT tokens, bcrypt password hashing
- **Search**: Hybrid vim-style + command palette system
- **Future**: Stripe integration, social login (GitHub/Google)

## Content Structure (Updated 2025-06-30)
```
/fortress/
├── foundation/          # Free introductory content
│   ├── motivation_and_identity
│   ├── muscle_fiber_primer  
│   ├── training_philosophy
│   └── myths_and_qa
├── methodology/         # Core Heavy Duty principles
│   ├── heavy_duty_principles
│   ├── goto_split
│   └── progression_protocols
├── advanced/ 🔒        # Premium content
│   ├── recovery_guide
│   ├── split_programming
│   ├── diet_blueprint
│   └── anatomy_movement
├── forum/              # Community discussions
└── navigation/         # Terminal interface showcase
```

## File Structure
```
arcForgeSite/
├── index.html                 # Main fortress landing
├── foundation/                # Free intro content
├── methodology/               # Core training content  
├── advanced/                  # Premium content
├── navigation/                # Terminal showcase
├── docs/                      # Legacy pages
├── images/                    # Assets
├── css/                       # Stylesheets
├── js/                        # Frontend JavaScript
│   ├── auth.js               # Authentication system
│   └── search.js             # Hybrid search system
├── backend/                   # Server-side code
│   ├── server.js             # Express server entry point
│   ├── routes/               # API endpoints
│   ├── models/               # Database models
│   └── config/               # Database & environment config
└── documentation/             # Project docs
```

## Design Principles

### Terminal Metaphor
- **Navigation**: File tree structure with collapsible folders
- **Keyboard Shortcuts**: Vim-inspired (j/k navigation, Ctrl+K command palette)
- **Search**: Dual-mode search system (vim-style + modern command palette)
- **Commands**: Terminal commands (:goto, :download, :help, :search)
- **Aesthetics**: Dark theme, monospace fonts, starfield background

### Modular Architecture
- **Domain Isolation**: Each domain (/fortress, /laboratory) is self-contained
- **Consistent Interface**: Same terminal navigation across all domains
- **Scalable Content**: Easy to add new domains without restructuring
- **Shared Components**: Common terminal features (search, keyboard shortcuts)

### User Experience
- **Progressive Disclosure**: Collapsible content sections
- **Keyboard-First**: All features accessible via keyboard
- **Mobile Responsive**: Terminal aesthetic that works on mobile
- **Fast Loading**: Minimal dependencies, optimized assets

## Key Components

### Navigation System
- **File Tree**: Interactive folder structure
- **Breadcrumbs**: Path-based navigation
- **Keyboard Shortcuts**: j/k/Shift+J for folder manipulation
- **Back Links**: Consistent return navigation

### Search System (New)
- **Hybrid Interface**: Two search modes for different user types
  - `/` key: Vim-style page search with highlighting and n/N navigation
  - `Ctrl+K`: Modern command palette with global search and actions
- **Real-time Search**: Instant highlighting as you type
- **Global Index**: Pre-built content index for cross-page search
- **Smart Navigation**: Navigate matches with keyboard shortcuts
- **Command Execution**: Execute actions directly from search palette
- **Mobile Responsive**: Touch-friendly interfaces with keyboard alternatives

### Terminal Features
- **Search**: Dual-mode search system (page + global)
- **Commands**: Vim-inspired command interface (:goto, :download, :help)
- **Keyboard Navigation**: Full keyboard accessibility
- **Help System**: Built-in documentation and command reference

### Content Management
- **Markdown Support**: Easy content authoring
- **Version Control**: Git-based content management
- **Paywall Integration**: Stripe-based content gating
- **Comment System**: User discussions on content

## Authentication & Monetization

### User System
- **Registration**: Email-based signup
- **Authentication**: Session-based login
- **Profiles**: Minimal user data storage
- **Preferences**: Terminal customization settings

### Payment Integration
- **Stripe**: Subscription and one-time payments
- **Content Gating**: Premium content access control
- **Subscription Tiers**: Multiple access levels
- **Usage Tracking**: Analytics for premium features

## Future Expansion

### Additional Domains
Each new domain follows the same pattern:
```
/arcforge/laboratory/
├── projects/
├── tutorials/
├── tools/
└── experiments/
```

### Advanced Features
- **Terminal Emulation**: More complete CLI experience
- **Custom Commands**: User-defined shortcuts
- **Theming**: Multiple terminal color schemes
- **Collaboration**: Shared workspaces and documents

## Performance Considerations
- **Lazy Loading**: Content loaded on demand
- **Caching Strategy**: Browser and CDN caching
- **Minimal Dependencies**: Vanilla JS for core functionality
- **Progressive Enhancement**: Works without JavaScript (basic functionality)

## Security
- **Content Sanitization**: XSS protection for user content
- **Authentication**: Secure session management
- **Payment Security**: PCI compliance via Stripe
- **Rate Limiting**: API abuse prevention

---

*This architecture supports the vision of ARCFORGE as an expandable, terminal-inspired platform for delivering technical and philosophical content through an engaging, keyboard-driven interface.*