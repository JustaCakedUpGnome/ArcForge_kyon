# Monitoring and Alerting

> Real-time monitoring, health checks, and alerting for ARCFORGE production environment

**Tags:** #monitoring #alerting #health-checks #observability

## 🎯 Monitoring Overview

ARCFORGE implements comprehensive monitoring to ensure high availability and performance on cost-effective VPS infrastructure.

```mermaid
graph TB
    subgraph "Monitoring Stack"
        subgraph "Application Monitoring"
            PM2[⚡ PM2 Monitoring]
            Logs[📝 Application Logs]
            Health[❤️ Health Checks]
        end
        
        subgraph "System Monitoring"
            System[🖥️ System Metrics]
            Disk[💾 Disk Usage]
            Memory[🧠 Memory Usage]
            CPU[⚙️ CPU Usage]
        end
        
        subgraph "Service Monitoring"
            nginx[🔧 nginx Status]
            PostgreSQL[🐘 PostgreSQL]
            Network[🌐 Network]
        end
        
        subgraph "External Monitoring"
            Uptime[📡 Uptime Monitoring]
            SSL[🔐 SSL Certificate]
            DNS[🌐 DNS Resolution]
        end
    end
    
    subgraph "Alerting Channels"
        Email[📧 Email Alerts]
        Discord[💬 Discord Webhook]
        SMS[📱 SMS (Optional)]
    end
    
    PM2 --> Health
    System --> Health
    nginx --> Health
    PostgreSQL --> Health
    Health --> Email
    Health --> Discord
    Uptime --> Email
    
    style Health fill:#38a169,stroke:#48bb78,color:#e2e8f0
    style Email fill:#e53e3e,stroke:#f56565,color:#e2e8f0
    style Discord fill:#5865f2,stroke:#4f46e5,color:#e2e8f0
```

## 📊 System Health Monitoring

