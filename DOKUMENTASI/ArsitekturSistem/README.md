# Dokumentasi Arsitektur Sistem - PERON.ID

## 📋 Deskripsi

Dokumentasi ini menjelaskan arsitektur sistem PERON.ID dari berbagai perspektif: high-level overview, komponen detail, alur data, lifecycle order, keamanan, manajemen stok, dan deployment. Setiap diagram memberikan wawasan berbeda tentang bagaimana sistem dibangun dan beroperasi.

---

## 🏛️ 1. High-Level System Architecture

**File:** `High-Level System Architecture.jpg`

### Deskripsi
Diagram ini memberikan pandangan bird's-eye view dari keseluruhan sistem PERON.ID, menunjukkan layer utama dan interaksi antar komponen pada level tinggi.

### Komponen Utama:

#### **Layer 1: Client Layer** 
- **Web Browser**: Interface utama pengguna
- **Teknologi**: 
  - React 19.2.0 (UI Library)
  - Next.js 16.0.1 (Framework)
  - Tailwind CSS (Styling)
- **Tanggung Jawab**:
  - Rendering UI
  - State management (React Context)
  - Client-side routing
  - Form handling & validation

#### **Layer 2: Application Layer**
- **Next.js Application Server**
- **Komponen**:
  - Server Components (Data fetching)
  - Client Components (Interactivity)
  - API Routes (Backend endpoints)
  - Middleware (Authentication)
- **Tanggung Jawab**:
  - Server-side rendering (SSR)
  - API request handling
  - Business logic processing
  - Session management

#### **Layer 3: Service Layer**
- **Database Service**: PostgreSQL/SQLite
- **Authentication Service**: NextAuth.js
- **External Services**:
  - Payment Gateway (Midtrans)
  - Shipping API (Biteship)
  - Email Service (Resend)
  - Maps API (Google Maps)

#### **Layer 4: Data Layer**
- **Database**: PostgreSQL 18
- **ORM**: Prisma 6.19.0
- **Models**: User, Product, Category, Variant, Order, OrderItem
- **Storage**: Firebase Storage (images)

### Alur Data Umum:
```
User Request → Browser → Next.js App → API Routes → 
Prisma ORM → Database → Response → UI Update
```

### Karakteristik Arsitektur:
- 🏗️ **Monolithic Application**: Single deployment unit
- 🔄 **Full-Stack Framework**: Frontend + Backend terintegrasi
- 🎯 **API-First Design**: RESTful API endpoints
- 📦 **Modular Structure**: Separation of concerns
- 🔐 **Secure by Default**: Built-in security features

---

## 🧩 2. Detailed Component Architecture

**File:** `Detailed Component Architecture.jpg`

### Deskripsi
Diagram ini memberikan breakdown detail dari setiap komponen dalam sistem, menunjukkan struktur folder dan tanggung jawab masing-masing modul.

### Struktur Komponen:

#### **A. Frontend Components** (`src/components/`)

**UI Components:**
- `Navbar.tsx`: Navigation header dengan cart badge
- `Footer.tsx`: Footer dengan informasi kontak
- `ProductCard.tsx`: Card display untuk product listing
- `CategoryFilter.tsx`: Filter produk berdasarkan kategori
- `CartBadge.tsx`: Badge notifikasi jumlah item di cart
- `AddToCartButton.tsx`: Tombol add to cart dengan loading state
- `VariantSelector.tsx`: Dropdown selector untuk varian produk
- `ShippingOptions.tsx`: Display pilihan kurir pengiriman
- `OrderSummary.tsx`: Ringkasan pesanan di checkout

**Form Components:**
- `LoginForm.tsx`: Form login dengan validation
- `RegisterForm.tsx`: Form registrasi user baru
- `CheckoutForm.tsx`: Form informasi pengiriman
- `ProfileEditor.tsx`: Form edit profil user

**Layout Components:**
- `Providers.tsx`: Context providers wrapper
- `AuthGuard.tsx`: Protected route wrapper
- `AdminGuard.tsx`: Admin-only route wrapper

#### **B. Context Providers** (`src/contexts/`)

**CartContext:**
- State: `items[]`, `total`, `itemCount`
- Actions: `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`
- Storage: localStorage dengan key `cart_{email}`

**SessionProvider:**
- From: NextAuth.js
- State: `session`, `status`
- Actions: `signIn()`, `signOut()`

#### **C. API Routes** (`src/app/api/`)

