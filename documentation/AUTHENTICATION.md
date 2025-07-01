# ARCFORGE AUTHENTICATION SYSTEM

## Overview
ARCFORGE uses a JWT-based authentication system with bcrypt password hashing, PostgreSQL storage, and Express.js API endpoints. This provides secure user registration and login functionality.

## Architecture

### Tech Stack
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (Docker container)
- **Password Hashing**: bcrypt (10 salt rounds)
- **Tokens**: JSON Web Tokens (JWT)
- **Session Duration**: 24 hours

### Data Flow
```
Frontend Request → Express Route → User Model → PostgreSQL → JWT Response
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### POST /api/auth/signup
**Purpose**: Create a new user account

**Request Body**:
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**Validation**:
- Email and password required
- Password minimum 6 characters
- Email must be unique

**Process**:
1. Validate input data
2. Check if email already exists
3. Hash password with bcrypt (10 salt rounds)
4. Insert user into database
5. Generate JWT token (24h expiration)
6. Return user data + token

**Success Response** (201):
```json
{
    "message": "User created successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "createdAt": "2025-06-30T12:01:40.174Z"
    }
}
```

**Error Responses**:
- 400: Missing email/password
- 400: Password too short
- 400: Email already exists
- 500: Server error

### POST /api/auth/login
**Purpose**: Authenticate existing user

**Request Body**:
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**Process**:
1. Validate input data
2. Find user by email in database
3. Compare provided password with stored hash using bcrypt
4. Generate new JWT token if valid
5. Return user data + token

**Success Response** (200):
```json
{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "createdAt": "2025-06-30T12:01:40.174Z"
    }
}
```

**Error Responses**:
- 400: Missing email/password
- 401: Invalid credentials
- 500: Server error

## Security Features

### Password Security
- **bcrypt hashing**: Passwords never stored in plain text
- **Salt rounds**: 10 rounds (industry standard)
- **Minimum length**: 6 characters required

### JWT Tokens
- **Signed with secret**: `JWT_SECRET` environment variable
- **Expiration**: 24 hours
- **Payload includes**: userId, email, issued time
- **Header required**: `Authorization: Bearer <token>`

### Database Security
- **Parameterized queries**: Prevents SQL injection
- **Unique constraints**: Email uniqueness enforced
- **User permissions**: Limited database access

## File Structure

```
backend/
├── server.js                 # Express server + middleware
├── config/
│   └── database.js           # PostgreSQL connection pool
├── models/
│   └── User.js               # User model (create, find, verify)
├── routes/
│   └── auth.js               # Authentication endpoints
├── scripts/
│   └── createTables.js       # Database initialization
└── .env                      # Environment variables
```

## Code Implementation

### User Model (`models/User.js`)
```javascript
class User {
    // Hash password and create user in database
    static async create(email, password) {
        const passwordHash = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at';
        const result = await pool.query(query, [email, passwordHash]);
        return result.rows[0];
    }
    
    // Find user by email
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0] || null;
    }
    
    // Verify password against hash
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}
```

### JWT Token Generation
```javascript
const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
);
```

### Database Connection
```javascript
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});
```

## Environment Variables

### Required `.env` Configuration
```
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=arcforge_db
DB_USER=arcforge
DB_PASSWORD=heavy_duty_123

# JWT
JWT_SECRET=heavy_duty_fortress_secret_key_2025

# Server
PORT=5000
```

## Testing Examples

### Create User Account
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@arcforge.com","password":"heavyduty123"}'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@arcforge.com","password":"heavyduty123"}'
```

### Test Duplicate Email (Should Fail)
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@arcforge.com","password":"different123"}'
```

## How It Works: Step-by-Step

### Signup Process
1. **Frontend sends** email + password to `/api/auth/signup`
2. **Express validates** input (required fields, password length)
3. **User model checks** if email already exists in database
4. **bcrypt hashes** the password with 10 salt rounds
5. **PostgreSQL stores** user with hashed password
6. **JWT token generated** containing user ID and email
7. **Response sent** with token and user data (no password)

### Login Process
1. **Frontend sends** email + password to `/api/auth/login`
2. **Express validates** input format
3. **User model queries** database for user by email
4. **bcrypt compares** provided password with stored hash
5. **JWT token generated** if password matches
6. **Response sent** with fresh token and user data

### Token Usage (Future)
1. **Frontend stores** JWT token (localStorage/sessionStorage)
2. **API requests include** `Authorization: Bearer <token>` header
3. **Middleware verifies** token signature and expiration
4. **Protected routes** access user ID from token payload

## Next Steps

### Frontend Integration
- Terminal-style login modal
- Session state management
- Token storage and usage
- User indicator display

### Security Enhancements
- Password strength requirements
- Rate limiting for auth endpoints
- Email verification
- Password reset functionality

### Features
- User profile management
- Role-based permissions
- Session management
- Logout functionality

---

*This authentication system provides a secure foundation for user management in the ARCFORGE platform, following industry best practices for password security and token-based authentication.*