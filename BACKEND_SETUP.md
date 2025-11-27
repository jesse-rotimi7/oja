# Backend Setup Guide

This project uses a **hybrid approach**:
- **Products**: Fetched from [fakestoreapi.com](https://fakestoreapi.com) (external API)
- **Cart, Orders, Favorites**: Stored in your PostgreSQL database

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

1. Copy `.env.example` to `.env` (or create `.env` file)
2. Add your database connection string:
   ```
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

## How It Works

1. **Products** are still fetched from fakestoreapi (no change needed)
2. **Cart/Orders/Favorites** are saved to your PostgreSQL database
3. Uses **session-based** authentication (no login required for basic features)
4. Each user gets a unique session ID stored in cookies

## Development

- The app works **without** a database (cart uses localStorage as fallback)
- To use the backend, just set `DATABASE_URL` and run migrations
- Check `src/lib/api-backend.ts` for helper functions

## Troubleshooting

**Error: Can't reach database**
- Check your `DATABASE_URL` is correct
- Make sure your database is accessible (not blocked by firewall)

**Error: Table doesn't exist**
- Run `npm run db:migrate` to create tables

**Error: Prisma Client not generated**
- Run `npm run db:generate`

## Next Steps

- Add authentication (NextAuth.js) for user accounts
- Add product reviews API
- Add admin dashboard for order management
- Add email notifications for orders

