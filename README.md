# Oja

A modern e-commerce marketplace built with Next.js, React, and PostgreSQL.

## Features

- Product browsing and search
- Shopping cart management
- Order processing
- User favorites
- User authentication
- Product reviews

## Tech Stack

- **Framework**: Next.js 15
- **UI**: React 19, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

- Node.js 20 or higher
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see `BACKEND_SETUP.md` and `AUTH_SETUP.md`)

4. Set up the database:
   ```bash
   npm run db:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Documentation

- [Backend Setup](./BACKEND_SETUP.md) - Database configuration and API setup
- [Authentication Setup](./AUTH_SETUP.md) - User authentication configuration

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:push` - Push schema to database