**Authentication:**
- `POST /api/auth/[...nextauth]`: NextAuth endpoints
- `POST /api/user/register`: Registrasi user baru
- `GET /api/user/profile`: Get user profile
- `PUT /api/user/profile`: Update user profile

**Products:**
- `GET /api/products`: List semua produk
- `GET /api/products/:id`: Detail produk
- `GET /api/products?category=:id`: Filter by category
- `GET /api/categories`: List semua kategori

**Cart & Orders:**
- `POST /api/orders`: Create order baru
- `GET /api/orders`: List user orders
- `GET /api/orders/:id`: Detail order
- `PUT /api/orders/:id/cancel`: Cancel order
- `POST /api/orders/auto-cancel`: Cron job cancel expired orders

**Payment:**
- `POST /api/payment/create`: Create Midtrans token
- `POST /api/payment/webhook`: Handle Midtrans notification

**Shipping:**
- `POST /api/shipping/rates`: Calculate ongkir

#### **D. Pages** (`src/app/`)

**Public Pages:**
- `/`: Homepage dengan featured products
- `/products`: Product listing dengan filter
- `/products/:id`: Product detail page
- `/login`: Login & register page
- `/cart`: Shopping cart page

**Protected Pages:**
- `/checkout`: Checkout flow (require auth)
- `/account`: User account & profile
- `/orders`: Order history
- `/payment-success`: Success page after payment

**Admin Pages:**
- `/admin/dashboard`: Admin dashboard
- `/admin/products`: Manage products
- `/admin/orders`: Manage orders
- `/admin/users`: Manage users

#### **E. Database Layer** (Prisma Schema)

**Models:**
```prisma
User {
  - Authentication & profile
  - One-to-Many: Orders
}

Category {
  - Product categorization
  - One-to-Many: Products
}

Product {
  - Base product info
  - One-to-Many: Variants
  - One-to-Many: OrderItems
}

Variant {
  - Product variations (size, color)
  - Many-to-One: Product
  - One-to-Many: OrderItems
}

Order {
  - Customer orders
  - Many-to-One: User
  - One-to-Many: OrderItems
  - Fields: expiryTime (15min timeout)
}

OrderItem {
  - Items in order
  - Many-to-One: Order
  - Many-to-One: Product
  - Optional Many-to-One: Variant
  - Denormalized: price, variantName
}
```

#### **F. External Services Integration**

**Midtrans Payment:**
- SDK: `midtrans-client`
- Snap API for popup payment
- Webhook for status notification
- Signature verification (SHA512)

**Biteship Shipping:**
- REST API
- Calculate shipping rates
- Support 5 couriers
- Origin: Jakarta Pusat (12920)

**Resend Email:**
- Transactional emails
- Welcome email
- Order confirmation
- Shipping notification

**Google Maps:**
- Maps JavaScript API
- Autocomplete address
- Display delivery location

### Dependency Flow:
```
Pages → Components → Contexts → API Routes → 
Prisma → Database / External Services
```

---

## 🔄 3. Data Flow Architecture

**File:** `Data Flow Architecture.jpg`

### Deskripsi
Sequence diagram yang menunjukkan alur data detail dari user action hingga response, termasuk semua interaksi dengan backend dan external services.

### Flow 1: Browse Products

```
User → Browser → Next.js (Server Component)
  ↓
GET /api/products?category=X
  ↓
Prisma.product.findMany({ where: { categoryId: X } })
  ↓
PostgreSQL → Return products[]
  ↓
SSR Render → HTML Response → Browser Display
```

**Karakteristik:**
- ⚡ Server-side rendering untuk SEO
- 📦 Pre-fetched data di server
- 🎨 Hydration di client

### Flow 2: Add to Cart

```
User Click Add → Client Component
  ↓
CartContext.addItem(product, variant, quantity)
  ↓
Update State: items.push(newItem)
  ↓
Calculate Total: sum(item.price * item.quantity)
  ↓
localStorage.setItem(cartKey, JSON.stringify(items))
  ↓
UI Re-render → Cart Badge Update
```

**Karakteristik:**
- 🖥️ Pure client-side operation
- 💾 Persisted di localStorage
- ⚡ Real-time update tanpa server request

### Flow 3: Checkout & Payment

