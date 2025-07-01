# ARCFORGE LOCAL DEVELOPMENT SETUP

## Prerequisites
- Node.js and npm installed
- Docker installed and running

## Backend Setup

### 1. Install Dependencies
```bash
cd backend/
npm install
```

### 2. PostgreSQL Database (Docker)
```bash
# Start PostgreSQL container
docker run --name arcforge-postgres -e POSTGRES_PASSWORD=heavy_duty_123 -p 5432:5432 -d postgres

# Connect to database
docker exec -it arcforge-postgres psql -U postgres

# Create database and user
CREATE DATABASE arcforge_db;
CREATE USER arcforge WITH PASSWORD 'heavy_duty_123';
GRANT ALL PRIVILEGES ON DATABASE arcforge_db TO arcforge;

# Grant table creation permissions
\c arcforge_db
GRANT ALL PRIVILEGES ON SCHEMA public TO arcforge;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO arcforge;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO arcforge;
\q
```

### 3. Create Database Tables
```bash
cd backend/
node scripts/createTables.js
```
Should output:
```
✅ Connected to PostgreSQL database
✅ Users table created successfully
```

### 4. Environment Configuration
Create `backend/.env` with:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=arcforge_db
DB_USER=arcforge
DB_PASSWORD=heavy_duty_123
JWT_SECRET=heavy_duty_fortress_secret_key_2025
PORT=5000
```

### 5. Start Development Server
```bash
cd backend/
node server.js
```

### 6. Test API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Login test
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"test123"}'

# Signup test
curl -X POST http://localhost:5000/api/auth/signup -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"test123"}'
```

## Stopping/Restarting

### Stop Database
```bash
docker stop arcforge-postgres
```

### Restart Database
```bash
docker start arcforge-postgres
```

### Remove Database (clean start)
```bash
docker stop arcforge-postgres
docker rm arcforge-postgres
# Then run the "Start PostgreSQL container" command again
```

## Troubleshooting

### Port 5432 Already in Use
```bash
# Check what's using port 5432
sudo ss -tlnp | grep 5432

# Stop other PostgreSQL containers
docker ps | grep postgres
docker stop <container_name>
```

### Can't Connect to Database
- Ensure Docker container is running: `docker ps`
- Check logs: `docker logs arcforge-postgres`
- Verify .env file exists and has correct credentials

---

*This setup creates a complete local development environment for ARCFORGE backend development.*