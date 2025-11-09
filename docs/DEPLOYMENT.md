# 🚀 Deployment Guide

Complete guide for deploying the Inventory Management System to production.

## Prerequisites

- Node.js 18.17.0 or higher
- PostgreSQL 15 or higher
- npm 9.0.0 or higher
- Git
- SSL certificate (for HTTPS)

---

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [Database Setup](#database-setup)
3. [Application Deployment](#application-deployment)
4. [Platform-Specific Guides](#platform-specific-guides)
5. [Post-Deployment](#post-deployment)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)

---

## Environment Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd inventory-management-tracking
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create `.env` file from template:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
DB_DIALECT=postgres

# NextAuth
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Application
NODE_ENV=production
PORT=3000

# Optional but recommended
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@your-domain.com
```

**Generate Secure Secrets:**

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate random password
openssl rand -base64 24
```

---

## Database Setup

### 1. Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE inventory_db;
CREATE USER inventory_user WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;

# Exit
\q
```

### 2. Run Migrations

```bash
npm run db:migrate
```

### 3. Seed Initial Data (Optional)

```bash
npm run db:seed
```

**Default Admin Credentials:**
- Email: `admin@inventory.com`
- Password: `Admin123!`

**⚠️ IMPORTANT:** Change default passwords immediately after first login!

### 4. Verify Database

```bash
psql -U inventory_user -d inventory_db -c "\dt"
```

You should see 7 tables:
- users
- categories
- warehouses
- products
- inventories
- stock_movements
- audit_logs

---

## Application Deployment

### Option 1: Vercel (Recommended)

#### Prerequisites
- Vercel account
- PostgreSQL database (Neon, Supabase, or AWS RDS)

#### Steps

1. **Install Vercel CLI:**

```bash
npm install -g vercel
```

2. **Login to Vercel:**

```bash
vercel login
```

3. **Configure Project:**

```bash
vercel
```

Follow the prompts to:
- Link to existing project or create new
- Set project name
- Select framework (Next.js)

4. **Add Environment Variables:**

Go to Vercel Dashboard → Project → Settings → Environment Variables

Add all variables from `.env`:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- etc.

5. **Deploy:**

```bash
vercel --prod
```

6. **Run Migrations:**

```bash
# Connect to your production database
npm run db:migrate
```

#### Vercel Configuration

Create `vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["sin1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

---

### Option 2: Docker

#### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild source code when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: inventory_db
      POSTGRES_USER: inventory_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    restart: always
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NODE_ENV=production
    depends_on:
      - db

volumes:
  postgres_data:
```

#### Deploy with Docker

```bash
# Build and start
docker-compose up -d

# Run migrations
docker-compose exec app npm run db:migrate

# View logs
docker-compose logs -f app

# Stop
docker-compose down
```

---

### Option 3: VPS (Ubuntu/Debian)

#### 1. Install Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2
sudo npm install -g pm2
```

#### 2. Setup PostgreSQL

```bash
sudo -u postgres psql
CREATE DATABASE inventory_db;
CREATE USER inventory_user WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;
\q
```

#### 3. Deploy Application

```bash
# Clone repository
git clone <repository-url>
cd inventory-management-tracking

# Install dependencies
npm install

# Setup environment
cp .env.example .env
nano .env  # Edit with your values

# Build application
npm run build

# Run migrations
npm run db:migrate
```

#### 4. Start with PM2

```bash
# Start application
pm2 start npm --name "inventory-app" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup

# Monitor
pm2 monit
```

#### 5. Setup Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/inventory
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/inventory /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### 6. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo systemctl status certbot.timer
```

---

## Platform-Specific Guides

### AWS Elastic Beanstalk

1. Install EB CLI:
```bash
pip install awsebcli
```

2. Initialize:
```bash
eb init -p node.js-18 inventory-app
```

3. Create environment:
```bash
eb create inventory-production
```

4. Deploy:
```bash
eb deploy
```

### Heroku

1. Install Heroku CLI
2. Login:
```bash
heroku login
```

3. Create app:
```bash
heroku create inventory-app
```

4. Add PostgreSQL:
```bash
heroku addons:create heroku-postgresql:standard-0
```

5. Set environment variables:
```bash
heroku config:set NEXTAUTH_SECRET=your-secret
```

6. Deploy:
```bash
git push heroku main
```

7. Run migrations:
```bash
heroku run npm run db:migrate
```

---

## Post-Deployment

### 1. Verify Deployment

```bash
# Check application health
curl https://your-domain.com/api/health

# Check database connection
npm run db:migrate -- --check
```

### 2. Security Checklist

- ✅ Change all default passwords
- ✅ Enable HTTPS/SSL
- ✅ Configure CORS properly
- ✅ Setup rate limiting
- ✅ Enable security headers
- ✅ Review environment variables
- ✅ Setup database backups
- ✅ Configure firewall rules
- ✅ Enable audit logging
- ✅ Test authentication

### 3. Create Admin User (if not using seeds)

```bash
# Connect to database
psql $DATABASE_URL

# Insert admin user (password: Admin123!)
INSERT INTO users (id, email, password, name, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@yourdomain.com',
  '$2a$10$...',  -- bcrypt hash of your password
  'System Administrator',
  'admin',
  NOW(),
  NOW()
);
```

### 4. Performance Optimization

```javascript
// next.config.ts
export default {
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  productionBrowserSourceMaps: false,
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    formats: ['image/webp'],
  },
};
```

---

## Monitoring

### Application Monitoring

```bash
# PM2 monitoring
pm2 monit

# PM2 logs
pm2 logs inventory-app

# PM2 status
pm2 status
```

### Database Monitoring

```sql
-- Active connections
SELECT count(*) FROM pg_stat_activity;

-- Table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Setup Alerts

- Database connection errors
- High CPU/memory usage
- Failed login attempts
- Low disk space
- Application errors

---

## Backup & Recovery

### Database Backup

```bash
# Manual backup
pg_dump -U inventory_user -d inventory_db -F c -f backup_$(date +%Y%m%d).dump

# Automated daily backup (cron)
0 2 * * * pg_dump -U inventory_user -d inventory_db -F c -f /backups/backup_$(date +\%Y\%m\%d).dump
```

### Restore Database

```bash
# Restore from backup
pg_restore -U inventory_user -d inventory_db -c backup_20240101.dump
```

### Application Backup

```bash
# Backup uploads
tar -czf uploads_backup.tar.gz public/uploads/

# Backup environment
cp .env .env.backup
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Error

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql $DATABASE_URL

# Check firewall
sudo ufw status
```

#### 2. Build Failures

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

#### 3. Migration Errors

```bash
# Check migration status
npx sequelize-cli db:migrate:status

# Rollback and retry
npm run db:migrate:undo
npm run db:migrate
```

#### 4. High Memory Usage

```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm start

# Monitor memory
pm2 monit
```

### Logs Location

- **Application**: `pm2 logs inventory-app`
- **Nginx**: `/var/log/nginx/error.log`
- **PostgreSQL**: `/var/log/postgresql/`
- **System**: `journalctl -u inventory-app`

---

## Maintenance

### Regular Tasks

**Daily:**
- Check application logs
- Monitor database size
- Review security logs

**Weekly:**
- Review performance metrics
- Check backup integrity
- Update dependencies (dev)

**Monthly:**
- Security patches
- Database optimization
- Performance review
- Test disaster recovery

### Updates

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build
npm run build

# Run migrations
npm run db:migrate

# Restart application
pm2 restart inventory-app
```

---

## Support

For issues or questions:
- GitHub Issues: <repository-url>/issues
- Documentation: [README.md](../README.md)
- Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)
- API Docs: [API.md](./API.md)

---

**Last Updated:** 2024
**Version:** 1.0.0
