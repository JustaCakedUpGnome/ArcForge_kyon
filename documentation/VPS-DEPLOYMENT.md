# VPS DEPLOYMENT GUIDE

## Overview
Deployment strategy for ARCFORGE on a $3.50/month VPS (512MB RAM, 10GB storage) running Debian. This guide prioritizes resource efficiency and security for a production environment.

## Server Specifications
- **Provider**: VPS (Vultr/DigitalOcean/Linode recommended)
- **OS**: Debian 12 (following LandChad recommendations)
- **RAM**: 512MB (limited - requires optimization)
- **Storage**: 10GB (sufficient for current needs)
- **CPU**: 1 vCPU (adequate for light traffic)

## Resource Optimization Strategy

### Database Choice: Native PostgreSQL (Not Docker)
**Reasoning**: Docker adds ~100MB overhead on 512MB system
```bash
# Install PostgreSQL directly on Debian
apt update
apt install postgresql postgresql-contrib

# Start and enable PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Create production database and user
sudo -u postgres psql
CREATE DATABASE arcforge_production;
CREATE USER arcforge_prod WITH PASSWORD 'strong_production_password';
GRANT ALL PRIVILEGES ON DATABASE arcforge_production TO arcforge_prod;
GRANT ALL ON SCHEMA public TO arcforge_prod;
\q
```

### Node.js Process Management: PM2
**Reasoning**: Better than Docker for single-app deployment, includes monitoring
```bash
# Install Node.js (use NodeSource repository for latest)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Deploy application
git clone https://github.com/your-username/arcForgeSite.git
cd arcForgeSite
npm ci --production

# Start with PM2
pm2 start backend/server.js --name arcforge
pm2 startup  # Configure auto-restart on boot
pm2 save     # Save current process list
```

### Web Server: Nginx Reverse Proxy
**Reasoning**: Handle static files, SSL termination, reduce Node.js load
```bash
# Install Nginx
apt install nginx

# Configuration: /etc/nginx/sites-available/arcforge
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Serve static files directly
    location / {
        root /home/user/arcForgeSite;
        try_files $uri $uri/ @backend;
    }
    
    # Proxy API requests to Node.js
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Fallback to Node.js for SPA routing
    location @backend {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
ln -s /etc/nginx/sites-available/arcforge /etc/nginx/sites-enabled/
nginx -t  # Test configuration
systemctl restart nginx
```

## Environment Configuration

### Production Environment Variables
**Location**: `/home/user/arcForgeSite/.env`
```bash
# Database (different from local)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=arcforge_production
DB_USER=arcforge_prod
DB_PASSWORD=strong_production_password_here

# JWT (stronger secret for production)
JWT_SECRET=production_jwt_secret_much_longer_than_local_version

# Server
NODE_ENV=production
PORT=5000

# Optional: Logging
LOG_LEVEL=info
LOG_FILE=/var/log/arcforge/app.log
```

### Local vs Production Differences
| Setting | Local (Docker) | Production (Native) |
|---------|----------------|---------------------|
| DB_HOST | localhost | localhost |
| DB_NAME | arcforge_db | arcforge_production |
| DB_USER | arcforge | arcforge_prod |
| JWT_SECRET | dev_secret | long_production_secret |
| NODE_ENV | development | production |

## Security Hardening

### Firewall Configuration (UFW)
```bash
# Install and configure UFW
apt install ufw

# Default policies
ufw default deny incoming
ufw default allow outgoing

# Allow essential services
ufw allow ssh              # SSH (port 22)
ufw allow http             # HTTP (port 80)
ufw allow https            # HTTPS (port 443)

# Optional: Direct database access (only if needed)
# ufw allow 5432/tcp

# Enable firewall
ufw enable
ufw status verbose
```

### SSH Security
```bash
# Edit SSH configuration
nano /etc/ssh/sshd_config

# Recommended settings:
Port 22                    # Consider changing to non-standard port
PermitRootLogin no        # Disable root login
PasswordAuthentication no # Use SSH keys only
PubkeyAuthentication yes  # Enable SSH key authentication

# Restart SSH
systemctl restart sshd
```

### Fail2ban Protection
```bash
# Install fail2ban
apt install fail2ban

# Create local configuration
nano /etc/fail2ban/jail.local

[DEFAULT]
bantime = 3600          # 1 hour ban
findtime = 600          # 10 minute window
maxretry = 3            # 3 attempts before ban

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

# Start fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

### SSL/TLS Certificates (Let's Encrypt)
```bash
# Install Certbot
apt install certbot python3-certbot-nginx

# Obtain certificates
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (should be automatic, verify with)
certbot renew --dry-run

# Check renewal timer
systemctl status certbot.timer
```

### Database Security
```bash
# PostgreSQL configuration hardening
nano /etc/postgresql/13/main/postgresql.conf

# Restrict connections
listen_addresses = 'localhost'     # Only local connections
max_connections = 20               # Limit connections (save RAM)
shared_buffers = 64MB              # Optimize for 512MB system

