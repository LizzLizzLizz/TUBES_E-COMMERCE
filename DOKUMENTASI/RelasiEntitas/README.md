# Dokumentasi Entity Relationship Diagram - PERON.ID

## 📋 Deskripsi

Entity Relationship Diagram (ERD) menggambarkan struktur database PERON.ID, menunjukkan entitas (tabel), atribut (kolom), dan relasi antar entitas. Dokumentasi ini menjelaskan secara detail setiap model dan hubungannya dalam sistem.

---

## 🗄️ 1. ERD - Entity Relationship Diagram

**File:** `ERD.jpg`

### Deskripsi
Diagram visual yang menampilkan semua entitas dalam database beserta relasinya menggunakan notasi Crow's Foot (kardinalitas relasi).

### Entitas & Relasi:

#### **Relasi Utama:**

```
User ──────< Order
  (1)      (N)
  "One user can have many orders"

Category ──────< Product
   (1)        (N)
   "One category contains many products"

Product ──────< Variant
  (1)        (N)
  "One product can have many variants"

Product ──────< OrderItem
  (1)        (N)
  "One product can appear in many order items"

Variant ──────< OrderItem
  (1)        (0..N)
  "One variant can appear in many order items (optional)"

Order ──────< OrderItem
  (1)      (N)
  "One order contains many order items"
```

### Kardinalitas:

| Relasi | Dari | Ke | Tipe | Deskripsi |
|--------|------|-----|------|-----------|
| User → Order | 1 | N | One-to-Many | Satu user bisa punya banyak order |
| Category → Product | 1 | N | One-to-Many | Satu kategori punya banyak produk |
| Product → Variant | 1 | N | One-to-Many | Satu produk bisa punya banyak varian |
| Product → OrderItem | 1 | N | One-to-Many | Satu produk bisa ada di banyak order item |
| Variant → OrderItem | 1 | 0..N | One-to-Many (Optional) | Satu varian bisa ada di banyak order item |
| Order → OrderItem | 1 | N | One-to-Many | Satu order punya banyak item |

### Catatan Penting:

**Dual Foreign Key di OrderItem:**
- OrderItem memiliki 2 foreign key: `productId` (required) dan `variantId` (optional)
- Jika produk tanpa varian: `variantId = null`
- Jika produk dengan varian: `variantId` harus diisi

**Denormalisasi:**
- `OrderItem.variantName` dan `OrderItem.price` disimpan untuk menjaga data historis
- Jika varian/produk dihapus atau harga berubah, data order tetap akurat

---

## 📊 2. Database Schema

**File:** `Database Schema.jpg`

### Deskripsi
Diagram detail yang menampilkan struktur lengkap setiap tabel termasuk tipe data, constraint, dan index. Diagram ini lebih teknis dan implementatif dibanding ERD.

---

## 🗂️ Detail Entitas

### **1. User**

**Deskripsi:** Menyimpan informasi pengguna (customer dan admin)

#### Atribut:

| Field | Type | Constraint | Deskripsi |
|-------|------|------------|-----------|
| `id` | String | PRIMARY KEY | Unique identifier (CUID) |
| `name` | String | NOT NULL | Nama lengkap user |
| `email` | String | UNIQUE, NOT NULL | Email (untuk login) |
| `password` | String | NOT NULL | Password (bcrypt hashed) |
| `phone` | String? | NULLABLE | Nomor telepon |
| `address` | String? | NULLABLE | Alamat lengkap |
| `role` | UserRole | DEFAULT: USER | Role: USER atau ADMIN |
| `createdAt` | DateTime | DEFAULT: now() | Waktu registrasi |
| `updatedAt` | DateTime | AUTO UPDATE | Waktu update terakhir |

#### Relasi:
- **Has Many**: Order (One-to-Many)

#### Index:
- `email` (UNIQUE) - Untuk login dan pencarian cepat

#### Enum: UserRole
```prisma
enum UserRole {
  USER   // Regular customer
  ADMIN  // Administrator
}
```

#### Contoh Data:
```json
{
  "id": "clx1a2b3c4d5e6f7g8h9i0j",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2b$10$...", // bcrypt hash
  "phone": "081234567890",
  "address": "Jl. Sudirman No. 123, Jakarta",
  "role": "USER",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T15:45:00Z"
}
```

---

### **2. Category**

**Deskripsi:** Kategori produk untuk grouping dan filtering

#### Atribut:

| Field | Type | Constraint | Deskripsi |
|-------|------|------------|-----------|
| `id` | String | PRIMARY KEY | Unique identifier (CUID) |
| `name` | String | UNIQUE, NOT NULL | Nama kategori |
| `description` | String? | NULLABLE | Deskripsi kategori |
| `createdAt` | DateTime | DEFAULT: now() | Waktu dibuat |
| `updatedAt` | DateTime | AUTO UPDATE | Waktu update terakhir |

