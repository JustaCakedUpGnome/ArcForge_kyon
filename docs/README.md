# ARCFORGE Documentation

> Terminal-inspired heavy duty training platform with fortress navigation metaphor

## 🚀 Quick Start
- [Migration Plan](MIGRATION-PLAN.md) - Current cleanup strategy
- [Architecture Overview](architecture/README.md) - System design with diagrams
- [Local Development](development/setup.md) - Get the project running

## 📁 Documentation Structure

### 🏗️ Architecture
- [System Architecture](architecture/README.md) - High-level design with Mermaid diagrams
- [Decision Records](architecture/adr/) - Why we made key technical choices
- [Database Schema](architecture/database.md) - Data models and relationships

### 👨‍💻 Development  
- [Local Setup](development/setup.md) - Environment configuration
- [API Documentation](development/api.md) - Backend endpoints and usage

### 🚀 Operations
- [VPS Deployment](operations/deployment.md) - Production deployment guide
- [Nginx Configuration](operations/nginx.md) - Web server setup

## 🎯 Key Concepts

### Terminal Interface
- **Fortress Navigation**: File tree structure with collapsible folders
- **Vim-Inspired UX**: `j/k` navigation, `/` search, `Ctrl+K` command palette
- **Keyboard-First**: Full accessibility via keyboard shortcuts

### Content Architecture
- **Foundation**: Free introductory content
- **Methodology**: Core Heavy Duty training principles  
- **Advanced**: Premium content behind paywall
- **Forum**: Community discussions and support

### Tech Stack
- **Frontend**: Vanilla JavaScript with terminal aesthetics
- **Backend**: Node.js + Express.js + PostgreSQL
- **Authentication**: JWT tokens with bcrypt
- **Search**: Hybrid vim-style + command palette system

## 🔄 Current Status

**Phase 1: Documentation** ✅ (Current)
- Professional docs structure created
- Architecture Decision Records added
- System diagrams with Mermaid

**Phase 2: File Migration** 🔄 (Next)
- Clean up scattered HTML files
- Consolidate into logical structure
- Update hardcoded references

See [Migration Plan](MIGRATION-PLAN.md) for detailed roadmap.