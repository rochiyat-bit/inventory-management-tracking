# 📦 Inventory Management System

Production-ready inventory management system with barcode tracking, built with Next.js 14+, Sequelize, and PostgreSQL.

## 🚀 Features

- ✅ **Authentication & Authorization** - NextAuth.js v5 with role-based access control
- ✅ **Product Management** - Complete CRUD operations with image upload
- ✅ **Barcode Integration** - Scanner and generator with EAN-13 support
- ✅ **Multi-Warehouse Support** - Track inventory across multiple locations
- ✅ **Stock Tracking** - Real-time stock levels with movement history
- ✅ **Audit Trail** - Complete logging of all system changes
- ✅ **Reporting & Analytics** - Comprehensive reports with export functionality
- ✅ **Responsive Design** - Modern UI with shadcn/ui components

## 🛠️ Tech Stack

- **Frontend & Backend**: Next.js 14+ (App Router)
- **ORM**: Sequelize 6+
- **Database**: PostgreSQL 15+
- **Styling**: Tailwind CSS + shadcn/ui
- **Barcode**: react-barcode-reader, jsbarcode
- **Auth**: NextAuth.js v5
- **Validation**: Zod
- **Testing**: Jest + React Testing Library

## 📁 Project Structure

```
/inventory-management-tracking
├── /src
│   ├── /app                      # Next.js App Router
│   │   ├── /api                 # API Routes
│   │   │   ├── /auth           # Authentication endpoints
│   │   │   ├── /products       # Product CRUD
│   │   │   ├── /categories     # Category management
│   │   │   ├── /inventory      # Inventory tracking
│   │   │   ├── /warehouses     # Warehouse management
│   │   │   ├── /stock-movements # Stock tracking
│   │   │   └── /reports        # Reporting endpoints
│   │   ├── /dashboard           # Protected pages
│   │   ├── /(auth)             # Auth pages (login, register)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── /components
│   │   ├── /ui                 # shadcn components
│   │   ├── /barcode            # Barcode scanner/generator
│   │   ├── /inventory          # Inventory-specific components
│   │   └── /shared             # Reusable components
│   ├── /lib
│   │   ├── /db                 # Sequelize config & models
│   │   │   ├── /models        # Database models
│   │   │   ├── /migrations    # Migration files
│   │   │   ├── /seeders       # Seed data
│   │   │   ├── config.js      # DB configuration
│   │   │   └── index.ts       # Sequelize instance
│   │   ├── /services           # Business logic
│   │   ├── /utils              # Utilities
│   │   └── /validations        # Zod schemas
│   ├── /hooks                  # Custom React hooks
│   └── /types                  # TypeScript types
├── /tests                       # Test files
│   ├── /unit
│   ├── /integration
│   └── /e2e
├── /docs                        # Documentation
├── /scripts                     # Database scripts
└── /public                      # Static files
    ├── /uploads                # User uploads
    └── /images                 # Static images
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js >= 18.17.0
- npm >= 9.0.0
- PostgreSQL >= 15.0

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd inventory-management-tracking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   - Database credentials
   - NextAuth secret
   - Other required variables

4. **Setup PostgreSQL database**
   ```bash
   # Create database
   createdb inventory_db
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

6. **Seed the database (optional)**
   ```bash
   npm run db:seed
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run db:migrate` - Run database migrations
- `npm run db:migrate:undo` - Undo last migration
- `npm run db:seed` - Seed database
- `npm run db:reset` - Reset database (undo all, migrate, seed)

## 🔐 Default Users (After Seeding)

| Email | Password | Role |
|-------|----------|------|
| admin@inventory.com | Admin123! | admin |
| manager@inventory.com | Manager123! | manager |
| staff@inventory.com | Staff123! | staff |

## 📊 Database Schema

See [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) for detailed schema information.

## 🏗️ Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system architecture details.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## 🚢 Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment instructions.

## 📝 API Documentation

See [docs/API.md](docs/API.md) for API endpoint documentation.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- shadcn for the beautiful UI components
- Sequelize team for the robust ORM

---

**Status**: 🚧 Under Development

For more information, please refer to the documentation in the `/docs` folder.