### **Health Check Script**
```bash
#!/bin/bash
# /opt/scripts/health-check.sh

# Configuration
HEALTH_LOG="/var/log/health-check.log"
ALERT_EMAIL="admin@arcforge.tech"
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/YOUR_WEBHOOK_URL"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to log with timestamp
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$HEALTH_LOG"
}

# Function to send Discord alert
send_discord_alert() {
    local message="$1"
    local color="$2"
    
    curl -H "Content-Type: application/json" \
         -X POST \
         -d "{\"embeds\":[{\"title\":\"🚨 ARCFORGE Alert\",\"description\":\"$message\",\"color\":$color}]}" \
         "$DISCORD_WEBHOOK_URL" 2>/dev/null
}

# Health check functions
check_nginx() {
    if systemctl is-active --quiet nginx; then
        log_message "${GREEN}✅ nginx: Running${NC}"
        return 0
    else
        log_message "${RED}❌ nginx: Not running${NC}"
        send_discord_alert "nginx service is down!" "15158332"
        return 1
    fi
}

check_postgresql() {
    if systemctl is-active --quiet postgresql; then
        log_message "${GREEN}✅ PostgreSQL: Running${NC}"
        return 0
    else
        log_message "${RED}❌ PostgreSQL: Not running${NC}"
        send_discord_alert "PostgreSQL service is down!" "15158332"
        return 1
    fi
}

check_application() {
    if pm2 describe arcforge > /dev/null 2>&1; then
        local status=$(pm2 describe arcforge | grep -o "status.*" | head -1)
        if echo "$status" | grep -q "online"; then
            log_message "${GREEN}✅ ARCFORGE App: Running${NC}"
            return 0
        else
            log_message "${RED}❌ ARCFORGE App: Not online${NC}"
            send_discord_alert "ARCFORGE application is not online!" "15158332"
            return 1
        fi
    else
        log_message "${RED}❌ ARCFORGE App: Not found in PM2${NC}"
        send_discord_alert "ARCFORGE application not found in PM2!" "15158332"
        return 1
    fi
}

check_api_health() {
    local health_url="http://localhost:3000/api/health"
    if curl -sf "$health_url" > /dev/null 2>&1; then
        log_message "${GREEN}✅ API Health: Responding${NC}"
        return 0
    else
        log_message "${RED}❌ API Health: Not responding${NC}"
        send_discord_alert "API health check failed!" "15158332"
        return 1
    fi
}

check_disk_usage() {
    local usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$usage" -gt 90 ]; then
        log_message "${RED}❌ Disk Usage: ${usage}% (Critical)${NC}"
        send_discord_alert "Disk usage critical: ${usage}%" "15158332"
        return 1
    elif [ "$usage" -gt 80 ]; then
        log_message "${YELLOW}⚠️ Disk Usage: ${usage}% (Warning)${NC}"
        send_discord_alert "Disk usage warning: ${usage}%" "16776960"
        return 1
    else
        log_message "${GREEN}✅ Disk Usage: ${usage}%${NC}"
        return 0
    fi
}

check_memory_usage() {
    local usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    if [ "$usage" -gt 90 ]; then
        log_message "${RED}❌ Memory Usage: ${usage}% (Critical)${NC}"
        send_discord_alert "Memory usage critical: ${usage}%" "15158332"
        return 1
    elif [ "$usage" -gt 80 ]; then
        log_message "${YELLOW}⚠️ Memory Usage: ${usage}% (Warning)${NC}"
        send_discord_alert "Memory usage warning: ${usage}%" "16776960"
        return 1
    else
        log_message "${GREEN}✅ Memory Usage: ${usage}%${NC}"
        return 0
    fi
}

check_ssl_certificate() {
    local domain="arcforge.tech"
    local expiry_date=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
    local expiry_epoch=$(date -d "$expiry_date" +%s)
    local current_epoch=$(date +%s)
    local days_until_expiry=$(( (expiry_epoch - current_epoch) / 86400 ))
    
    if [ "$days_until_expiry" -lt 7 ]; then
        log_message "${RED}❌ SSL Certificate: Expires in ${days_until_expiry} days${NC}"
        send_discord_alert "SSL certificate expires in ${days_until_expiry} days!" "15158332"
        return 1
    elif [ "$days_until_expiry" -lt 30 ]; then
        log_message "${YELLOW}⚠️ SSL Certificate: Expires in ${days_until_expiry} days${NC}"
        send_discord_alert "SSL certificate expires in ${days_until_expiry} days" "16776960"
        return 1
    else
        log_message "${GREEN}✅ SSL Certificate: Valid for ${days_until_expiry} days${NC}"
        return 0
    fi
}

# Main health check execution
main() {
    log_message "🔍 Starting health check..."
    
    local failures=0
    
    check_nginx || ((failures++))
    check_postgresql || ((failures++))
    check_application || ((failures++))
    check_api_health || ((failures++))
    check_disk_usage || ((failures++))
    check_memory_usage || ((failures++))
    check_ssl_certificate || ((failures++))
    
    if [ $failures -eq 0 ]; then
        log_message "${GREEN}✅ All health checks passed${NC}"
        echo "OK: All systems operational"
        exit 0
    else
        log_message "${RED}❌ $failures health check(s) failed${NC}"
        echo "CRITICAL: $failures system(s) need attention"
        exit 2
    fi
}

# Run main function
main "$@"
```

### **Performance Monitoring Script**
```bash
#!/bin/bash
# /opt/scripts/performance-monitor.sh

# Configuration
PERF_LOG="/var/log/performance.log"
THRESHOLD_RESPONSE_TIME=2000  # milliseconds
THRESHOLD_ERROR_RATE=5        # percentage

# Function to test API response time
test_api_performance() {
    local endpoint="$1"
    local response_time=$(curl -o /dev/null -s -w "%{time_total}" "http://localhost:3000$endpoint" | awk '{print $1 * 1000}')
    echo "$response_time"
}

# Function to get error rate from nginx logs
get_error_rate() {
    local total_requests=$(tail -n 1000 /var/log/nginx/access.log | wc -l)
    local error_requests=$(tail -n 1000 /var/log/nginx/access.log | grep -E " [45][0-9]{2} " | wc -l)
    
    if [ $total_requests -gt 0 ]; then
        local error_rate=$(echo "scale=2; $error_requests * 100 / $total_requests" | bc)
        echo "$error_rate"
    else
        echo "0"
    fi
}

# Main performance monitoring
main() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Test critical endpoints
    local auth_response=$(test_api_performance "/api/auth/verify")
    local forum_response=$(test_api_performance "/api/forum/categories")
    local health_response=$(test_api_performance "/api/health")
    
    # Get error rate
    local error_rate=$(get_error_rate)
    
    # Log performance metrics
    echo "$timestamp,auth_api,$auth_response,forum_api,$forum_response,health_api,$health_response,error_rate,$error_rate" >> "$PERF_LOG"
    
    # Check thresholds and alert if needed
    if (( $(echo "$auth_response > $THRESHOLD_RESPONSE_TIME" | bc -l) )); then
        echo "⚠️ Auth API response time: ${auth_response}ms (threshold: ${THRESHOLD_RESPONSE_TIME}ms)"
    fi
    
    if (( $(echo "$error_rate > $THRESHOLD_ERROR_RATE" | bc -l) )); then
        echo "⚠️ Error rate: ${error_rate}% (threshold: ${THRESHOLD_ERROR_RATE}%)"
    fi
}

main "$@"
```

