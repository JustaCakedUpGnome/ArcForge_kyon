# Local Development Setup

> Complete guide to get ARCFORGE running on your local machine

**Tags:** #setup #local-development #docker #postgresql

## 🎯 Prerequisites

### **Required Software**
- **Node.js** (v16+ recommended)
- **npm** (comes with Node.js)
- **Docker** (for PostgreSQL database)
- **Git** (for version control)

### **Optional Tools**
- **Docker Desktop** (easier container management)
- **pgAdmin** or **DBeaver** (database GUI)
- **Postman** (API testing)

## 🚀 Quick Start (5 minutes)

### **1. Clone Repository**
```bash
git clone <repository-url>
cd arcForgeSite
```

### **2. Start Database**
```bash
# Start PostgreSQL container
docker run --name arcforge-postgres \
  -e POSTGRES_PASSWORD=heavy_duty_123 \
  -p 5432:5432 \
  -d postgres

# Verify container is running
docker ps
```

### **3. Setup Backend**
```bash
cd backend/
npm install
node scripts/createTables.js
npm start
```

### **4. Start Frontend**
```bash
# In new terminal, from project root
python3 -m http.server 8000
```

### **5. Access Application**
- **Frontend**: http://localhost:8000
- **API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

## 🗄️ Database Setup (Detailed)

### **Start PostgreSQL Container**
```bash
# Option 1: Basic setup
docker run --name arcforge-postgres \
  -e POSTGRES_PASSWORD=heavy_duty_123 \
  -p 5432:5432 \
  -d postgres

# Option 2: With persistent data
docker run --name arcforge-postgres \
  -e POSTGRES_PASSWORD=heavy_duty_123 \
  -p 5432:5432 \
  -v arcforge_data:/var/lib/postgresql/data \
  -d postgres
```

### **Create Database and User**
```bash
# Connect to PostgreSQL
docker exec -it arcforge-postgres psql -U postgres

# Create database and user
CREATE DATABASE arcforge_db;
CREATE USER arcforge WITH PASSWORD 'heavy_duty_123';
GRANT ALL PRIVILEGES ON DATABASE arcforge_db TO arcforge;

# Connect to new database
\c arcforge_db

# Grant schema permissions
GRANT ALL PRIVILEGES ON SCHEMA public TO arcforge;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO arcforge;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO arcforge;

# Exit PostgreSQL
\q
```

### **Initialize Database Schema**
```bash
cd backend/
node scripts/createTables.js
```

**Expected output:**
```
Connected to PostgreSQL database
Creating users table...
Creating categories table...
Creating posts table...
Creating replies table...
Creating votes table...
Database setup complete!
```

## ⚙️ Backend Configuration

### **Environment Variables**
Create `backend/.env` file:
```env
# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=arcforge_db
DB_USER=arcforge
DB_PASSWORD=heavy_duty_123

# JWT configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Server configuration
PORT=3000
NODE_ENV=development

# Email configuration (optional for development)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### **Dependencies Installation**
```bash
cd backend/
npm install
```

**Key packages installed:**
- `express` - Web framework
- `pg` - PostgreSQL client
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

### **Start Development Server**
```bash
# Standard start
npm start

# Development with auto-restart
npm run dev  # if nodemon is configured

# Manual start
node server.js
```

## 🌐 Frontend Development

### **Static File Server**
```bash
# From project root
python3 -m http.server 8000

# Alternative with Node.js
npx http-server -p 8000
```

### **Testing Different Pages**
- **Main site**: http://localhost:8000
- **Foundation content**: http://localhost:8000/pages/foundation/
- **Forum**: http://localhost:8000/pages/forum/forum.html
- **Terminal demo**: http://localhost:8000/pages/navigation/
- **404 page**: http://localhost:8000/404.html

### **Development Workflow**
1. **Edit HTML/CSS/JS** files in your editor
2. **Refresh browser** to see changes
3. **Check browser console** for JavaScript errors
4. **Test on mobile** using browser dev tools

## 🧪 Testing Setup

### **API Testing with curl**
```bash
# Health check
curl http://localhost:3000/api/health

# Get categories
curl http://localhost:3000/api/forum/categories

# Register user
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### **Frontend Testing Checklist**
- [ ] **Navigation**: File tree expands/collapses
- [ ] **Search**: Vim-style (`/`) and command palette (`Ctrl+K`)
- [ ] **Keyboard shortcuts**: `j/k` navigation
- [ ] **Responsive design**: Mobile view works
- [ ] **Form submission**: Registration/login forms
- [ ] **Error handling**: 404 page displays correctly

## 🔧 Troubleshooting

### **Common Issues**

#### **Database Connection Failed**
```bash
# Check if PostgreSQL container is running
docker ps

# Check container logs
docker logs arcforge-postgres

# Restart container
docker restart arcforge-postgres
```

#### **Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000
# or
netstat -tlnp | grep :3000

# Kill process
kill -9 <PID>
```

#### **Permission Denied (PostgreSQL)**
```bash
# Re-grant permissions
docker exec -it arcforge-postgres psql -U postgres -d arcforge_db
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO arcforge;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO arcforge;
```

#### **Frontend Pages Not Loading**
- Check Python server is running on port 8000
- Verify file paths use forward slashes
- Check for browser JavaScript errors

### **Reset Everything**
```bash
# Stop and remove database container
docker stop arcforge-postgres
docker rm arcforge-postgres

# Remove persistent data (if using volumes)
docker volume rm arcforge_data

# Restart from database setup step
```

## 📊 Development Tools

### **Database Management**
```bash
# Connect to database directly
docker exec -it arcforge-postgres psql -U arcforge -d arcforge_db

# Useful SQL commands
\dt                    # List tables
\d users              # Describe users table
SELECT * FROM posts;  # Query posts
```

### **Log Monitoring**
```bash
# Backend logs
cd backend/
npm start 2>&1 | tee backend.log

# Database logs
docker logs -f arcforge-postgres
```

### **Performance Testing**
```bash
# Test API response times
time curl http://localhost:3000/api/health

# Load test with ab (Apache Bench)
ab -n 100 -c 10 http://localhost:3000/api/forum/categories
```

## 🚀 Next Steps

After successful setup:
1. **Read [API Documentation](api/)** - Understand available endpoints
2. **Review [Testing Guide](testing.md)** - Learn testing procedures
3. **Explore [Architecture](../architecture/)** - Understand system design
4. **Check [Operations](../operations/)** - Learn deployment process

---

*This setup creates a full development environment identical to production, enabling confident local development and testing.*