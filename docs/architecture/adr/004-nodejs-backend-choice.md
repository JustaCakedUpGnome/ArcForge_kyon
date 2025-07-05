# ADR-004: Node.js Backend Choice

## Status
Accepted

## Context
ARCFORGE required a backend architecture for user authentication, forum functionality, payment processing, and content management while maintaining simplicity and rapid development capability.

## Decision
Use **Node.js with Express.js** with:
- RESTful API design with clear endpoints
- JWT-based authentication with bcrypt
- PostgreSQL for data persistence
- Modular route organization by feature

## Rationale
1. **JavaScript Ecosystem**: Shared language across full stack
2. **Rapid Development**: Express.js minimal, flexible framework
3. **JSON-First**: Native JSON support for API responses
4. **NPM Ecosystem**: Rich package library for integrations
5. **Deployment**: Single runtime for frontend and backend

## Architecture Structure

### Project Organization
```
backend/
├── server.js           # Express entry point
├── routes/
│   ├── auth.js         # Authentication endpoints
│   ├── forum.js        # Forum CRUD operations
│   └── payment.js      # Stripe integration
├── models/
│   ├── User.js         # User data model
│   └── Post.js         # Forum post model
├── middleware/
│   ├── auth.js         # JWT validation
│   └── validation.js   # Input validation
└── config/
    └── database.js     # PostgreSQL connection
```

### API Design
```javascript
// RESTful endpoint structure
GET    /api/auth/profile        # Get user profile
POST   /api/auth/login          # User login
POST   /api/auth/register       # User registration

GET    /api/forum/posts         # List forum posts
POST   /api/forum/posts         # Create new post
GET    /api/forum/posts/:id     # Get specific post
PUT    /api/forum/posts/:id     # Update post
DELETE /api/forum/posts/:id     # Delete post
```

## Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js 18+ | JavaScript runtime |
| **Framework** | Express.js | Web framework |
| **Database** | PostgreSQL | Relational data storage |
| **Authentication** | JWT + bcrypt | Secure token auth |
| **Validation** | express-validator | Input sanitization |
| **Security** | helmet, cors | Security headers |

## Consequences

### Positive
- ✅ **Rapid Development**: Quick API creation
- ✅ **Shared Language**: JavaScript everywhere
- ✅ **JSON Native**: Perfect for API-first design
- ✅ **Rich Ecosystem**: NPM packages available
- ✅ **Simple Deployment**: Single runtime
- ✅ **Real-time Ready**: WebSocket support

### Negative
- ❌ **Single-Threaded**: CPU-intensive operations block
- ❌ **Memory Usage**: Higher than compiled languages
- ❌ **Type Safety**: No compile-time checking
- ❌ **Callback Complexity**: Potential callback hell

## Implementation Guidelines

### Authentication Flow
```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```

### Database Connection
```javascript
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  max: 10, // Connection pooling
  idleTimeoutMillis: 30000
});
```

## Security Measures
- **Input Validation**: All endpoints validate input
- **SQL Injection Prevention**: Parameterized queries
- **Rate Limiting**: API abuse prevention
- **CORS**: Proper cross-origin setup
- **Environment Variables**: Secure configuration

## Performance Optimizations
- **Connection Pooling**: Database efficiency
- **Caching**: Redis for sessions and responses
- **Compression**: Gzip for API responses
- **Monitoring**: Request logging and metrics

## Alternatives Considered
1. **Python + Django**: Full-featured framework with ORM
2. **Go + Gin**: Compiled performance with concurrency
3. **Rust + Actix**: Maximum performance with safety
4. **PHP + Laravel**: Mature ecosystem

## Migration Path
If performance becomes critical:
1. **TypeScript**: Add type safety
2. **GraphQL**: Complex data fetching
3. **Microservices**: Scale individual components
4. **Go/Rust**: Migrate performance-critical parts

## Related Decisions
- [ADR-003: Vanilla JavaScript Architecture](003-vanilla-javascript-architecture.md)
- [ADR-005: PostgreSQL Database Choice](005-postgresql-database-choice.md)
- [ADR-006: JWT Authentication Strategy](006-jwt-authentication-strategy.md)