# ARCFORGE System Architecture

> Terminal-inspired forum platform with fortress navigation metaphor

**Tags:** #architecture #system-design #full-stack

## 🏗️ System Overview

ARCFORGE is a production-grade forum platform designed around the metaphor of navigating a digital fortress. Built for heavy duty training content with enterprise-level features.

```mermaid
graph TB
    subgraph "Client Layer"
        A[Terminal UI] --> B[Vanilla JavaScript]
        B --> C[Search System]
        C --> D[Vim-style + Command Palette]
    end
    
    subgraph "Application Layer"
        E[Express.js API] --> F[JWT Authentication]
        E --> G[Forum API]
        E --> H[User Management]
    end
    
    subgraph "Data Layer"
        I[PostgreSQL] --> J[Users Table]
        I --> K[Posts/Replies]
        I --> L[Voting System]
        I --> M[Database Triggers]
    end
    
    subgraph "Infrastructure"
        N[nginx] --> O[SSL/HTTPS]
        N --> P[Static Files]
        Q[PM2] --> R[Process Management]
    end
    
    A --> E
    E --> I
    N --> E
    Q --> E
    
    style A fill:#2d3748,stroke:#4a5568,color:#e2e8f0
    style E fill:#2b6cb0,stroke:#3182ce,color:#e2e8f0
    style I fill:#38a169,stroke:#48bb78,color:#e2e8f0
    style N fill:#d69e2e,stroke:#ed8936,color:#e2e8f0
```

## 🎯 Core Architecture Principles

### **Terminal-First Design**
- **Fortress Navigation**: File tree structure with collapsible folders
- **Vim-Inspired UX**: `j/k` navigation, `/` search, `Ctrl+K` command palette
- **Keyboard Accessibility**: Full functionality via keyboard shortcuts

### **Modular Content Structure**
```mermaid
graph LR
    subgraph "Content Hierarchy"
        A[/pages/] --> B[foundation/]
        A --> C[methodology/] 
        A --> D[advanced/]
        A --> E[forum/]
        A --> F[user/]
        A --> G[misc/]
    end
    
    B --> H[Free Content]
    C --> I[Core Training]
    D --> J[Premium Content]
    E --> K[Community]
    F --> L[Profiles/Auth]
    G --> M[Utilities]
    
    style A fill:#4c51bf,stroke:#5a67d8,color:#e2e8f0
    style H fill:#38a169,stroke:#48bb78,color:#e2e8f0
    style I fill:#3182ce,stroke:#4299e1,color:#e2e8f0
    style J fill:#d69e2e,stroke:#ed8936,color:#e2e8f0
```

## 🔧 Technology Stack

### **Frontend**
- **HTML5/CSS3**: Semantic markup with terminal aesthetics
- **Vanilla JavaScript**: No framework dependencies
- **JetBrains Mono**: Developer-focused typography
- **Root-relative paths**: Migration-proof resource loading

### **Backend**
- **Node.js + Express.js**: RESTful API server
- **PostgreSQL**: Production database with triggers
- **JWT + bcrypt**: Secure authentication system
- **PM2**: Process management and auto-restart

### **Infrastructure**
- **nginx**: Reverse proxy + static file serving
- **SSL/HTTPS**: Certificate-based security
- **VPS Hosting**: Production environment
- **Git**: Version control with feature branching

## 🗄️ Database Architecture

```mermaid
erDiagram
    USERS ||--o{ POSTS : creates
    USERS ||--o{ REPLIES : creates
    USERS ||--o{ VOTES : casts
    POSTS ||--o{ REPLIES : has
    POSTS ||--o{ VOTES : receives
    REPLIES ||--o{ VOTES : receives
    
    USERS {
        uuid id PK
        string username UK
        string email UK
        string password_hash
        enum role
        timestamp created_at
        timestamp updated_at
    }
    
    POSTS {
        uuid id PK
        uuid author_id FK
        string title
        text content
        string category
        int vote_count
        timestamp created_at
        timestamp updated_at
    }
    
    REPLIES {
        uuid id PK
        uuid post_id FK
        uuid author_id FK
        text content
        int vote_count
        timestamp created_at
        timestamp updated_at
    }
    
    VOTES {
        uuid id PK
        uuid user_id FK
        uuid votable_id FK
        string votable_type
        int vote_value
        timestamp created_at
    }
```

