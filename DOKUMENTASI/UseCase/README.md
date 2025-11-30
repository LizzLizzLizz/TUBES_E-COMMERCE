# Dokumentasi Use Case Diagram - PERON.ID

## 📋 Deskripsi

Use Case Diagram menggambarkan interaksi antara aktor (pengguna sistem) dengan fungsionalitas yang disediakan oleh sistem PERON.ID. Dokumentasi ini menjelaskan setiap use case dari perspektif berbagai aktor yang terlibat dalam sistem.

---

## 👥 1. General Use Case Diagram

**File:** `General Use Case Diagram.jpg`

### Deskripsi
Diagram overview yang menampilkan semua aktor dan use case utama dalam sistem secara komprehensif.

### Aktor dalam Sistem:

#### **1. Guest (Pengunjung)**
Pengguna yang belum login/register

**Karakteristik:**
- Tidak memiliki akun
- Akses terbatas
- Cart disimpan di localStorage (temporary)

**Use Cases:**
- 👁️ Browse Products (Melihat katalog produk)
- 🔍 Search Products (Mencari produk)
- 🏷️ Filter by Category (Filter berdasarkan kategori)
- 📦 View Product Details (Melihat detail produk)
- 🛒 Add to Cart (Menambah ke keranjang)
- 📝 Register Account (Membuat akun baru)
- 🔑 Login (Masuk ke sistem)

#### **2. Customer (Pelanggan)**
Pengguna yang sudah login dengan role USER

**Karakteristik:**
- Memiliki akun aktif
- Cart persisten (linked to account)
- Dapat melakukan pembelian
- Akses ke order history

**Use Cases:**
- Semua Guest use cases +
- 💳 Checkout (Proses pembelian)
- 📍 Manage Shipping Address (Kelola alamat)
- 🚚 Calculate Shipping Cost (Hitung ongkir)
- 💰 Make Payment (Melakukan pembayaran)
- 📋 View Order History (Lihat riwayat pesanan)
- 🔍 Track Order (Lacak pesanan)
- ❌ Cancel Order (Batalkan pesanan - kondisi tertentu)
- 👤 Manage Profile (Kelola profil)
- 🔓 Logout (Keluar dari sistem)

#### **3. Admin**
Pengguna dengan role ADMIN

**Karakteristik:**
- Akses penuh ke sistem
- Dapat mengelola data master
- Dapat mengelola order semua customer
- Dashboard analytics

**Use Cases:**
- Semua Customer use cases +
- 📊 View Dashboard (Lihat dashboard analytics)
- 🏪 Manage Products (Kelola produk)
  - Create Product (Tambah produk)
  - Update Product (Edit produk)
  - Delete Product (Hapus produk)
  - Manage Variants (Kelola varian)
- 🗂️ Manage Categories (Kelola kategori)
- 📦 Manage Orders (Kelola pesanan)
  - View All Orders (Lihat semua pesanan)
  - Update Order Status (Update status pesanan)
  - Process Order (Proses pesanan)
  - Ship Order (Kirim pesanan)
  - Complete Order (Selesaikan pesanan)
  - Cancel Order (Batalkan pesanan)
- 📊 Manage Stock (Kelola stok)
- 👥 View Users (Lihat data pengguna)
- 📈 View Reports (Lihat laporan)

#### **4. System (Sistem)**
Automated processes yang berjalan tanpa interaksi manusia

**Use Cases:**
- ⏰ Auto-Cancel Expired Orders (Otomatis batalkan order expired)
- 📧 Send Email Notifications (Kirim notifikasi email)
- 🔄 Process Payment Webhook (Proses notifikasi pembayaran)
- 📊 Update Stock Automatically (Update stok otomatis)
- 🔐 Validate Session (Validasi sesi)

#### **5. External Systems**
Sistem eksternal yang terintegrasi

**Services:**
- 💳 **Midtrans**: Payment processing
- 🚚 **Biteship**: Shipping calculation
- 📧 **Resend**: Email delivery
- 🗺️ **Google Maps**: Address autocomplete

