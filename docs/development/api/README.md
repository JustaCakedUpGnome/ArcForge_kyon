# API Documentation

> Complete REST API reference for ARCFORGE forum platform

**Tags:** #api #rest #documentation #endpoints

## 🚀 API Overview

ARCFORGE provides a comprehensive RESTful API built with Express.js, featuring JWT authentication, role-based access control, and enterprise-grade forum functionality.

**Base URL**: `http://localhost:3000/api` (development)  
**Production URL**: `https://arcforge.tech/api`

## 📋 Quick Reference

### **Authentication Endpoints**
```
POST   /api/auth/signup              # User registration
POST   /api/auth/login               # User login  
POST   /api/auth/reset-password      # Password reset request
POST   /api/auth/reset-password/:token # Complete password reset
```

### **Forum Endpoints**
```
GET    /api/forum/categories         # List all categories
GET    /api/forum/categories/:id     # Get category details
GET    /api/forum/categories/:id/posts # Get posts in category
POST   /api/forum/posts              # Create new post
GET    /api/forum/posts/:id          # Get post with replies
POST   /api/forum/posts/:id/replies  # Create reply
POST   /api/forum/vote               # Cast vote
DELETE /api/forum/vote               # Remove vote
GET    /api/forum/stats              # Forum statistics
```

### **Admin Endpoints**
```
DELETE /api/forum/posts/:id          # Delete post (admin)
PATCH  /api/forum/posts/:id/pin      # Pin/unpin post (admin)
```

### **Utility Endpoints**
```
GET    /api/health                   # Health check
```

## 🔐 Authentication

### **JWT Token System**
All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Token Lifecycle**
1. **Obtain Token**: Login via `POST /api/auth/login`
2. **Use Token**: Include in `Authorization` header
3. **Token Expires**: 24 hours from issue
4. **Refresh**: Re-login when token expires

### **Authentication Levels**
- **Public**: No authentication required
- **User**: Valid JWT token required
- **Premium**: JWT token + premium subscription
- **Admin**: JWT token + admin role

## 📊 Response Format

### **Success Response**
```json
{
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "meta": {
    // Optional metadata (pagination, etc.)
  }
}
```

### **Error Response**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    // Optional error details
  }
}
```

### **HTTP Status Codes**
- **200 OK**: Successful request
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server error

## 🔍 API Features

### **Pagination**
List endpoints support pagination via query parameters:

```http
GET /api/forum/categories/1/posts?page=2&limit=20
```

**Response includes pagination metadata:**
```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 156,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": true
  }
}
```

### **Sorting**
Many endpoints support sorting via `sort` parameter:

```http
GET /api/forum/posts?sort=latest    # Latest first
GET /api/forum/posts?sort=popular   # Most votes first
GET /api/forum/posts?sort=oldest    # Oldest first
```

### **Filtering**
Forum endpoints support various filters:

```http
GET /api/forum/posts?category=foundation
GET /api/forum/posts?author=username
GET /api/forum/posts?pinned=true
```

## 🛡️ Security Features

### **Input Validation**
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization
- **Type Validation**: Strict type checking
- **Length Limits**: Prevent oversized payloads

### **Rate Limiting**
API includes rate limiting for security:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1641234567
```

### **CORS Configuration**
Cross-origin requests properly configured:

```javascript
// Allowed origins
origins: ['https://arcforge.tech', 'http://localhost:8000']
```

## 📈 Performance Features

### **Database Optimization**
- **Connection Pooling**: Efficient PostgreSQL connections
- **Prepared Statements**: Query plan caching
- **Strategic Indexes**: Optimized for common queries
- **Denormalized Counters**: Fast vote/reply counts

### **Caching Strategy**
- **HTTP Caching**: Appropriate cache headers
- **Database Query Caching**: Repeated query optimization
- **Static Asset Caching**: Long-term browser caching

## 🧪 Testing the API

### **Health Check**
Verify API is running:

```bash
curl http://localhost:3000/api/health
```

### **Authentication Flow**
```bash
# 1. Register user
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# 2. Login and get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 3. Use token for protected request
TOKEN="your_jwt_token_here"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/forum/posts
```

### **Forum Operations**
```bash
# Get categories
curl http://localhost:3000/api/forum/categories

# Get posts in category
curl http://localhost:3000/api/forum/categories/1/posts

# Create post (requires auth)
curl -X POST http://localhost:3000/api/forum/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Post","content":"Test content","category_id":1}'

# Vote on post (requires auth)
curl -X POST http://localhost:3000/api/forum/vote \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"votable_type":"post","votable_id":1,"vote_type":"upvote"}'
```

## 📚 Detailed Documentation

- **[Authentication API](authentication.md)** - User management and JWT system
- **[Forum API](forum.md)** - Complete forum functionality
- **[Testing Guide](../testing.md)** - Comprehensive testing procedures

## 🔧 Development Tools

### **API Documentation Tools**
- **Postman Collection**: Import collection for easy testing
- **curl Examples**: Command-line testing scripts
- **API Client**: Frontend JavaScript examples

### **Database Tools**
- **pgAdmin**: Visual database management
- **SQL Scripts**: Database setup and migration scripts
- **Query Performance**: EXPLAIN ANALYZE for optimization

---

*This API demonstrates production-ready design patterns with enterprise-level security, performance, and maintainability features.*