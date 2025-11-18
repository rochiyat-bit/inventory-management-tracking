#!/bin/bash

# Database Setup Script for Inventory Management System
# This script will create database, run migrations, and seed data

set -e

echo "🚀 Starting Inventory Management System Database Setup..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created. Please edit it with your database credentials.${NC}"
    echo ""
    exit 1
fi

# Load environment variables
source .env

echo "📋 Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed or not in PATH${NC}"
    echo "Please install PostgreSQL first: https://www.postgresql.org/download/"
    exit 1
fi

# Test PostgreSQL connection
echo "🔍 Testing PostgreSQL connection..."
if psql -h $DB_HOST -U $DB_USER -d postgres -c '\q' 2>/dev/null; then
    echo -e "${GREEN}✅ PostgreSQL connection successful${NC}"
else
    echo -e "${RED}❌ Cannot connect to PostgreSQL${NC}"
    echo "Please check your database credentials in .env file"
    exit 1
fi

# Create database if it doesn't exist
echo ""
echo "🗄️  Checking if database exists..."
if psql -h $DB_HOST -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo -e "${YELLOW}⚠️  Database '$DB_NAME' already exists${NC}"
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Dropping existing database..."
        psql -h $DB_HOST -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
        echo "📦 Creating database '$DB_NAME'..."
        psql -h $DB_HOST -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"
        echo -e "${GREEN}✅ Database recreated${NC}"
    else
        echo "Continuing with existing database..."
    fi
else
    echo "📦 Creating database '$DB_NAME'..."
    psql -h $DB_HOST -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"
    echo -e "${GREEN}✅ Database created${NC}"
fi

echo ""
echo "🔄 Running database migrations..."
npm run db:migrate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migrations completed successfully${NC}"
else
    echo -e "${RED}❌ Migration failed${NC}"
    exit 1
fi

echo ""
read -p "Do you want to seed the database with demo data? (Y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    echo "🌱 Seeding database with demo data..."
    npm run db:seed

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database seeded successfully${NC}"
        echo ""
        echo "📝 Demo User Credentials:"
        echo "  Admin:   admin@inventory.com / Admin123!"
        echo "  Manager: manager@inventory.com / Manager123!"
        echo "  Staff:   staff@inventory.com / Staff123!"
    else
        echo -e "${RED}❌ Seeding failed${NC}"
        exit 1
    fi
fi

echo ""
echo "🎉 Database setup completed successfully!"
echo ""
echo "Next steps:"
echo "  1. Run 'npm run dev' to start the development server"
echo "  2. Open http://localhost:3000 in your browser"
echo "  3. Login with one of the demo accounts above"
echo ""