```
User Fill Form → POST /api/payment/create
  ↓
Validate User Session (NextAuth)
  ↓
START TRANSACTION
  ├─ Generate Order ID: ORDER-{timestamp}-{random}
  ├─ Create Order (with expiryTime: +15min)
  ├─ Create OrderItems[]
  ├─ Reduce Stock (Variant/Product)
  └─ COMMIT TRANSACTION
  ↓
Call Midtrans API: createTransaction()
  ├─ Send: order_id, amount, customer_details, items
  └─ Receive: token, redirect_url
  ↓
Return token to Client
  ↓
Client: Load Midtrans Snap(token)
  ↓
User Pay in Snap Popup
  ↓
Midtrans → Webhook: POST /api/payment/webhook
  ↓
Verify Signature Key (SHA512)
  ↓
Parse transaction_status
  ├─ "settlement" → Update Order: status = PROCESSING
  ├─ "pending" → Update Order: status = UNPAID
  └─ "cancel/expire" → Update Order: status = CANCELLED
  ↓
Send Email Notification
  ↓
Return 200 OK to Midtrans
  ↓
Snap Redirect: /payment-success?order_id=X
  ↓
Clear Cart from localStorage
  ↓
Display Success Page
```

**Karakteristik:**
- 🔒 Database transaction untuk atomicity
- 🔐 Signature verification untuk security
- ⏱️ 15-minute expiry window
- 📧 Email notification otomatis

### Flow 4: Calculate Shipping

```
User Input Postal Code → POST /api/shipping/rates
  ↓
{
  origin_postal_code: "12920", // Jakarta Pusat
  destination_postal_code: userInput,
  couriers: "jne,jnt,sicepat,anteraja,ninja",
  items: [{ name, value, weight: 500, quantity }]
}
  ↓
Fetch Biteship API: POST /v1/rates/couriers
  ↓
Biteship Process & Return:
{
  pricing: [
    {
      courier_name: "JNE",
      courier_service_name: "REG",
      price: 15000,
      estimated_day: "2-3"
    },
    ...
  ]
}
  ↓
Return to Client → Display Options
  ↓
User Select Courier → Update Order Summary
```

**Karakteristik:**
- 🚚 Real-time rate calculation
- 🏢 Multiple courier comparison
- 📍 Postal code based
- ⚖️ Fixed weight: 500g per item

### Flow 5: Auto-Cancel Expired Orders

```
Cron Job (Every 5 min) → GET /api/orders/auto-cancel
  ↓
Verify CRON_SECRET
  ↓
Query Expired Orders:
{
  where: {
    status: "UNPAID",
    expiryTime: { lt: new Date() }
  }
}
  ↓
Loop Each Order:
  ├─ START TRANSACTION
  ├─ Get OrderItems[]
  ├─ Loop Items:
  │   └─ Restore Stock (variant.stock += qty OR product.stock += qty)
  ├─ Update Order: status = CANCELLED
  ├─ COMMIT TRANSACTION
  └─ Log: cancelledOrderIds.push(orderId)
  ↓
Return Summary:
{
  success: true,
  cancelledCount: 5,
  cancelledOrderIds: [...]
}
```

**Karakteristik:**
- ⏰ Scheduled job (setiap 5 menit)
- 🔄 Atomic transaction per order
- 📊 Comprehensive logging
- ⚠️ Individual error handling

---

## 📊 4. Order Lifecycle Architecture

**File:** `Order Lifecycle Architecture.jpg`

### Deskripsi
State diagram yang menunjukkan semua status order dan transisi yang mungkin terjadi, termasuk kondisi untuk setiap perubahan status.

### Status Order:

#### **1. UNPAID** (Initial State)
- **Entry**: Order baru dibuat setelah checkout
- **Karakteristik**:
  - Stok sudah dikurangi
  - ExpiryTime set (15 menit)
  - Menunggu pembayaran
- **Transisi**:
  - → **PROCESSING**: Payment success (Midtrans webhook: settlement/capture)
  - → **CANCELLED**: 
    - Payment expired/denied (Midtrans webhook)
    - Auto-cancel oleh cron job
    - Manual cancel by admin
    - Manual cancel by user

#### **2. PROCESSING** (Payment Success)
- **Entry**: Pembayaran berhasil diverifikasi
- **Karakteristik**:
  - Payment confirmed
  - Pesanan sedang diproses/dipacking
  - Admin dapat lihat & pack
- **Transisi**:
  - → **SHIPPED**: Admin pack & input resi
  - → **CANCELLED**: Admin cancel (dengan konfirmasi + restore stock)

#### **3. SHIPPED** (In Transit)
- **Entry**: Admin sudah kirim barang + input resi
- **Karakteristik**:
  - Tracking number tersedia
  - Dalam perjalanan ke customer
  - Customer dapat track