---

## 🎯 2. Detailed Use Case Diagram

**File:** `Detailed Use Case Diagram.jpg`

### Deskripsi
Diagram detail yang menampilkan relasi antar use case menggunakan notasi `<<include>>`, `<<extend>>`, dan generalisasi.

---

## 📝 Use Case Specifications

### **A. Guest Use Cases**

#### **UC-001: Browse Products**

**Aktor:** Guest, Customer, Admin

**Deskripsi:** Melihat daftar produk yang tersedia

**Precondition:**
- Tidak ada (public access)

**Main Flow:**
1. Aktor mengakses halaman products
2. Sistem menampilkan grid/list produk
3. Sistem menampilkan thumbnail, nama, harga
4. Aktor dapat scroll untuk melihat lebih banyak

**Postcondition:**
- Produk ditampilkan ke aktor

**Alternative Flow:**
- Tidak ada produk: Tampilkan "No products available"

---

#### **UC-002: Search Products**

**Aktor:** Guest, Customer, Admin

**Deskripsi:** Mencari produk berdasarkan keyword

**Precondition:**
- Berada di halaman products

**Main Flow:**
1. Aktor input keyword di search bar
2. Sistem filter produk berdasarkan:
   - Nama produk (LIKE '%keyword%')
   - Deskripsi produk
3. Sistem tampilkan hasil pencarian
4. Aktor dapat clear search

**Postcondition:**
- Hasil pencarian ditampilkan

**Business Rules:**
- Search case-insensitive
- Minimum 2 karakter

---

#### **UC-003: Filter by Category**

**Aktor:** Guest, Customer, Admin

**Deskripsi:** Filter produk berdasarkan kategori

**Precondition:**
- Berada di halaman products
- Kategori tersedia di sistem

**Main Flow:**
1. Aktor klik kategori tertentu
2. Sistem filter produk WHERE categoryId = selected
3. Sistem tampilkan produk filtered
4. Aktor dapat reset filter

**Postcondition:**
- Produk ter-filter ditampilkan

**Business Rules:**
- Default: Tampilkan semua kategori

---

#### **UC-004: View Product Details**

**Aktor:** Guest, Customer, Admin

**Deskripsi:** Melihat informasi lengkap produk

**Precondition:**
- Produk ada di database

**Main Flow:**
1. Aktor klik produk dari list
2. Sistem redirect ke `/products/:id`
3. Sistem tampilkan:
   - Gambar produk (carousel jika multiple)
   - Nama produk
   - Deskripsi lengkap
   - Harga
   - Stok availability
   - Varian (jika ada)
   - Tombol Add to Cart
4. Aktor dapat back ke list

**Postcondition:**
- Detail produk ditampilkan

**Alternative Flow:**
- Produk tidak ditemukan: 404 page

---

#### **UC-005: Add to Cart**

**Aktor:** Guest, Customer

**Deskripsi:** Menambahkan produk ke keranjang

**Precondition:**
- Berada di halaman product detail
- Produk memiliki stok

**Main Flow:**
1. Aktor pilih varian (jika ada)
2. Aktor input quantity
3. Aktor klik "Add to Cart"
4. Sistem validasi:
   - Stok tersedia >= quantity
   - Variant selected (jika required)
5. Sistem tambahkan ke CartContext
6. Sistem update localStorage
7. Sistem tampilkan success toast
8. Sistem update cart badge count

**Postcondition:**
- Item ditambahkan ke cart

**Alternative Flow:**
- Stok tidak cukup: Tampilkan "Only X items left"
- Varian tidak dipilih: Tampilkan "Please select variant"

**Business Rules:**
- Max quantity per item: 99
- Min quantity: 1

---

#### **UC-006: Register Account**

**Aktor:** Guest

**Deskripsi:** Membuat akun baru

**Precondition:**
- Belum memiliki akun

