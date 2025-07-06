# ARCFORGE

> A premium terminal-inspired forum platform designed for developer communities

[![Production](https://img.shields.io/badge/status-production-brightgreen)](https://arcforge.tech)
[![Node.js](https://img.shields.io/badge/node.js-18%2B-brightgreen)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-15%2B-blue)](https://postgresql.org/)

## 🎯 Overview

ARCFORGE is a modern forum platform that combines terminal aesthetics with developer-focused features. Built for technical communities that value performance, security, and unique user experience.

**Key Features:**
- **Terminal Interface**: Vim-style keyboard navigation and command palette
- **Developer-Focused**: Built by developers, for developers
- **Performance**: Fast, lightweight, vanilla JavaScript architecture
- **Security**: Enterprise-grade authentication and data protection
- **Premium Tiers**: Sustainable freemium business model

## 🚀 Quick Start

### **Live Platform**
Visit [arcforge.tech](https://arcforge.tech) to explore the live platform.

### **Local Development**
```bash
# Clone repository
git clone https://github.com/JustaCakedUpGnome/arcForgeSite.git
cd arcForgeSite

# Backend setup
cd backend
npm install
cp .env.example .env  # Configure database settings
npm start

# Frontend - serve static files
# Open index.html in browser or use live server
```

## 🏗️ Architecture

```
Frontend:     Vanilla JavaScript + Terminal Theme
Backend:      Node.js + Express.js  
Database:     PostgreSQL with advanced features
Deployment:   VPS + nginx + PM2 + SSL
```

**Technical Highlights:**
- **No Framework Dependencies**: Pure vanilla JS for optimal performance
- **Polymorphic Database Design**: Flexible voting and content system
- **JWT Authentication**: Secure session management
- **Cost-Effective Hosting**: Runs efficiently on $3.50/month VPS

## 📁 Project Structure

```
arcForgeSite/
├── index.html              # Landing page
├── 404.html               # Custom error page
├── pages/                 # Organized content pages
│   ├── forum/            # Forum interface
│   ├── methodology/      # Training content
│   └── foundation/       # Educational content
├── backend/              # Node.js API server
│   ├── routes/          # API endpoints
│   ├── models/          # Database models
│   └── scripts/         # Database utilities
├── css/                 # Terminal theme styling
├── js/                  # Frontend JavaScript
└── docs/                # Comprehensive documentation
    ├── architecture/    # System design + ADRs
    ├── development/     # Setup + API docs
    ├── operations/      # Deployment + monitoring
    └── product/         # Features + roadmap
```

## ⌨️ Unique Features

### **Vim-Style Navigation**
- `j` - Expand next section
- `k` - Collapse all sections  
- `/` - Search current page
- `Ctrl+K` - Global command palette

### **Developer Experience**
- **Command Palette**: Quick access to any feature
- **Keyboard-First**: Minimal mouse interaction required
- **Fast Performance**: Sub-2-second page loads
- **Mobile Responsive**: Full functionality on mobile

### **Community Features**
- **Forum System**: Categories, posts, threaded replies
- **Voting System**: Upvote/downvote with polymorphic design
- **Premium Tiers**: Free and premium content access
- **User Authentication**: Secure JWT-based sessions

## 📊 Tech Stack

**Frontend:**
- Vanilla JavaScript (ES6+)
- Terminal-inspired CSS design
- Responsive mobile layout
- Vim-style keyboard shortcuts

**Backend:**
- Node.js + Express.js
- PostgreSQL with triggers
- JWT authentication
- bcrypt password hashing

**Deployment:**
- nginx reverse proxy
- PM2 process management
- Let's Encrypt SSL
- Cost-effective VPS hosting

## 🔧 Development

### **Database Setup**
```bash
# Install PostgreSQL
# Create database and user
createdb arcforge_db
createuser arcforge

# Run migrations
cd backend
node scripts/createTables.js
```

### **Environment Configuration**
```bash
# Backend .env file
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=arcforge_db
DB_USER=arcforge
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

### **API Endpoints**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/forum/categories` - Forum categories
- `POST /api/forum/posts` - Create posts
- `POST /api/votes` - Voting system

## 📖 Documentation

Comprehensive documentation available in `/docs/`:

- **[Architecture](docs/architecture/)**: System design, database schema, ADRs
- **[Development](docs/development/)**: API docs, setup guides, testing
- **[Operations](docs/operations/)**: Deployment, infrastructure, monitoring  
- **[Product](docs/product/)**: Features, roadmap, user guides

## 🚦 Current Status

**✅ Production Ready:**
- Core forum functionality
- User authentication system
- Terminal interface with keyboard shortcuts
- Mobile responsive design
- VPS deployment with SSL

**🔄 In Development:**
- Premium subscription system
- Real-time notifications
- Enhanced admin dashboard
- Mobile applications

## 🎯 Roadmap

**Q3 2024:**
- Premium subscription launch
- Enhanced admin dashboard  
- API expansion

**Q4 2024:**
- Real-time features
- Mobile applications
- Enterprise features

**2025:**
- Multi-tenant architecture
- AI integration
- Global expansion

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is for portfolio demonstration. See repository owner for licensing details.

## 🔗 Links

- **Live Site**: [arcforge.tech](https://arcforge.tech)
- **Documentation**: [View Docs](docs/)
- **Issues**: [GitHub Issues](https://github.com/JustaCakedUpGnome/arcForgeSite/issues)

---

*Built with ⚡ performance and 🎨 terminal aesthetics in mind.*