- **Transisi**:
  - → **COMPLETED**: Admin confirm delivery / Auto-complete after X days
  - → **PROCESSING**: Update tracking info only (not status change)

#### **4. COMPLETED** (Final State - Success)
- **Entry**: Barang sampai & diterima customer
- **Karakteristik**:
  - Transaksi selesai
  - Order history permanent
  - Cannot be modified
- **Transisi**: None (terminal state)

#### **5. CANCELLED** (Final State - Failed)
- **Entry**: Multiple paths (see UNPAID transitions)
- **Karakteristik**:
  - Stok dikembalikan (jika dari cancel order/auto-cancel)
  - ⚠️ Stok TIDAK dikembalikan (jika dari webhook - BUG)
  - Order history permanent
  - Cannot be modified
- **Transisi**: None (terminal state)

### Diagram Flow:

```
        [UNPAID]
           |
    +------+------+
    |             |
    v             v
[PROCESSING]  [CANCELLED]
    |
    +------+
    |      |
    v      v
[SHIPPED] [CANCELLED]
    |
    v
[COMPLETED]
```

### Business Rules:

**Timeout Rules:**
- ⏱️ UNPAID → CANCELLED: 15 menit
- ⏱️ SHIPPED → COMPLETED: 7 hari (optional auto-complete)

**Stock Management:**
- ✅ UNPAID creation: Reduce stock
- ✅ CANCELLED from UNPAID/PROCESSING: Restore stock
- ❌ CANCELLED from webhook: Stock NOT restored (BUG)

**Email Notifications:**
- 📧 UNPAID → PROCESSING: "Payment Successful"
- 📧 PROCESSING → SHIPPED: "Order Shipped" + tracking
- 📧 SHIPPED → COMPLETED: "Order Delivered"
- 📧 Any → CANCELLED: "Order Cancelled"

**User Actions:**
- UNPAID: Can cancel
- PROCESSING/SHIPPED: Cannot cancel (contact admin)
- COMPLETED/CANCELLED: View only

**Admin Actions:**
- UNPAID: Can cancel
- PROCESSING: Can pack→ship / cancel
- SHIPPED: Can mark delivered / update tracking
- COMPLETED/CANCELLED: View only / export invoice

---

## 🔒 5. Security Architecture

**File:** `Security Architecture.jpg`

### Deskripsi
Diagram yang menunjukkan semua layer keamanan yang diimplementasikan dalam sistem untuk melindungi data dan mencegah unauthorized access.

### Security Layers:

#### **Layer 1: Network Security**

