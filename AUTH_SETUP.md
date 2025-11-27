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

✅ **Login/Signup pages** - Beautiful UI matching your design
✅ **Password hashing** - Secure bcrypt encryption
✅ **Session management** - JWT-based sessions
✅ **Guest support** - Still works for non-authenticated users
✅ **Header integration** - Shows user name and sign out button
✅ **API routes updated** - Cart/Orders/Favorites work for both authenticated and guest users

## How It Works

- **Authenticated users**: Data is tied to `userId`
- **Guest users**: Data is tied to `sessionId` (existing functionality preserved)
- When a guest signs up/logs in, their cart/orders can be migrated (future enhancement)

## Next Steps (Optional)

- Add OAuth providers (Google, GitHub, etc.)
- Add email verification
- Add password reset functionality
- Migrate guest cart to user account on login

