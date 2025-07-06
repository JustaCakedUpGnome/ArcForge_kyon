# Authentication API

> JWT-based authentication system with bcrypt password hashing

**Tags:** #api #authentication #jwt #bcrypt #security

## 🔐 Authentication Overview

ARCFORGE uses stateless JWT authentication with secure password hashing, providing enterprise-grade security for user management.

```mermaid
sequenceDiagram
    participant C as Client
    participant A as Auth API
    participant D as Database
    participant J as JWT Service
    
    C->>A: POST /api/auth/signup
    A->>A: Validate input
    A->>A: Hash password (bcrypt)
    A->>D: Store user
    D-->>A: User created
    A->>J: Generate JWT
    J-->>A: Signed token
    A-->>C: Success + JWT
    
    Note over C,A: Login Flow
    C->>A: POST /api/auth/login
    A->>D: Find user by email
    D-->>A: User data
    A->>A: Verify password (bcrypt)
    A->>J: Generate JWT
    J-->>A: Signed token
    A-->>C: Success + JWT
    
    Note over C,A: Protected Request
    C->>A: Request + Authorization header
    A->>J: Verify JWT
    J-->>A: User data
    A-->>C: Authorized response
```

## 🛠️ API Endpoints

### **User Registration**

#### `POST /api/auth/signup`

Create a new user account with secure password hashing.

**Request:**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "heavy_duty_lifter",
  "email": "user@example.com", 
  "password": "securePassword123"
}
```

**Response (Success):**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "heavy_duty_lifter",
    "email": "user@example.com",
    "subscription_status": "free"
  }
}
```

**Response (Error):**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Email already exists"
}
```

**Validation Rules:**
- **Username**: 3-50 characters, alphanumeric + underscore
- **Email**: Valid email format, unique in database
- **Password**: Minimum 6 characters, no maximum

### **User Login**

#### `POST /api/auth/login`

Authenticate user and return JWT token.

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (Success):**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "heavy_duty_lifter",
    "email": "user@example.com",
    "subscription_status": "free"
  }
}
```

**Response (Error):**
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": "Invalid email or password"
}
```

### **Password Reset Request**

#### `POST /api/auth/reset-password`

Initiate password reset flow with email token.

**Request:**
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Password reset email sent"
}
```

**Notes:**
- Always returns success (security: don't reveal if email exists)
- Token expires in 1 hour
- Only sends email if account exists

### **Password Reset Confirmation**

#### `POST /api/auth/reset-password/:token`

Complete password reset with valid token.

**Request:**
```http
POST /api/auth/reset-password/abc123def456
Content-Type: application/json

{
  "newPassword": "newSecurePassword123"
}
```

**Response (Success):**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Password reset successful"
}
```

## 🔒 JWT Token System

### **Token Structure**
```javascript
// JWT Payload
{
  "id": 1,
  "email": "user@example.com",
  "iat": 1641234567,    // Issued at
  "exp": 1641320967     // Expires at (24 hours)
}
```

### **Token Usage**
Include JWT in `Authorization` header for protected routes:

```http
GET /api/forum/posts
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Token Validation**
The server validates JWTs using middleware:

```javascript
// Simplified middleware logic
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}
```

## 🛡️ Security Features

### **Password Hashing**
- **Algorithm**: bcrypt with 10 salt rounds
- **Security**: Resistant to rainbow table attacks
- **Performance**: ~100ms hash time (intentionally slow)

```javascript
// Password hashing example
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Password verification
const isValid = await bcrypt.compare(password, hashedPassword);
```

### **JWT Security**
- **Secret**: Strong random key (stored in environment)
- **Expiration**: 24-hour token lifetime
- **Algorithm**: HMAC SHA-256 (HS256)
- **Stateless**: No server-side session storage

### **Input Validation**
- **SQL Injection**: Parameterized queries
- **XSS Protection**: Input sanitization
- **Email Validation**: Regex + format checking
- **Rate Limiting**: Prevent brute force attacks (production)

## 📊 Database Schema

### **Users Table**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    subscription_status VARCHAR(20) DEFAULT 'free' 
        CHECK (subscription_status IN ('free', 'premium', 'admin')),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Features:**
- **Unique constraints** on username and email
- **Subscription tiers** for content access control
- **Password reset tokens** with expiration
- **Audit timestamps** for user lifecycle tracking

### **Indexes**
```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_reset_token ON users(reset_token);
```

## 🧪 Testing Examples

### **Registration Flow**
```bash
# Test user registration
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### **Login Flow**
```bash
# Test user login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### **Protected Route Access**
```bash
# Test protected route with JWT
TOKEN="your_jwt_token_here"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/forum/posts
```

## ⚡ Performance Considerations

### **Password Hashing**
- **Asynchronous**: Non-blocking bcrypt operations
- **Configurable**: Salt rounds adjustable for hardware
- **Memory usage**: bcrypt memory-hard algorithm

### **JWT Operations**
- **Stateless**: No database lookups for token validation
- **Caching**: Token payload cached in request context
- **Expiration**: Automatic cleanup via token expiry

### **Database Queries**
- **Prepared statements**: SQL injection prevention + performance
- **Connection pooling**: Efficient database connections
- **Unique indexes**: Fast email/username lookups

---

*This authentication system demonstrates production-ready security patterns with enterprise-grade features for user management.*