**HTTPS Enforcement:**
- 🔐 TLS 1.3 encryption
- 🔐 SSL certificate (Let's Encrypt/Cloudflare)
- 🔐 Redirect HTTP → HTTPS

**CORS Policy:**
- 🛡️ Whitelist allowed origins
- 🛡️ Credentials: true
- 🛡️ Allowed methods: GET, POST, PUT, DELETE

**Rate Limiting:**
- ⏱️ API rate limit: 100 req/min per IP
- ⏱️ Login attempts: 5 failed → block 15 min
- ⏱️ Webhook: Unlimited (verified signature)

#### **Layer 2: Authentication Security**

**NextAuth.js Configuration:**
- 🔑 JWT Strategy
- 🔑 Secret key: NEXTAUTH_SECRET (256-bit)
- 🔑 Session duration: 30 days
- 🔑 HTTP-only cookies
- 🔑 SameSite: Lax

**Password Security:**
- 🔐 Hashing: bcrypt
- 🔐 Salt rounds: 10
- 🔐 Min length: 8 characters
- 🔐 Requirements: (implementasi optional)
  - Uppercase + lowercase
  - Numbers
  - Special characters

**Session Management:**
- 🔒 Secure cookie flags
- 🔒 CSRF token validation
- 🔒 Auto logout on inactivity (30 min)
- 🔒 Concurrent session limit: 3 devices

#### **Layer 3: Authorization Security**

**Role-Based Access Control (RBAC):**
```
USER:
  - View products
  - Manage own cart
  - Create orders
  - View own orders
  - Update own profile

ADMIN:
  - All USER permissions +
  - Manage products (CRUD)
  - Manage categories
  - Manage all orders
  - View all users
  - Access admin dashboard
```

**Route Protection:**
- 🛡️ Public routes: /, /products, /login
- 🛡️ Protected routes: /checkout, /account, /orders
- 🛡️ Admin routes: /admin/*
- 🛡️ Middleware: Check session + role

**API Protection:**
- 🔒 GET endpoints: Public (products, categories)
- 🔒 POST/PUT/DELETE: Require authentication
- 🔒 Admin endpoints: Require ADMIN role
- 🔒 User endpoints: Own resource only

#### **Layer 4: Data Security**

**Input Validation:**
- ✅ Client-side: React Hook Form + Zod
- ✅ Server-side: Express Validator / Zod
- ✅ Sanitization: Remove HTML/script tags
- ✅ Type checking: TypeScript

**SQL Injection Prevention:**
- 🛡️ Prisma ORM: Parameterized queries
- 🛡️ No raw SQL queries
- 🛡️ Input escaping automatic

**XSS Prevention:**
- 🛡️ React: Auto-escape output
- 🛡️ CSP Headers: Restrict script sources
- 🛡️ DOMPurify: Sanitize user content

**CSRF Prevention:**
- 🔐 Built-in NextAuth CSRF tokens
- 🔐 SameSite cookie attribute
- 🔐 Double submit cookie pattern

#### **Layer 5: Payment Security**

**Midtrans Integration:**
- 🔐 Server Key: Environment variable (never exposed)
- 🔐 Client Key: Public (safe to expose)
- 🔐 Webhook signature: SHA512 verification
- 🔐 HTTPS only communication

**Signature Verification:**
```javascript
const hash = crypto
  .createHash('sha512')
  .update(orderId + statusCode + grossAmount + serverKey)
  .digest('hex');

if (hash !== signature_key) {
  return 401; // Unauthorized
}
```

**Payment Data:**
- 💳 Card details: Never stored (handled by Midtrans)
- 💳 Transaction ID: Stored for reference
- 💳 Amount: Validated server-side
- 💳 Idempotency: Duplicate webhook check

#### **Layer 6: API Security**

**Biteship API:**
- 🔑 API Key: Environment variable
- 🔑 HTTPS only
- 🔑 Test mode for development

**Resend Email:**
- 🔑 API Key: Environment variable
- 🔑 Verified sender domain
- 🔑 Rate limiting by Resend

**Google Maps API:**
- 🔑 API Key: Restricted by domain
- 🔑 Restricted by API services
- 🔑 Usage quotas

#### **Layer 7: Infrastructure Security**

**Environment Variables:**
- 🔐 .env file (gitignored)
- 🔐 No hardcoded secrets
- 🔐 Different keys for dev/prod
- 🔐 Vercel env vars for production

**Database Security:**
- 🔒 Connection string in env
- 🔒 Database user: Limited privileges
- 🔒 Network: Whitelist IPs
- 🔒 Backup: Daily automated

**File Upload Security:**
- 📁 Firebase Storage: Access rules
- 📁 File type validation
- 📁 Size limit: 5MB per image
- 📁 Virus scanning (optional)

**Logging & Monitoring:**
- 📊 Error logging: Winston/Pino
- 📊 Access logs: Nginx/Vercel
- 📊 Security events: Failed logins, unauthorized access
- 📊 Alerting: Email/Slack on critical errors

### Security Best Practices:

✅ **Implemented:**
- Password hashing (bcrypt)
- JWT authentication
- HTTPS enforcement
- CORS policy
- Input validation
- Prisma ORM (SQL injection prevention)
- Webhook signature verification
- Environment variables
- Role-based access control

⚠️ **Recommended Additions:**
- Two-factor authentication (2FA)
- API rate limiting (per user)
- Advanced logging & monitoring
- Penetration testing
- Security headers (Helmet.js)
- Content Security Policy (CSP)
- Subresource Integrity (SRI)

---

## 📦 6. Stock Management Architecture

**File:** `Stock Management Architecture.jpg`

### Deskripsi
Flowchart yang menjelaskan logika manajemen stok produk, termasuk pengurangan dan pengembalian stok dalam berbagai skenario.

### Konsep Dasar:

#### **Tipe Stock Management:**

**1. Product-Based Stock:**
- Produk tanpa varian
- Stok disimpan di `Product.stock`
- Contoh: Sketchbook A4, Spray Paint Basic

**2. Variant-Based Stock:**
- Produk dengan varian (size, color, dll)
- Stok disimpan di `Variant.stock`
- `Product.stock` = SUM(Variant.stock)
- Contoh: T-Shirt (S/M/L/XL), Marker Set (Red/Blue/Black)

### Flow 1: Check Stock Availability

```
START: User view product
  ↓
Has Variants?
  ├─ YES: Loop each variant
  │   ├─ Get variant.stock
  │   └─ Display: "Size M: 10 left"
  └─ NO: Get product.stock
      └─ Display: "20 items available"
  ↓
Stock > 0?
  ├─ YES: Enable "Add to Cart"
  └─ NO: Show "Out of Stock" + Disable button
```

### Flow 2: Add to Cart Validation

```
START: User add to cart
  ↓
Get selected variant (if any)
  ↓
Check stock:
  ├─ Variant: variant.stock >= quantity?
  └─ Product: product.stock >= quantity?
  ↓
Sufficient?
  ├─ YES: Add to cart → Success
  └─ NO: Show error "Only X left in stock"
```

### Flow 3: Checkout Stock Validation

```
START: User click checkout
  ↓
Loop each cart item:
  ├─ Fetch current stock from DB
  ├─ Has variant?
  │   ├─ YES: Check variant.stock
  │   └─ NO: Check product.stock
  ├─ Current stock >= cart quantity?
  │   ├─ YES: Item valid
  │   └─ NO: Mark invalid + Show error
  ↓
All items valid?
  ├─ YES: Allow proceed to payment
  └─ NO: Block checkout + Display errors
```

### Flow 4: Reduce Stock (Order Creation)

```
START: Create order
  ↓
START TRANSACTION
  ↓
Lock product/variant records (FOR UPDATE)
  ↓
Loop each order item:
  ├─ Has variant?
  │   ├─ YES: 
  │   │   ├─ variant.stock -= quantity
  │   │   ├─ product.stock -= quantity (aggregate)
  │   └─ NO:
  │       └─ product.stock -= quantity
  ├─ Check: stock < 0?
  │   ├─ YES: 
  │   │   ├─ ROLLBACK TRANSACTION
  │   │   └─ Return error "Insufficient stock"
  │   └─ NO: Continue
  ↓
All items processed?
  ├─ YES: COMMIT TRANSACTION → Success
  └─ NO: Continue loop
```

**Catatan Penting:**
- 🔒 **Locking**: FOR UPDATE clause mencegah race condition
- ⚛️ **Atomicity**: All or nothing - semua stok dikurangi atau tidak sama sekali
- 🔄 **Rollback**: Otomatis jika ada error
- ⏱️ **Timing**: Stok dikurangi SEBELUM payment (prevent overbooking)

### Flow 5: Restore Stock (Order Cancellation)

```
START: Cancel order
  ↓
Verify cancellation allowed:
  ├─ Status = UNPAID? YES → Continue
  ├─ Status = PROCESSING? Admin only → Continue
  └─ Status = SHIPPED/COMPLETED? NO → Block
  ↓
START TRANSACTION
  ↓
Lock product/variant records
  ↓
Get all order items
  ↓
Loop each item:
  ├─ Has variant?
  │   ├─ YES:
  │   │   ├─ variant.stock += quantity
  │   │   ├─ product.stock += quantity (aggregate)
  │   └─ NO:
  │       └─ product.stock += quantity
  ↓
Update order status = CANCELLED
  ↓
COMMIT TRANSACTION → Stock restored
```

**Skenario Restorasi:**
- ✅ User cancel UNPAID order
- ✅ Admin cancel PROCESSING order
- ✅ Auto-cancel expired order (cron job)
- ❌ **BUG**: Webhook cancel TIDAK restore stock

### Flow 6: Admin Manual Stock Update

```
START: Admin update stock
  ↓
Input new stock value
  ↓
Validate: stock >= 0?
  ├─ NO: Show error → Return to form
  └─ YES: Continue
  ↓
Get current stock (old value)
  ↓
Update stock in database
  ↓
Create audit log:
  ├─ admin_id
  ├─ product_id / variant_id
  ├─ old_stock
  ├─ new_stock
  ├─ timestamp
  └─ reason (optional)
  ↓
Check: new_stock < 10?
  ├─ YES: Send low stock alert to admin
  └─ NO: Skip
  ↓
Success → Return to list
```

### Race Condition Prevention:

**Problem:**
```
Time  | User A          | User B
------|-----------------|----------------
T1    | Read stock: 5   |
T2    |                 | Read stock: 5
T3    | Buy 5 items     |
T4    | stock = 0       |
T5    |                 | Buy 5 items (SHOULD FAIL!)
T6    |                 | stock = -5 ❌
```

**Solution: Database Locking**
```sql
-- User A
BEGIN TRANSACTION;
SELECT * FROM Product WHERE id = X FOR UPDATE; -- Lock row
UPDATE Product SET stock = stock - 5 WHERE id = X;
COMMIT;

-- User B (blocks until User A commits)
BEGIN TRANSACTION;
SELECT * FROM Product WHERE id = X FOR UPDATE; -- Wait...
-- After User A commits, stock is 0
UPDATE Product SET stock = stock - 5 WHERE id = X; -- Fails validation
ROLLBACK;
```

**Implementation in Prisma:**
```typescript
await prisma.$transaction(async (tx) => {
  const product = await tx.product.findUnique({
    where: { id: productId },
    // FOR UPDATE lock is implicit in transaction
  });

  if (product.stock < quantity) {
    throw new Error('Insufficient stock');
  }

  await tx.product.update({
    where: { id: productId },
    data: { stock: { decrement: quantity } }
  });
});
```

### Stock Alerts & Monitoring:

**Low Stock Alert:**
- 📊 Threshold: < 10 items
- 📧 Notification: Email to admin
- ⚠️ Warning badge in admin panel

**Out of Stock:**
- 🚫 Button disabled on product page
- 📝 Display "Out of Stock" message
- 🔔 Alert admin immediately

**Stock Movement Log:**
- 📊 Track: Who, What, When
- 📊 Reason: Order/Cancel/Manual adjustment
- 📊 Before/After values
- 📊 For audit & analytics

---

## 🚀 7. Deployment Architecture

**File:** `_Deployment Architecture.jpg`

### Deskripsi
Diagram infrastruktur deployment yang menunjukkan bagaimana aplikasi di-host dan configured di production environment.

### Production Stack:

#### **Hosting Platform: Vercel**

**Why Vercel:**
- ✅ Native Next.js support
- ✅ Zero-config deployment
- ✅ Automatic HTTPS
- ✅ CDN global
- ✅ Serverless functions
- ✅ Git integration

**Deployment:**
```
Git Push → Vercel Auto Deploy
  ├─ Build: npm run build
  ├─ Optimize: Static assets
  ├─ Deploy: Edge network
  └─ Live: Custom domain
```

**Environment:**
- 🌍 Edge Network: 70+ locations worldwide
- ⚡ Cold start: < 100ms
- 📦 Static files: CDN cached
- 🔄 Instant rollback support

#### **Database: PostgreSQL**

**Hosting Options:**

**Option 1: Vercel Postgres**
- ✅ Integrated dengan Vercel
- ✅ Serverless SQL
- ✅ Auto-scaling
- ✅ Backup otomatis
- 💰 Pricing: $20/mo starter

**Option 2: Railway.app**
- ✅ PostgreSQL managed
- ✅ Easy setup
- ✅ 500 jam free/month
- 💰 Pay as you go

**Option 3: Supabase**
- ✅ PostgreSQL + API
- ✅ Real-time subscriptions
- ✅ Auth built-in
- 💰 Free tier available

**Option 4: AWS RDS**
- ✅ Enterprise-grade
- ✅ Multi-AZ deployment
- ✅ Automated backups
- 💰 From $15/mo

**Connection:**
```
DATABASE_URL="postgresql://user:pass@host:5432/db?
  sslmode=require&
  connection_limit=10&
  pool_timeout=30"
```

**Prisma Configuration:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "linux-arm64-openssl-3.0.x"]
}
```

#### **File Storage: Firebase Storage**

**Configuration:**
- 📁 Bucket: Public read
- 📁 Authentication: Service account
- 📁 CDN: Firebase CDN
- 📁 Optimization: Next.js Image Optimization

**Upload Flow:**
```
Admin Upload → Firebase Storage API
  ├─ Generate unique filename
  ├─ Compress image (90% quality)
  ├─ Upload to bucket
  └─ Get public URL
  ↓
Save URL to database
  ↓
Display with next/image (auto-optimize)
```

#### **External Services:**

**Midtrans:**
- 🌐 Region: Indonesia
- 🔐 Connection: HTTPS REST API
- ⚙️ Mode: Production (switch keys)
- 💳 Webhook: Vercel endpoint

**Biteship:**
- 🌐 Region: Indonesia
- 🔐 Connection: HTTPS REST API
- ⚙️ Mode: Production API key
- 📦 Couriers: JNE, JNT, SiCepat, AnterAja, Ninja

**Resend:**
- 📧 Email sending service
- 🔐 API Key authentication
- 📨 Domain verification required
- 🌍 Global infrastructure

**Google Maps:**
- 🗺️ Maps JavaScript API
- 🔐 API Key restriction:
  - HTTP referrer: yourdomain.com/*
  - API restrictions: Maps JavaScript API only
- 💰 $200 free credit/month

#### **CI/CD Pipeline:**

```
Developer
  ↓
Git Commit → Push to GitHub
  ↓
Vercel Webhook Triggered
  ↓
Vercel Build Server:
  ├─ Pull code
  ├─ Install dependencies (npm ci)
  ├─ Generate Prisma Client
  ├─ Run build (npm run build)
  ├─ Run tests (npm test) [if configured]
  ├─ Static analysis (TypeScript check)
  └─ Bundle optimization
  ↓
Deploy to Preview (PR) / Production (main branch)
  ↓
Health Check:
  ├─ Database connection
  ├─ API endpoints
  └─ External services
  ↓
Live ✅ / Rollback ❌
```

**Branch Strategy:**
- `main` → Production (auto-deploy)
- `staging` → Staging environment
- `feature/*` → Preview deployments
- PRs → Unique preview URL

#### **Environment Variables:**

**Development (.env.local):**
```env
DATABASE_URL="postgresql://localhost:5432/peron_dev"
NEXTAUTH_URL="http://localhost:3000"
MIDTRANS_IS_PRODUCTION="false"
```

**Production (Vercel Dashboard):**
```env
DATABASE_URL="postgresql://prod-db-url"
NEXTAUTH_URL="https://peron.id"
MIDTRANS_IS_PRODUCTION="true"
# + all other production keys
```

**Security:**
- 🔐 Never commit .env
- 🔐 Different keys for dev/prod
- 🔐 Encrypted in Vercel
- 🔐 Access control per team member

#### **Monitoring & Logging:**

**Vercel Analytics:**
- 📊 Page views & performance
- 📊 Core Web Vitals
- 📊 Real User Monitoring
- 📊 Edge function logs

**Application Logging:**
- 📝 Winston/Pino for structured logs
- 📝 Error tracking: Sentry
- 📝 Log aggregation: Logtail/Datadog

**Database Monitoring:**
- 📊 Connection pool usage
- 📊 Slow query detection
- 📊 Storage usage alerts

**Uptime Monitoring:**
- ⏱️ Pingdom / UptimeRobot
- ⏱️ Health check endpoint: `/api/health`
- ⏱️ Alert: Email/SMS on downtime

#### **Backup Strategy:**

**Database:**
- 📦 Automated daily backup
- 📦 Retention: 30 days
- 📦 Point-in-time recovery
- 📦 Stored in different region

**Code:**
- 💾 Git repository (GitHub)
- 💾 Vercel deployment snapshots
- 💾 Tagged releases

**Media Files:**
- 📁 Firebase Storage versioning
- 📁 Weekly full backup
- 📁 Stored in Cloud Storage

#### **Scaling Strategy:**

**Horizontal Scaling:**
- 🔄 Vercel: Auto-scale serverless functions
- 🔄 Database: Read replicas for heavy reads
- 🔄 CDN: Global content delivery

**Vertical Scaling:**
- ⬆️ Database: Increase instance size
- ⬆️ Connection pooling: Prisma connection limit
- ⬆️ Caching: Redis for sessions/cart

**Performance Optimization:**
- ⚡ Next.js: ISR (Incremental Static Regeneration)
- ⚡ Image: Automatic optimization + WebP
- ⚡ Code splitting: Dynamic imports
- ⚡ API caching: SWR / React Query

#### **Disaster Recovery:**

**RTO (Recovery Time Objective):**
- 🎯 Target: < 1 hour

**RPO (Recovery Point Objective):**
- 🎯 Target: < 24 hours (daily backup)

**Recovery Steps:**
1. Restore database from backup
2. Redeploy from Git
3. Verify environment variables
4. Run health checks
5. Switch DNS if needed

---

## 📌 Kesimpulan

Dokumentasi Arsitektur Sistem memberikan pemahaman komprehensif tentang:

✅ **Struktur sistem** dari high-level hingga detail
✅ **Alur data** end-to-end dari user ke database
✅ **Lifecycle order** dengan semua status transisi
✅ **Security layers** untuk proteksi data dan akses
✅ **Stock management** dengan race condition prevention
✅ **Deployment strategy** untuk production environment

Arsitektur ini dirancang untuk:
- 🚀 **Scalable**: Dapat handle traffic besar
- 🔒 **Secure**: Multiple security layers
- 🔧 **Maintainable**: Clean code structure
- 📊 **Monitorable**: Comprehensive logging
- 🔄 **Reliable**: Backup & disaster recovery ready