**Main Flow:**
1. Aktor klik "Register" di navbar
2. Sistem tampilkan form register
3. Aktor isi:
   - Name
   - Email
   - Password
   - Confirm Password
4. Aktor klik "Register"
5. Sistem validasi:
   - Email format valid
   - Email belum terdaftar
   - Password min 8 karakter
   - Password match
6. Sistem hash password (bcrypt)
7. Sistem create User (role: USER)
8. Sistem kirim welcome email
9. Sistem auto-login user
10. Sistem redirect ke homepage

**Postcondition:**
- Akun dibuat
- User logged in

**Alternative Flow:**
- Email sudah terdaftar: "Email already registered"
- Validation gagal: Tampilkan error message

**Business Rules:**
- Email harus unique
- Password hashing: bcrypt (10 rounds)
- Default role: USER

---

#### **UC-007: Login**

**Aktor:** Guest

**Deskripsi:** Masuk ke sistem dengan akun existing

**Precondition:**
- Sudah memiliki akun

**Main Flow:**
1. Aktor klik "Login" di navbar
2. Sistem tampilkan form login
3. Aktor isi:
   - Email
   - Password
4. Aktor klik "Login"
5. Sistem validasi credentials
6. Sistem create session (JWT)
7. Sistem set session cookie
8. Sistem merge guest cart (jika ada)
9. Sistem redirect ke previous page / homepage

**Postcondition:**
- User logged in
- Session active

**Alternative Flow:**
- Invalid credentials: "Invalid email or password"
- Account not found: "Account not found"

**Business Rules:**
- Session duration: 30 hari
- Max failed attempts: 5 (lock 15 menit)

---

### **B. Customer Use Cases**

#### **UC-008: Checkout**

**Aktor:** Customer

**Deskripsi:** Proses pembelian dari cart

**Precondition:**
- Customer logged in
- Cart tidak kosong
- Semua items memiliki stok

**Main Flow:**
1. Customer klik "Checkout" di cart page
2. Sistem redirect ke `/checkout`
3. Sistem auto-fill user data:
   - Name
   - Phone (jika ada)
   - Address (jika ada)
4. Customer lengkapi/edit shipping info:
   - Full address
   - Province
   - City
   - Postal code
5. Customer klik "Calculate Shipping"
6. **Include**: Calculate Shipping Cost
7. Customer pilih courier & service
8. Sistem tampilkan order summary:
   - Items total
   - Shipping cost
   - Grand total
9. Customer klik "Pay Now"
10. **Include**: Make Payment

**Postcondition:**
- Order dibuat
- Payment initiated

**Alternative Flow:**
- Cart empty: Redirect ke `/products`
- Stock berubah: Tampilkan error + update cart
- Shipping calculation gagal: Tampilkan error

**Business Rules:**
- Minimum order: Rp 10,000
- Shipping required untuk semua order

---

#### **UC-009: Calculate Shipping Cost**

**Aktor:** System (included by Checkout)

**Deskripsi:** Menghitung ongkos kirim melalui Biteship API

**Precondition:**
- Customer input postal code
- Cart items tersedia

**Main Flow:**
1. Sistem collect data:
   - Origin: Jakarta Pusat (12920)
   - Destination: Customer postal code
   - Items: Name, weight (500g/item), value
   - Couriers: JNE, JNT, SiCepat, AnterAja, Ninja
2. Sistem call Biteship API: POST /v1/rates/couriers
3. Biteship process & return pricing
4. Sistem tampilkan options:
   - Courier name & service
   - Price
   - Estimated delivery time
5. Customer select option
6. Sistem update shippingCost di order summary

**Postcondition:**
- Shipping options ditampilkan
- Shipping cost selected

**Alternative Flow:**
- Postal code invalid: "Invalid postal code"
- API error: "Unable to calculate shipping"

**Business Rules:**
- Default weight: 500g per item
- Timeout: 30 detik

---

#### **UC-010: Make Payment**

**Aktor:** Customer

