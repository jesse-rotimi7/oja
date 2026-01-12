# Backend Setup Guide

This project uses PostgreSQL for data persistence:
- Cart, Orders, Favorites, and User data are stored in PostgreSQL

## Quick Setup

### 1. Get a PostgreSQL Database

Choose one of these free options:

**Option A: Supabase (Recommended)**
1. Go to [supabase.com](https://supabase.com)
2. Sign up and create a new project
3. Go to Settings → Database
4. Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`)

**Option B: Neon**
1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Copy the connection string

**Option C: Railway**
1. Go to [railway.app](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the connection string

### 2. Configure Environment Variables

Create a `.env` file in the root directory and add your database connection string:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

### 3. Set Up Database

Run these commands:

```bash
# Generate Prisma Client
npm run db:generate

# Create database tables (first time setup)
npm run db:migrate

# Or push schema without migration (for development)
npm run db:push
```

### 4. Verify Setup

```bash
# Open Prisma Studio to view your database
npm run db:studio
```

This opens a visual database browser at `http://localhost:5555`

## API Routes

Your backend provides these endpoints:

- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart` - Update cart item quantity
- `DELETE /api/cart` - Remove item from cart

- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order

- `GET /api/favorites` - Get favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites` - Remove from favorites

## Architecture

- Cart, Orders, and Favorites are persisted in PostgreSQL
- Session-based authentication for guest users
- User-based authentication for registered users (see `AUTH_SETUP.md`)

## Troubleshooting

**Error: Can't reach database**
- Check your `DATABASE_URL` is correct
- Make sure your database is accessible (not blocked by firewall)

**Error: Table doesn't exist**
- Run `npm run db:migrate` to create tables

**Error: Prisma Client not generated**
- Run `npm run db:generate`


