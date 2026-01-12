# Authentication Setup

NextAuth.js has been integrated with Prisma. Follow these steps to complete the setup.

## 1. Add Environment Variables

Add these to your `.env` file:

```env
# NextAuth.js
AUTH_SECRET="your-secret-key-here"
AUTH_URL="http://localhost:3000"
```

**To generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

Or use any random string (at least 32 characters).

## 2. Run Database Migration

```bash
npm run db:migrate
```

When prompted, name the migration: `add_auth_models`

This will create the User, Account, Session, and VerificationToken tables.

## 3. Test Authentication

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Visit:
   - `/signup` - Create a new account
   - `/login` - Sign in to existing account

## Features

- Login and signup pages
- Secure password hashing with bcrypt
- JWT-based session management
- Guest user support
- User profile integration

## How It Works

- **Authenticated users**: Data is tied to `userId`
- **Guest users**: Data is tied to `sessionId`

