# 🚀 Quick Start Guide

Get the Inventory Management System up and running in minutes!

## Prerequisites

- Node.js 18.17.0+ installed
- PostgreSQL 15+ installed and running
- npm 9.0.0+

## Step 1: Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd inventory-management-tracking

# Install dependencies
npm install
```

## Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
nano .env  # or use your favorite editor
```

**Minimum required settings:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=postgres
DB_PASSWORD=your-password
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=http://localhost:3000
```

## Step 3: Setup Database

### Option A: Automated Setup (Recommended)

**Linux/Mac:**
```bash
./scripts/setup-db.sh
```

**Windows:**
```bash
scripts\setup-db.bat
```

The script will:
- ✅ Create database
- ✅ Run all migrations
- ✅ Seed demo data
- ✅ Display demo credentials

### Option B: Manual Setup

```bash
# Create database
createdb inventory_db

# Or using psql
psql -U postgres
CREATE DATABASE inventory_db;
\q

# Run migrations
npm run db:migrate

# Seed demo data (optional)
npm run db:seed
```

## Step 4: Start Development Server

```bash
npm run dev
```

Server will start at: **http://localhost:3000**

## Step 5: Login

Navigate to: **http://localhost:3000/login**

**Demo Accounts:**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@inventory.com | Admin123! |
| Manager | manager@inventory.com | Manager123! |
| Staff | staff@inventory.com | Staff123! |

## 🎯 What's Included in Demo Data

After seeding, you'll have:

- **3 Users** with different roles
- **5 Categories**: Electronics, Furniture, Stationery, Tools, Clothing
- **22 Products** with unique barcodes
- **2 Warehouses**: Main Warehouse, Secondary Warehouse
- **Auto-generated Inventory** records for all products

## 📊 Sample Products

```
Electronics:
- Wireless Mouse Logitech M185 (SKU: ELEC-001, Barcode: 8991234567001)
- USB-C Hub 7-in-1 (SKU: ELEC-002)
- Mechanical Keyboard RGB (SKU: ELEC-003)
- Webcam Full HD 1080p (SKU: ELEC-004)
- External SSD 1TB (SKU: ELEC-005)

Furniture:
- Office Chair Ergonomic (SKU: FURN-001)
- Standing Desk Adjustable (SKU: FURN-002)
- Filing Cabinet 4-Drawer (SKU: FURN-003)
- Bookshelf 5-Tier (SKU: FURN-004)

Stationery:
- A4 Paper 80gsm (SKU: STAT-001)
- Ballpoint Pen Blue (SKU: STAT-002)
- Stapler Heavy Duty (SKU: STAT-003)
- Whiteboard Marker Set (SKU: STAT-004)
- Sticky Notes 3x3 (SKU: STAT-005)

...and more!
```

## 🔧 Useful Commands

### Database Commands

```bash
# Run migrations
npm run db:migrate

# Undo last migration
npm run db:migrate:undo

# Seed database
npm run db:seed

# Undo all seeds
npm run db:seed:undo

# Reset database (undo all, migrate, seed)
npm run db:reset
```

### Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type checking
npm run type-check

# Format code
npm run format

# Run tests
npm test
```

## 🧪 Testing the API

### Using curl

```bash
# Get all products (no auth required for GET)
curl http://localhost:3000/api/products

# Get products with search
curl "http://localhost:3000/api/products?search=mouse&page=1&limit=5"

# Get categories
curl http://localhost:3000/api/categories

# Get warehouses
curl http://localhost:3000/api/warehouses

# Get inventory
curl http://localhost:3000/api/inventory

# Get stock movements
curl http://localhost:3000/api/stock-movements
```

### Using Browser

Open these URLs in your browser:
- Products: http://localhost:3000/api/products
- Categories: http://localhost:3000/api/categories
- Warehouses: http://localhost:3000/api/warehouses
- Inventory: http://localhost:3000/api/inventory

## 📱 Access the Dashboard

After logging in, you'll see:

1. **Dashboard** - Statistics and quick actions
2. **Navigation** - Your name and role displayed
3. **Quick Links**:
   - Manage Products
   - Check Inventory
   - Stock Movements

## 🔐 Change Default Passwords

**⚠️ IMPORTANT:** Change all default passwords before deploying to production!

```sql
-- Connect to database
psql -d inventory_db

-- Update admin password
UPDATE users
SET password = '$2a$10$YOUR_NEW_HASHED_PASSWORD'
WHERE email = 'admin@inventory.com';
```

Or create a new admin user via the application (coming soon in UI).

## 🚨 Troubleshooting

### Database Connection Error

```bash
# Check if PostgreSQL is running
systemctl status postgresql  # Linux
brew services list  # Mac
# Services.msc -> PostgreSQL  # Windows

# Test connection
psql -U postgres -d inventory_db
```

### Migration Errors

```bash
# Check migration status
npx sequelize-cli db:migrate:status

# Undo and retry
npm run db:migrate:undo
npm run db:migrate
```

### Port Already in Use

```bash
# Change port in .env
PORT=3001

# Or kill process on port 3000
lsof -ti:3000 | xargs kill  # Mac/Linux
netstat -ano | findstr :3000  # Windows (find PID)
taskkill /PID <PID> /F  # Windows (kill process)
```

### npm install Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 📚 Next Steps

1. ✅ **Read the Documentation**
   - [Architecture](./docs/ARCHITECTURE.md)
   - [API Documentation](./docs/API.md)
   - [Database Schema](./docs/DATABASE_SCHEMA.md)
   - [Deployment Guide](./docs/DEPLOYMENT.md)

2. ✅ **Explore the Features**
   - Create new products
   - Manage inventory
   - Record stock movements
   - Generate reports

3. ✅ **Customize**
   - Add your company logo
   - Modify categories
   - Configure email notifications
   - Customize reports

4. ✅ **Deploy to Production**
   - Follow [DEPLOYMENT.md](./docs/DEPLOYMENT.md)
   - Use Vercel, Docker, or VPS
   - Setup SSL certificate
   - Configure backups

## 💡 Tips

- Use the **search** feature to quickly find products
- **Barcode** is auto-generated if not provided
- **Stock movements** use database transactions for data integrity
- **Audit logs** track all changes automatically
- **Soft deletes** allow data recovery

## 🆘 Need Help?

- Check [README.md](./README.md) for detailed setup
- Read [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for system overview
- Review [API.md](./docs/API.md) for API reference
- Open an issue on GitHub

---

**Ready to go! Happy inventory managing! 🎉**