## 🔧 PM2 Monitoring

### **PM2 Configuration for Monitoring**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'arcforge',
    script: './backend/server.js',
    cwd: '/var/www/arcforge',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    
    // Monitoring configuration
    monitoring: true,
    pmx: true,
    
    // Auto-restart configuration
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '200M',
    
    // Logging configuration
    error_file: '/var/log/pm2/arcforge-error.log',
    out_file: '/var/log/pm2/arcforge-out.log',
    log_file: '/var/log/pm2/arcforge.log',
    time: true,
    
    // Health check configuration
    health_check_grace_period: 3000,
    health_check_fatal_exceptions: true
  }]
};
```

### **PM2 Monitoring Commands**
```bash
# Real-time monitoring dashboard
pm2 monit

# Process status
pm2 status

# Application logs
pm2 logs arcforge --lines 50

# Performance metrics
pm2 describe arcforge

# Memory usage over time
pm2 logs arcforge --raw | grep "Memory usage"

# Restart history
pm2 logs arcforge --raw | grep "restart"
```

## 📈 Log Management

### **Log Rotation Configuration**
```bash
# /etc/logrotate.d/arcforge
/var/log/pm2/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}

/var/log/health-check.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
}

/var/log/performance.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
}
```

### **Log Analysis Scripts**
```bash
#!/bin/bash
# /opt/scripts/log-analysis.sh

# Analyze error patterns
analyze_errors() {
    echo "=== Error Analysis (Last 24 hours) ==="
    grep "ERROR" /var/log/pm2/arcforge-error.log | tail -50
    
    echo "=== Most Common Errors ==="
    grep "ERROR" /var/log/pm2/arcforge-error.log | awk '{print $4}' | sort | uniq -c | sort -nr | head -10
}

# Analyze response times
analyze_performance() {
    echo "=== Performance Analysis ==="
    tail -100 /var/log/performance.log | awk -F',' '{print $4}' | sort -n | tail -10
}

# Analyze traffic patterns
analyze_traffic() {
    echo "=== Traffic Analysis (Last 1000 requests) ==="
    tail -1000 /var/log/nginx/access.log | awk '{print $7}' | sort | uniq -c | sort -nr | head -10
}

# Main execution
main() {
    analyze_errors
    echo ""
    analyze_performance
    echo ""
    analyze_traffic
}

main "$@"
```

## 🚨 Alerting System

### **Discord Webhook Integration**
```javascript
// /opt/scripts/discord-notifier.js
const https = require('https');

class DiscordNotifier {
    constructor(webhookUrl) {
        this.webhookUrl = webhookUrl;
    }
    
    async sendAlert(title, message, color = 'red') {
        const colors = {
            red: 15158332,
            yellow: 16776960,
            green: 65280
        };
        
        const payload = {
            embeds: [{
                title: `🚨 ${title}`,
                description: message,
                color: colors[color] || colors.red,
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'ARCFORGE Monitoring'
                }
            }]
        };
        
        try {
            await this.makeRequest(payload);
            console.log('Alert sent successfully');
        } catch (error) {
            console.error('Failed to send alert:', error);
        }
    }
    
    makeRequest(payload) {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(payload);
            const url = new URL(this.webhookUrl);
            
            const options = {
                hostname: url.hostname,
                path: url.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            };
            
            const req = https.request(options, (res) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve();
                } else {
                    reject(new Error(`HTTP ${res.statusCode}`));
                }
            });
            
            req.on('error', reject);
            req.write(data);
            req.end();
        });
    }
}