#### Relasi:
- **Has Many**: Product (One-to-Many)

#### Index:
- `name` (UNIQUE) - Prevent duplikat kategori

#### Contoh Data:
```json
{
  "id": "clx2b3c4d5e6f7g8h9i0j1k",
  "name": "Spray Paint",
  "description": "Professional spray paints for street art",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Kategori Default:
1. Spray Paint
2. Marker and Ink
3. Nozzle/Caps
4. Sketchbook
5. Apparel/Merch

---

### **3. Product**

**Deskripsi:** Produk yang dijual di platform

#### Atribut:

| Field | Type | Constraint | Deskripsi |
|-------|------|------------|-----------|
| `id` | String | PRIMARY KEY | Unique identifier (CUID) |
| `name` | String | NOT NULL | Nama produk |
| `description` | String | NOT NULL | Deskripsi detail produk |
| `price` | Float | NOT NULL | Harga dasar (jika tanpa varian) |
| `stock` | Int | DEFAULT: 0 | Stok (auto-calculated jika ada varian) |
| `images` | String | NOT NULL | JSON array URL gambar |
| `categoryId` | String | FOREIGN KEY, NOT NULL | Referensi ke Category |
| `createdAt` | DateTime | DEFAULT: now() | Waktu dibuat |
| `updatedAt` | DateTime | AUTO UPDATE | Waktu update terakhir |

#### Relasi:
- **Belongs To**: Category (Many-to-One)
- **Has Many**: Variant (One-to-Many)
- **Has Many**: OrderItem (One-to-Many)

#### Index:
- `categoryId` - Untuk filter by category

#### Contoh Data:
```json
{
  "id": "clx3c4d5e6f7g8h9i0j1k2l",
  "name": "Montana Gold Spray Paint",
  "description": "High-pressure acrylic spray paint...",
  "price": 85000,
  "stock": 50,
  "images": "[\"https://drive.google.com/.../img1.jpg\"]",
  "categoryId": "clx2b3c4d5e6f7g8h9i0j1k",
  "createdAt": "2024-01-10T08:00:00Z",
  "updatedAt": "2024-01-15T12:30:00Z"
}
```

#### Images Format:
```json
[
  "https://drive.google.com/uc?id=ABC123",
  "https://drive.google.com/uc?id=DEF456"
]
```

---

### **4. Variant**

**Deskripsi:** Varian produk (ukuran, warna, dll)

#### Atribut:

| Field | Type | Constraint | Deskripsi |
|-------|------|------------|-----------|
| `id` | String | PRIMARY KEY | Unique identifier (CUID) |
| `name` | String | NOT NULL | Nama varian (misal: "Size M", "Red") |
| `price` | Float | NOT NULL | Harga varian (bisa berbeda dari base) |
| `stock` | Int | DEFAULT: 0 | Stok varian |
| `productId` | String | FOREIGN KEY, NOT NULL | Referensi ke Product |
| `createdAt` | DateTime | DEFAULT: now() | Waktu dibuat |
| `updatedAt` | DateTime | AUTO UPDATE | Waktu update terakhir |

#### Relasi:
- **Belongs To**: Product (Many-to-One)
- **Has Many**: OrderItem (One-to-Many)

#### Index:
- `productId` - Untuk query varian berdasarkan produk

#### Contoh Data:
```json
[
  {
    "id": "clx4d5e6f7g8h9i0j1k2l3m",
    "name": "Black",
    "price": 85000,
    "stock": 15,
    "productId": "clx3c4d5e6f7g8h9i0j1k2l"
  },
  {
    "id": "clx5e6f7g8h9i0j1k2l3m4n",
    "name": "White",
    "price": 85000,
    "stock": 20,
    "productId": "clx3c4d5e6f7g8h9i0j1k2l"
  }
]
```

#### Logic Stock Product:
Jika produk punya varian:
```javascript
product.stock = SUM(variant.stock)
// Auto-calculated, bukan stored value
```

---

### **5. Order**

**Deskripsi:** Pesanan customer

#### Atribut:

| Field | Type | Constraint | Deskripsi |
|-------|------|------------|-----------|
| `id` | String | PRIMARY KEY | Order ID format: ORDER-{timestamp}-{random} |
| `userId` | String | FOREIGN KEY, NOT NULL | Referensi ke User |
| `status` | OrderStatus | DEFAULT: UNPAID | Status pesanan |
| `total` | Float | NOT NULL | Total harga (items + shipping) |
| `shippingCost` | Float | DEFAULT: 0 | Ongkos kirim |
| `shippingAddress` | String | NOT NULL | Alamat pengiriman lengkap |
| `shippingCity` | String | NOT NULL | Kota tujuan |
| `shippingProvince` | String | NOT NULL | Provinsi tujuan |
| `postalCode` | String | NOT NULL | Kode pos tujuan |
| `courierName` | String | NOT NULL | Nama kurir (JNE, JNT, dll) |
| `courierService` | String | NOT NULL | Service type (REG, YES, dll) |
| `trackingNumber` | String? | NULLABLE | Nomor resi (diisi setelah shipped) |
| `expiryTime` | DateTime? | NULLABLE | Waktu kadaluarsa order (15 menit) |
| `createdAt` | DateTime | DEFAULT: now() | Waktu order dibuat |
| `updatedAt` | DateTime | AUTO UPDATE | Waktu update terakhir |

#### Relasi:
- **Belongs To**: User (Many-to-One)
- **Has Many**: OrderItem (One-to-Many)

#### Index:
- `userId` - Untuk query order user
- `status` - Untuk filter by status
- `expiryTime` - Untuk auto-cancel job

#### Enum: OrderStatus
```prisma
enum OrderStatus {
  UNPAID      // Menunggu pembayaran
  PROCESSING  // Pembayaran berhasil, sedang diproses
  SHIPPED     // Sudah dikirim
  COMPLETED   // Selesai (barang diterima)
  CANCELLED   // Dibatalkan
}
```

#### Contoh Data:
```json
{
  "id": "ORDER-1705320000000-abc123",
  "userId": "clx1a2b3c4d5e6f7g8h9i0j",
  "status": "PROCESSING",
  "total": 185000,
  "shippingCost": 15000,
  "shippingAddress": "Jl. Sudirman No. 123",
  "shippingCity": "Jakarta Pusat",
  "shippingProvince": "DKI Jakarta",
  "postalCode": "10220",
  "courierName": "JNE",
  "courierService": "REG",
  "trackingNumber": "JNE123456789",
  "expiryTime": "2024-01-15T10:45:00Z",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

#### Logic expiryTime:
```javascript
expiryTime = new Date(Date.now() + 15 * 60 * 1000);
// 15 menit dari waktu order dibuat
```

---

### **6. OrderItem**

**Deskripsi:** Item dalam pesanan (denormalized untuk historical data)

#### Atribut:

| Field | Type | Constraint | Deskripsi |
|-------|------|------------|-----------|
| `id` | String | PRIMARY KEY | Unique identifier (CUID) |
| `orderId` | String | FOREIGN KEY, NOT NULL | Referensi ke Order |
| `productId` | String | FOREIGN KEY, NOT NULL | Referensi ke Product |
| `variantId` | String? | FOREIGN KEY, NULLABLE | Referensi ke Variant (optional) |
| `variantName` | String? | NULLABLE | Nama varian (snapshot) |
| `quantity` | Int | NOT NULL | Jumlah item |
| `price` | Float | NOT NULL | Harga per unit (snapshot) |
| `subtotal` | Float | NOT NULL | price * quantity |
| `createdAt` | DateTime | DEFAULT: now() | Waktu dibuat |
| `updatedAt` | DateTime | AUTO UPDATE | Waktu update terakhir |

#### Relasi:
- **Belongs To**: Order (Many-to-One)
- **Belongs To**: Product (Many-to-One)
- **Belongs To**: Variant (Many-to-One, Optional)

#### Index:
- `orderId` - Untuk query items dalam order
- `productId` - Untuk analytics produk terlaris
- `variantId` - Untuk analytics varian terlaris

#### Contoh Data:

**Produk dengan varian:**
```json
{
  "id": "clx6f7g8h9i0j1k2l3m4n5o",
  "orderId": "ORDER-1705320000000-abc123",
  "productId": "clx3c4d5e6f7g8h9i0j1k2l",
  "variantId": "clx4d5e6f7g8h9i0j1k2l3m",
  "variantName": "Black",
  "quantity": 2,
  "price": 85000,
  "subtotal": 170000
}
```

**Produk tanpa varian:**
```json
{
  "id": "clx7g8h9i0j1k2l3m4n5o6p",
  "orderId": "ORDER-1705320000000-abc123",
  "productId": "clx8h9i0j1k2l3m4n5o6p7q",
  "variantId": null,
  "variantName": null,
  "quantity": 1,
  "price": 50000,
  "subtotal": 50000
}
```

#### Denormalisasi:
**Mengapa `variantName` dan `price` disimpan?**
- ✅ **Historical Accuracy**: Jika harga produk/varian berubah, order lama tetap menunjukkan harga saat pembelian
- ✅ **Data Integrity**: Jika varian dihapus, order tetap punya informasi lengkap
- ✅ **Performance**: Tidak perlu JOIN ke tabel Product/Variant untuk display order
- ✅ **Audit Trail**: Jejak harga untuk analisis bisnis

---

## 🔗 Relasi Database

### **Tipe Relasi:**

#### **1. One-to-Many (1:N)**

**User → Order**
```prisma
model User {
  id     String  @id @default(cuid())
  orders Order[] // Array of orders
}

model Order {
  id     String @id
  userId String
  user   User   @relation(fields: [userId], references: [id])
}
```

**Category → Product**
```prisma
model Category {
  id       String    @id @default(cuid())
  products Product[] // Array of products
}

model Product {
  id         String   @id @default(cuid())
  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])
}
```

**Product → Variant**
```prisma
model Product {
  id       String    @id @default(cuid())
  variants Variant[] // Array of variants
}

model Variant {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id])
}
```

**Order → OrderItem**
```prisma
model Order {
  id    String      @id
  items OrderItem[] // Array of items
}

model OrderItem {
  id      String @id @default(cuid())
  orderId String
  order   Order  @relation(fields: [orderId], references: [id])
}
```

#### **2. Many-to-Many (N:M) - Through Junction Table**

**Product ↔ Order (through OrderItem)**
```
Product ──────< OrderItem >────── Order
```

- Satu Product bisa ada di banyak OrderItem
- Satu Order bisa punya banyak OrderItem
- OrderItem adalah junction table dengan data tambahan

---

## 🔍 Query Examples

### **1. Get User with All Orders**
```prisma
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    orders: {
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }
  }
});
```

### **2. Get Product with Variants**
```prisma
const product = await prisma.product.findUnique({
  where: { id: productId },
  include: {
    category: true,
    variants: {
      orderBy: { name: 'asc' }
    }
  }
});
```

### **3. Get Order Details**
```prisma
const order = await prisma.order.findUnique({
  where: { id: orderId },
  include: {
    user: {
      select: { name: true, email: true }
    },
    items: {
      include: {
        product: {
          select: { name: true, images: true }
        }
      }
    }
  }
});
```

### **4. Get Products by Category**
```prisma
const products = await prisma.product.findMany({
  where: { categoryId: categoryId },
  include: {
    variants: true
  },
  orderBy: { createdAt: 'desc' }
});
```

### **5. Get Expired Orders (for auto-cancel)**
```prisma
const expiredOrders = await prisma.order.findMany({
  where: {
    status: 'UNPAID',
    expiryTime: { lt: new Date() }
  },
  include: {
    items: {
      include: {
        variant: true,
        product: true
      }
    }
  }
});
```

---

## 📊 Database Statistics

### **Estimasi Ukuran Data:**

| Tabel | Estimasi Rows | Avg Size/Row | Total Size |
|-------|---------------|--------------|------------|
| User | 1,000 - 10,000 | 500 bytes | 0.5 - 5 MB |
| Category | 5 - 20 | 200 bytes | < 1 KB |
| Product | 100 - 1,000 | 1 KB | 100 KB - 1 MB |
| Variant | 200 - 3,000 | 300 bytes | 60 KB - 900 KB |
| Order | 5,000 - 100,000 | 800 bytes | 4 - 80 MB |
| OrderItem | 10,000 - 300,000 | 300 bytes | 3 - 90 MB |
| **Total** | | | **~10 - 200 MB** |

### **Growth Rate:**
- Users: +100/bulan
- Products: +20/bulan
- Orders: +500/bulan
- OrderItems: +1,500/bulan

---

## 🔐 Data Integrity

### **Constraints:**

**Primary Keys:**
- Semua tabel punya PRIMARY KEY (CUID atau custom format)
- Guarantee uniqueness

**Foreign Keys:**
- ON DELETE CASCADE: OrderItem → Order
- ON DELETE RESTRICT: Product → Category (prevent delete jika ada produk)
- ON DELETE RESTRICT: Product → OrderItem (prevent delete jika ada order)

**Unique Constraints:**
- User.email (UNIQUE)
- Category.name (UNIQUE)

**Check Constraints:**
- Product.price >= 0
- Product.stock >= 0
- Variant.price >= 0
- Variant.stock >= 0
- Order.total >= 0
- OrderItem.quantity > 0

**Not Null:**
- Semua field penting adalah NOT NULL
- Optional fields menggunakan nullable (?)

---

## 📌 Kesimpulan

Database schema PERON.ID dirancang dengan prinsip:

✅ **Normalisasi**: Mengurangi redundansi data
✅ **Denormalisasi Strategis**: OrderItem untuk historical accuracy
✅ **Referential Integrity**: Foreign key constraints
✅ **Flexibility**: Support produk dengan/tanpa varian
✅ **Performance**: Index pada field yang sering di-query
✅ **Audit Trail**: Timestamp (createdAt, updatedAt) di semua tabel
✅ **Scalability**: Structure mendukung pertumbuhan data

ERD ini menjadi blueprint untuk implementasi database dan panduan untuk development team.