### **Advanced Database Features**
- **PostgreSQL Triggers**: Auto-update vote counts
- **UPSERT Operations**: Efficient vote toggling
- **Polymorphic Relations**: Unified voting system
- **UUID Primary Keys**: Production-ready scaling

## 🚀 Deployment Architecture

```mermaid
graph TB
    subgraph "Production VPS"
        A[nginx :80/:443] --> B[Express.js :3000]
        B --> C[PostgreSQL :5432]
        D[PM2] --> B
        E[SSL Certificate] --> A
    end
    
    subgraph "Development"
        F[localhost:8000] --> G[Python HTTP Server]
        H[localhost:3000] --> I[Node.js Backend]
    end
    
    J[Git Repository] --> K[VPS Deployment]
    K --> D
    
    style A fill:#d69e2e,stroke:#ed8936,color:#e2e8f0
    style B fill:#2b6cb0,stroke:#3182ce,color:#e2e8f0
    style C fill:#38a169,stroke:#48bb78,color:#e2e8f0
    style D fill:#9f7aea,stroke:#b794f6,color:#e2e8f0
```

### **Critical Deployment Process**
1. **Local Development**: Test with Python HTTP server
2. **Commit & Push**: Version control all changes
3. **VPS Deployment**: Pull latest + PM2 restart
4. **Database Migrations**: Auto-run on PM2 restart

## 🔍 Search System Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Terminal UI
    participant JS as search.js
    participant API as Express API
    participant DB as PostgreSQL
    
    U->>UI: Press '/' or Ctrl+K
    UI->>JS: Initialize search
    JS->>JS: Load search index
    U->>UI: Type query
    UI->>JS: Filter results
    JS->>UI: Display matches
    U->>UI: Select result
    UI->>UI: Navigate to page
    
    Note over JS: Hybrid system:<br/>- Vim-style: '/' key<br/>- Command palette: Ctrl+K
```

## 🎯 Key Design Decisions

Refer to [Architecture Decision Records](adr/) for detailed rationale:
- [Terminal Interface Design](adr/001-terminal-interface-design.md)
- [Hybrid Search System](adr/002-hybrid-search-system.md)
- [Vanilla JavaScript Choice](adr/003-vanilla-javascript-architecture.md)
- [Node.js Backend Selection](adr/004-nodejs-backend-choice.md)
- [HTML Structure Organization](adr/005-html-structure-organization.md)

## 📈 Scalability Considerations

### **Current Capacity**
- **Concurrent Users**: 100+ (single VPS)
- **Database**: PostgreSQL with indexing
- **Static Assets**: nginx caching
- **Session Management**: Stateless JWT

### **Future Scaling**
- **Horizontal Scaling**: Load balancer + multiple app servers
- **Database**: Read replicas for forum content
- **CDN**: Static asset distribution
- **Microservices**: Domain-specific services

## 🔐 Security Architecture

```mermaid
graph TB
    subgraph "Authentication Flow"
        A[User Login] --> B{Credentials Valid?}
        B -->|Yes| C[Generate JWT]
        B -->|No| D[Return Error]
        C --> E[Set HTTP-Only Cookie]
        E --> F[Access Protected Routes]
    end
    
    subgraph "Authorization"
        G[JWT Middleware] --> H{Token Valid?}
        H -->|Yes| I[Extract User Data]
        H -->|No| J[Redirect to Login]
        I --> K[Check Role Permissions]
        K --> L[Grant/Deny Access]
    end
    
    style C fill:#38a169,stroke:#48bb78,color:#e2e8f0
    style I fill:#3182ce,stroke:#4299e1,color:#e2e8f0
    style D fill:#e53e3e,stroke:#f56565,color:#e2e8f0
    style J fill:#e53e3e,stroke:#f56565,color:#e2e8f0
```

### **Security Features**
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Stateless authentication
- **HTTPS Everywhere**: SSL certificate protection
- **Input Validation**: Server-side sanitization
- **Role-Based Access**: Admin/user permissions

---

*This system has been battle-tested in production with real users and demonstrates enterprise-level architecture patterns.*