# PERON.ID - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- PostgreSQL (for production) or SQLite (for development)

### Installation Steps

1. **Clone the repository**

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory

(ISI ENV NYA MINTA KE YG PUNYA REPO)

4. **Set up the database**
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with sample data (optional)
npx tsx prisma/seed.ts
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### Default Accounts

After seeding, you can log in with:

**Admin Account:**
- Email: `admin@peron.id`
- Password: `admin123`

**User Account:**
- Email: `user@example.com`
- Password: `user123`

## 🔧 Configuration

### Database Setup

**For PostgreSQL:**
1. Install PostgreSQL on your system
2. Create a new database: `createdb peron_db`
3. Update `DATABASE_URL` in `.env`

**For SQLite (Development):**
```env
DATABASE_URL="file:./dev.db"
```

### Payment Gateway (Midtrans)

1. Sign up at [Midtrans](https://midtrans.com/)
2. Get your **Server Key** and **Client Key** from the dashboard
3. Use Sandbox mode for testing (`MIDTRANS_IS_PRODUCTION="false"`)
4. Update keys in `.env`

### Shipping Integration (Biteship)

1. Sign up at [Biteship](https://biteship.com/)
2. Get your **API Key** from the dashboard
3. Update `BITESHIP_API_KEY` in `.env`

### Email Service (Resend)

1. Sign up at [Resend](https://resend.com/)
2. Get your **API Key**
3. Update `RESEND_API_KEY` in `.env`

### Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Maps JavaScript API**
3. Create an API key
4. Update `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env`

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma generate  # Regenerate Prisma Client
npx prisma db push   # Push schema changes to database
npx prisma migrate dev  # Create and apply migration

# Linting
npm run lint         # Run ESLint
```

## 🗄️ Database Schema

The application uses the following models:
- **User**: User accounts with roles (USER, ADMIN)
- **Category**: Product categories
- **Product**: Products with variants
- **Variant**: Product variants (size, color, etc.)
- **Order**: Customer orders
- **OrderItem**: Items in an order

For detailed schema, see `prisma/schema.prisma`

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Kill the process using port 3000
npx kill-port 3000
```

### Prisma Client not generated
```bash
npx prisma generate
```

### Database connection errors
- Check your `DATABASE_URL` is correct
- Ensure PostgreSQL is running (if using PostgreSQL)
- Verify database credentials

### Environment variables not loading
- Ensure `.env` file is in the root directory
- Restart the development server after changes
- Never commit `.env` file to version control

## 📚 Documentation

For more detailed documentation, see:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Midtrans Documentation](https://docs.midtrans.com/)
- [Biteship Documentation](https://docs.biteship.com/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is for educational purposes.

---

**PERON.ID** - Urban Street-Art E-Commerce Platform