// Usage example
if (require.main === module) {
    const notifier = new DiscordNotifier(process.env.DISCORD_WEBHOOK_URL);
    const [title, message, color] = process.argv.slice(2);
    
    notifier.sendAlert(title, message, color);
}

module.exports = DiscordNotifier;
```

## 🕐 Cron Job Configuration

### **Monitoring Schedule**
```bash
# Edit crontab
crontab -e

# Health checks every 5 minutes
*/5 * * * * /opt/scripts/health-check.sh >> /var/log/health-check.log 2>&1

# Performance monitoring every 15 minutes
*/15 * * * * /opt/scripts/performance-monitor.sh

# Daily log analysis
0 6 * * * /opt/scripts/log-analysis.sh | mail -s "Daily ARCFORGE Report" admin@arcforge.tech

# Weekly performance report
0 9 * * 1 /opt/scripts/weekly-report.sh

# SSL certificate check (daily)
0 8 * * * /opt/scripts/ssl-check.sh
```

## 📊 Metrics Dashboard

### **Simple Metrics Collection**
```bash
#!/bin/bash
# /opt/scripts/collect-metrics.sh

# Collect system metrics
collect_metrics() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
    local memory_usage=$(free | awk 'NR==2{printf "%.1f", $3*100/$2}')
    local disk_usage=$(df / | awk 'NR==2{print $5}' | sed 's/%//')
    local load_avg=$(uptime | awk -F'load average:' '{print $2}' | cut -d',' -f1 | xargs)
    
    # Application metrics
    local pm2_memory=$(pm2 describe arcforge | grep memory | awk '{print $4}')
    local pm2_cpu=$(pm2 describe arcforge | grep cpu | awk '{print $4}')
    
    # Log to metrics file
    echo "$timestamp,$cpu_usage,$memory_usage,$disk_usage,$load_avg,$pm2_memory,$pm2_cpu" >> /var/log/metrics.csv
}

collect_metrics
```

## 🔄 Automated Recovery

### **Auto-Recovery Script**
```bash
#!/bin/bash
# /opt/scripts/auto-recovery.sh

# Recovery functions
restart_nginx() {
    echo "Attempting to restart nginx..."
    systemctl restart nginx
    sleep 5
    if systemctl is-active --quiet nginx; then
        echo "✅ nginx restarted successfully"
        return 0
    else
        echo "❌ Failed to restart nginx"
        return 1
    fi
}

restart_postgresql() {
    echo "Attempting to restart PostgreSQL..."
    systemctl restart postgresql
    sleep 10
    if systemctl is-active --quiet postgresql; then
        echo "✅ PostgreSQL restarted successfully"
        return 0
    else
        echo "❌ Failed to restart PostgreSQL"
        return 1
    fi
}

restart_application() {
    echo "Attempting to restart ARCFORGE application..."
    pm2 restart arcforge
    sleep 5
    if pm2 describe arcforge | grep -q "online"; then
        echo "✅ ARCFORGE application restarted successfully"
        return 0
    else
        echo "❌ Failed to restart ARCFORGE application"
        return 1
    fi
}

# Main recovery logic
main() {
    local service="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo "$timestamp - Starting auto-recovery for $service"
    
    case "$service" in
        nginx)
            restart_nginx
            ;;
        postgresql)
            restart_postgresql
            ;;
        arcforge)
            restart_application
            ;;
        *)
            echo "Unknown service: $service"
            exit 1
            ;;
    esac
}

main "$@"
```

## 🔍 Troubleshooting Guide

### **Common Issues and Solutions**

#### **High Memory Usage**
```bash
# Check memory usage
free -h
pm2 monit

# Restart application if needed
pm2 restart arcforge

# Check for memory leaks
pm2 logs arcforge | grep -i "memory\|leak\|out of memory"
```

#### **API Response Time Issues**
```bash
# Check API performance
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:3000/api/health"

# Check database connections
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"

# Analyze slow queries
sudo -u postgres psql -c "SELECT query, calls, total_time, mean_time FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

#### **Disk Space Issues**
```bash
# Check disk usage
df -h
du -sh /var/log/* | sort -hr

# Clean up logs
/opt/scripts/cleanup-logs.sh

# Rotate logs manually
logrotate -f /etc/logrotate.d/arcforge
```

---

*This monitoring system provides comprehensive observability for ARCFORGE production environment with automated alerting and recovery capabilities.*