**Deskripsi:** Melakukan pembayaran melalui Midtrans

**Precondition:**
- Checkout completed
- Shipping selected

**Main Flow:**
1. Sistem generate Order ID: ORDER-{timestamp}-{random}
2. Sistem START TRANSACTION:
   - Create Order (status: UNPAID, expiryTime: +15min)
   - Create OrderItems[]
   - Reduce stock (variant/product)
3. Sistem COMMIT TRANSACTION
4. Sistem call Midtrans API:
   - transaction_details: { order_id, gross_amount }
   - customer_details: { name, email, phone }
   - item_details: [{ name, price, quantity }]
5. Midtrans return: { token, redirect_url }
6. Sistem return token ke client
7. Client load Midtrans Snap(token)
8. Customer pilih payment method
9. Customer complete payment
10. **Extend**: Process Payment Webhook (async)

**Postcondition:**
- Order dibuat dengan status UNPAID
- Payment popup ditampilkan

**Alternative Flow:**
- Stock berubah (race condition): Rollback + Error
- Midtrans API error: Rollback + "Payment service unavailable"

**Business Rules:**
- Order expires dalam 15 menit
- Stock reduced immediately (prevent overbooking)

---

#### **UC-011: View Order History**

**Aktor:** Customer

**Deskripsi:** Melihat daftar pesanan

**Precondition:**
- Customer logged in

**Main Flow:**
1. Customer klik "My Orders"
2. Sistem query orders WHERE userId = current user
3. Sistem tampilkan list orders:
   - Order ID
   - Date
   - Status
   - Total
   - Items summary
4. Sorted by: createdAt DESC
5. Customer dapat klik untuk detail

**Postcondition:**
- Order history ditampilkan

**Alternative Flow:**
- Tidak ada order: "No orders yet"

---

#### **UC-012: Track Order**

**Aktor:** Customer

**Deskripsi:** Melacak status pesanan

**Precondition:**
- Order exists
- Order belongs to customer

**Main Flow:**
1. Customer klik order dari history
2. Sistem tampilkan order details:
   - Order ID
   - Date
   - Status (dengan visual progress)
   - Items detail
   - Shipping info
   - Tracking number (jika SHIPPED)
   - Payment info
3. Jika SHIPPED: Link ke tracking eksternal

**Postcondition:**
- Order details ditampilkan

**Status Progress:**
```
UNPAID → PROCESSING → SHIPPED → COMPLETED
              ↓
          CANCELLED
```

---

#### **UC-013: Cancel Order**

**Aktor:** Customer

**Deskripsi:** Membatalkan pesanan

**Precondition:**
- Order exists
- Order belongs to customer
- Order status = UNPAID

**Main Flow:**
1. Customer klik "Cancel Order"
2. Sistem tampilkan confirmation dialog
3. Customer confirm
4. Sistem START TRANSACTION:
   - Get order items
   - Restore stock (variant/product += quantity)
   - Update order status = CANCELLED
5. Sistem COMMIT TRANSACTION
6. Sistem kirim cancellation email
7. Sistem tampilkan success message

**Postcondition:**
- Order cancelled
- Stock restored

**Alternative Flow:**
- Status bukan UNPAID: "Cannot cancel order"
- Transaction gagal: Error message

**Business Rules:**
- Hanya UNPAID order yang bisa dicancel customer
- PROCESSING/SHIPPED harus contact admin

---

#### **UC-014: Manage Profile**

**Aktor:** Customer

**Deskripsi:** Mengelola informasi profil

**Precondition:**
- Customer logged in

**Main Flow:**
1. Customer klik profile icon → "Account"
2. Sistem tampilkan profile page:
   - Display mode: Name, Email, Phone, Address
3. Customer klik "Edit Profile"
4. Sistem tampilkan edit form
5. Customer update fields
6. Customer klik "Save"
7. Sistem validasi input
8. Sistem update User record
9. Sistem tampilkan success message

