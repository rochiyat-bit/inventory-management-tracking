@echo off
REM Database Setup Script for Windows
REM This script will create database, run migrations, and seed data

echo Starting Inventory Management System Database Setup...
echo.

REM Check if .env exists
if not exist .env (
    echo Warning: .env file not found. Creating from .env.example...
    copy .env.example .env
    echo .env file created. Please edit it with your database credentials.
    echo.
    exit /b 1
)

echo Database Configuration:
echo   Check your .env file for database settings
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: npm is not installed or not in PATH
    echo Please install Node.js from: https://nodejs.org/
    exit /b 1
)

echo Running database migrations...
call npm run db:migrate

if %ERRORLEVEL% NEQ 0 (
    echo Error: Migration failed
    exit /b 1
)

echo Migrations completed successfully
echo.

set /p SEED="Do you want to seed the database with demo data? (Y/n): "
if /i "%SEED%"=="n" goto :end

echo Seeding database with demo data...
call npm run db:seed

if %ERRORLEVEL% NEQ 0 (
    echo Error: Seeding failed
    exit /b 1
)

echo Database seeded successfully
echo.
echo Demo User Credentials:
echo   Admin:   admin@inventory.com / Admin123!
echo   Manager: manager@inventory.com / Manager123!
echo   Staff:   staff@inventory.com / Staff123!
echo.

:end
echo.
echo Database setup completed successfully!
echo.
echo Next steps:
echo   1. Run 'npm run dev' to start the development server
echo   2. Open http://localhost:3000 in your browser
echo   3. Login with one of the demo accounts above
echo.
pause