# Edit pg_hba.conf for authentication
nano /etc/postgresql/13/main/pg_hba.conf

# Use md5 authentication, remove trust
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5

# Restart PostgreSQL
systemctl restart postgresql
```

## Deployment Workflow

### Initial Deployment
```bash
# 1. Server preparation
apt update && apt upgrade -y
adduser arcforge  # Create non-root user
usermod -aG sudo arcforge

# 2. Install dependencies
# (PostgreSQL, Node.js, Nginx, PM2 - see sections above)

# 3. Clone and setup application
su - arcforge
git clone https://github.com/your-username/arcForgeSite.git
cd arcForgeSite
npm ci --production

# 4. Database setup
createdb arcforge_production -U arcforge_prod
psql -U arcforge_prod -d arcforge_production -f backend/scripts/createTables.sql

# 5. Configure environment
cp .env.example .env
nano .env  # Edit with production values

# 6. Start application
pm2 start backend/server.js --name arcforge
pm2 startup
pm2 save

# 7. Configure Nginx (see section above)
```

### Continuous Deployment
```bash
# Create deployment script: deploy.sh
#!/bin/bash
cd /home/arcforge/arcForgeSite
git pull origin main
npm ci --production
pm2 restart arcforge
pm2 logs arcforge --lines 50

# Make executable
chmod +x deploy.sh

# Deploy updates
./deploy.sh
```

## Monitoring and Maintenance

### Application Monitoring
```bash
# PM2 monitoring
pm2 status
pm2 logs arcforge
pm2 monit

# System monitoring
htop              # CPU/RAM usage
df -h             # Disk usage
journalctl -f     # System logs
```

### Database Maintenance
```bash
# Regular backups
pg_dump -U arcforge_prod arcforge_production > backup_$(date +%Y%m%d).sql

# Weekly cleanup script
#!/bin/bash
# vacuum_analyze.sh
psql -U arcforge_prod -d arcforge_production -c "VACUUM ANALYZE;"

# Add to crontab
crontab -e
0 2 * * 0 /home/arcforge/vacuum_analyze.sh
```

### Performance Optimization
```bash
# Node.js optimization in PM2
pm2 start backend/server.js --name arcforge \
  --node-args="--max-old-space-size=256" \
  --instances 1 \
  --max-memory-restart 300M

# Nginx gzip compression
nano /etc/nginx/nginx.conf
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

## Backup Strategy

### Database Backups
```bash
# Daily automated backups
nano /home/arcforge/backup_db.sh

#!/bin/bash
BACKUP_DIR="/home/arcforge/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U arcforge_prod arcforge_production > $BACKUP_DIR/arcforge_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "arcforge_*.sql" -mtime +7 -delete

# Add to crontab for daily backups
crontab -e
0 3 * * * /home/arcforge/backup_db.sh
```

### Application Backups
```bash
# Code backup (automated via Git)
# Environment backup
cp .env /home/arcforge/backups/env_backup_$(date +%Y%m%d)

# PM2 configuration backup
pm2 save
cp ~/.pm2/dump.pm2 /home/arcforge/backups/
```

## Troubleshooting

### Common Issues

**High Memory Usage**
```bash
# Check processes
ps aux --sort=-%mem | head
# Optimize PostgreSQL
nano /etc/postgresql/13/main/postgresql.conf
# Reduce shared_buffers, work_mem
```

**Database Connection Issues**
```bash
# Check PostgreSQL status
systemctl status postgresql
# Check connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
```

**Application Crashes**
```bash
# Check PM2 logs
pm2 logs arcforge --lines 100
# Check system logs
journalctl -u nginx -f
```

### Performance Monitoring
```bash
# Monitor resource usage
watch -n 1 'free -m && df -h && ps aux --sort=-%cpu | head -5'

# Monitor PostgreSQL performance
sudo -u postgres psql -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

## Cost Optimization

### Resource Limits
- **RAM**: Target <400MB total usage (leave buffer for OS)
- **CPU**: Monitor with `htop`, optimize queries if high usage
- **Storage**: Monitor with `df -h`, implement log rotation
- **Network**: Gzip compression, CDN for assets (future)

### Scaling Considerations
- **Vertical scaling**: Upgrade VPS if consistently hitting limits
- **Horizontal scaling**: Add read replica, load balancer (future)
- **CDN**: CloudFlare free tier for static assets
- **Database**: Consider managed PostgreSQL if growth demands

## Next Steps After Deployment

1. **DNS Configuration**: Point domain to VPS IP
2. **SSL Certificate**: Let's Encrypt setup
3. **Monitoring**: Setup basic monitoring (UptimeRobot, etc.)
4. **Backup Testing**: Verify backup restoration process
5. **Performance Baseline**: Document initial performance metrics
6. **Documentation**: Update with actual domain/IPs used

---

*This deployment guide prioritizes security, performance, and cost-effectiveness for a small VPS environment while maintaining professional production standards.*