**Postcondition:**
- Profile updated

**Alternative Flow:**
- Validation gagal: Error message
- Email change: Require re-verification (optional)

**Business Rules:**
- Email tidak bisa diubah (atau require verification)
- Password change: Require current password

---

### **C. Admin Use Cases**

#### **UC-015: View Dashboard**

**Aktor:** Admin

**Deskripsi:** Melihat analytics & statistics

**Precondition:**
- Admin logged in

**Main Flow:**
1. Admin akses `/admin/dashboard`
2. Sistem calculate & tampilkan:
   - Total orders (today, this month, all time)
   - Total revenue
   - Total products
   - Total customers
   - Top selling products
   - Recent orders
   - Stock alerts (low stock items)
   - Order status distribution (chart)

**Postcondition:**
- Dashboard ditampilkan

---

#### **UC-016: Manage Products**

**Aktor:** Admin

**Deskripsi:** CRUD operations untuk produk

**Sub Use Cases:**

##### **UC-016-A: Create Product**

**Main Flow:**
1. Admin klik "Add Product"
2. Sistem tampilkan form:
   - Name
   - Description
   - Price
   - Category
   - Images (upload)
   - Stock type: Product-based / Variant-based
3. Jika Variant-based:
   - Admin add variants (name, price, stock)
4. Admin klik "Save"
5. Sistem validasi
6. Sistem upload images ke Firebase
7. Sistem create Product record
8. Jika ada variants: Create Variant records
9. Sistem tampilkan success

**Business Rules:**
- Min 1 image, max 5 images
- Price > 0
- Stock >= 0

##### **UC-016-B: Update Product**

**Main Flow:**
1. Admin pilih product dari list
2. Sistem load product data
3. Admin edit fields
4. Admin update/add/delete variants
5. Admin klik "Save"
6. Sistem validasi
7. Sistem update Product record
8. Sistem update images (jika changed)
9. Sistem update variants

**Business Rules:**
- Tidak bisa delete variant yang ada di order

##### **UC-016-C: Delete Product**

**Main Flow:**
1. Admin pilih product
2. Admin klik "Delete"
3. Sistem cek: Product ada di order?
4. Jika tidak: Confirm → Delete
5. Jika ya: Error "Cannot delete product with orders"

**Business Rules:**
- Protect historical data

---

#### **UC-017: Manage Orders**

**Aktor:** Admin

**Deskripsi:** Mengelola semua pesanan

**Sub Use Cases:**

##### **UC-017-A: View All Orders**

**Main Flow:**
1. Admin akses `/admin/orders`
2. Sistem tampilkan table orders:
   - Order ID
   - Customer name
   - Date
   - Status
   - Total
   - Actions
3. Admin dapat filter by status
4. Admin dapat search by order ID / email

##### **UC-017-B: Update Order Status**

**Main Flow:**
1. Admin klik order
2. Sistem tampilkan detail
3. Admin pilih action berdasarkan status:

**UNPAID → CANCELLED:**
- Restore stock
- Send email

**PROCESSING → SHIPPED:**
- Input tracking number
- Send shipping email

**SHIPPED → COMPLETED:**
- Confirm delivery
- Send completion email

**PROCESSING → CANCELLED:**
- Restore stock
- Send cancellation email

4. Sistem update status
5. Sistem execute actions

---

#### **UC-018: Manage Stock**

**Aktor:** Admin

**Deskripsi:** Update stok manual

**Main Flow:**
1. Admin akses product/variant
2. Admin klik "Update Stock"
3. Admin input new stock value
4. Sistem validasi: stock >= 0
5. Sistem log change:
   - Admin ID
   - Old value
   - New value
   - Timestamp
6. Sistem update stock
7. Jika stock < 10: Send low stock alert

**Postcondition:**
- Stock updated
- Audit log created

---

### **D. System Use Cases**

#### **UC-019: Auto-Cancel Expired Orders**

**Aktor:** System (Cron Job)

**Deskripsi:** Otomatis batalkan order yang expired

**Precondition:**
- Cron job triggered (every 5 min)

**Main Flow:**
1. Sistem verify CRON_SECRET
2. Sistem query expired orders:
   - status = UNPAID
   - expiryTime < now()
3. Loop each order:
   - START TRANSACTION
   - Get order items
   - Restore stock (variant/product)
   - Update status = CANCELLED
   - COMMIT TRANSACTION
   - Add to successList
4. Sistem log results:
   - Count cancelled
   - Order IDs
   - Any failures

**Postcondition:**
- Expired orders cancelled
- Stock restored

**Business Rules:**
- Run every 5 minutes
- Individual transaction per order
- Log all results

---

#### **UC-020: Process Payment Webhook**

**Aktor:** System (triggered by Midtrans)

**Deskripsi:** Memproses notifikasi pembayaran

**Precondition:**
- Webhook received from Midtrans

**Main Flow:**
1. Sistem verify signature (SHA512)
2. Jika invalid: Return 401
3. Sistem parse payload:
   - order_id
   - transaction_status
   - fraud_status
4. Sistem find order
5. Jika tidak ada: Return 404
6. Sistem cek idempotency (sudah diproses?)
7. Jika sudah: Return 200
8. Sistem evaluate status:

**capture/settlement + accept:**
- newStatus = PROCESSING
- Send payment success email

**pending:**
- newStatus = UNPAID

**cancel/deny/expire:**
- newStatus = CANCELLED
- ⚠️ **BUG**: Should restore stock (NOT IMPLEMENTED)

9. Sistem update order status
10. Sistem return 200 OK

**Postcondition:**
- Order status updated
- Email sent

**Business Rules:**
- Idempotent (dapat dipanggil multiple times)
- Must verify signature

---

#### **UC-021: Send Email Notifications**

**Aktor:** System

**Deskripsi:** Mengirim notifikasi email

**Triggered By:**
- User registration → Welcome email
- Payment success → Confirmation email
- Order shipped → Shipping email
- Order completed → Completion email
- Order cancelled → Cancellation email

**Main Flow:**
1. Sistem triggered by event
2. Sistem prepare email data:
   - Template
   - Recipient
   - Subject
   - Body (HTML)
   - Dynamic data (order details, etc)
3. Sistem call Resend API
4. Resend deliver email
5. Sistem log result

**Postcondition:**
- Email sent

**Alternative Flow:**
- API error: Retry 3x
- Still fail: Log error + Alert admin

---

## 🔗 Use Case Relationships

### **Include Relationship** (`<<include>>`)

Digunakan ketika satu use case WAJIB menggunakan use case lain:

```
Checkout <<include>> Calculate Shipping Cost
Checkout <<include>> Make Payment
Make Payment <<include>> Process Payment Webhook (async)
```

### **Extend Relationship** (`<<extend>>`)

Digunakan ketika use case menambahkan behavior OPTIONAL:

```
Browse Products <<extend>> Filter by Category
Browse Products <<extend>> Search Products
View Product Details <<extend>> Add to Cart
```

### **Generalization**

Digunakan untuk inheritance aktor:

```
Customer → Guest (Customer is a Guest with more privileges)
Admin → Customer (Admin is a Customer with admin privileges)
```

---

## 📌 Kesimpulan

Use Case Diagram PERON.ID mencakup:

✅ **4 Aktor Utama**: Guest, Customer, Admin, System
✅ **21+ Use Cases**: Dari browsing hingga order management
✅ **External Integration**: Midtrans, Biteship, Resend, Google Maps
✅ **Automated Processes**: Auto-cancel, webhook, email notifications
✅ **Role-Based Access**: Clear separation of concerns

Diagram ini menjadi blueprint untuk:
- 📋 **Requirements**: Functional requirements
- 🧪 **Testing**: Test case generation
- 📖 **Documentation**: User manual & API docs
- 🎯 **Development**: Feature implementation guide
