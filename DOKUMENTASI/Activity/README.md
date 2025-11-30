# Dokumentasi Activity Diagram - PERON.ID

## 📋 Deskripsi

Activity Diagram menggambarkan alur aktivitas dan proses bisnis yang terjadi dalam sistem PERON.ID. Diagram ini menunjukkan langkah-langkah yang dilakukan oleh pengguna, admin, dan sistem secara berurutan, termasuk kondisi percabangan dan keputusan yang diambil.

---

## 🛒 1. Complete User Purchase Flow

**File:** `Complete User Purchase Flow.jpg`

### Deskripsi
Diagram ini menggambarkan alur lengkap pembelian produk dari perspektif pelanggan, mulai dari browsing produk hingga pembayaran berhasil.

### Proses Utama:

#### A. **Browsing & Pemilihan Produk**
1. User mengunjungi website
2. Menjelajahi katalog produk
3. Melihat detail produk
4. Memilih varian (jika ada: ukuran, warna, dll)
5. Mengecek ketersediaan stok

#### B. **Manajemen Keranjang**
1. Menambahkan produk ke keranjang
2. Melihat isi keranjang
3. Mengubah kuantitas item
4. Validasi stok tersedia
5. Menghapus item (opsional)

#### C. **Proses Checkout**
1. Memulai checkout
2. Verifikasi login (redirect ke login jika belum login)
3. Mengisi informasi pengiriman:
   - Nama penerima
   - Alamat lengkap
   - Provinsi & Kota
   - Kode pos
4. Memilih kurir pengiriman (JNE, JNT, SiCepat, AnterAja, Ninja Express)
5. Kalkulasi ongkos kirim otomatis
6. Review ringkasan pesanan

#### D. **Pembayaran**
1. Klik "Pay Now"
2. Sistem membuat order di database
3. Mengurangi stok produk
4. Set waktu kadaluarsa (15 menit)
5. Memanggil Midtrans API
6. Membuka Midtrans Snap popup

#### E. **Hasil Pembayaran**
- **Berhasil**: Webhook update status → Clear cart → Halaman sukses
- **Dibatalkan/Expired**: Webhook update status → Cart tetap tersimpan
- **Gagal**: Error message → User dapat retry

### Decision Points:
- ✓ Stok tersedia/habis
- ✓ User login/belum login
- ✓ Lanjut belanja/checkout
- ✓ Status pembayaran (sukses/gagal/batal)

### Catatan Penting:
- ⚠️ **Bug Teridentifikasi**: Stok TIDAK dikembalikan saat pembayaran dibatalkan/expired
- ⏱️ Order memiliki masa berlaku 15 menit
- 💾 Cart tetap tersimpan saat pembayaran gagal (memungkinkan retry)

---

## 👨‍💼 2. Admin Order Management

**File:** `Admin Order Management.jpg`

### Deskripsi
Diagram ini menunjukkan semua aktivitas yang dapat dilakukan admin dalam mengelola pesanan pelanggan di berbagai status.

### Proses Utama:

#### A. **Manajemen Daftar Pesanan**
1. Admin membuka halaman Order Management
2. Melihat semua pesanan
3. Menerapkan filter:
   - Filter berdasarkan status
   - Filter berdasarkan rentang tanggal
   - Pencarian order ID/email
4. Memilih pesanan untuk detail

#### B. **Pengelolaan Status UNPAID**
- **Opsi**: Tunggu pembayaran / Cancel order
- **Aksi Cancel**:
  1. Cancel pesanan
  2. Kembalikan stok produk
  3. Update status ke CANCELLED
  4. Log aktivitas admin

#### C. **Pengelolaan Status PROCESSING**
- **Opsi 1 - Pack & Ship**:
  1. Pack pesanan
  2. Update status ke SHIPPED
  3. Input nomor resi
  4. Kirim email notifikasi pengiriman
  5. Log aktivitas

- **Opsi 2 - Cancel** (dengan validasi):
  1. Cek apakah bisa dibatalkan
  2. Cancel pesanan
  3. Kembalikan stok
  4. Update status ke CANCELLED
  5. Kirim email pembatalan
  6. Log aktivitas

#### D. **Pengelolaan Status SHIPPED**
- **Opsi 1**: Update informasi tracking
- **Opsi 2**: Tandai sebagai delivered
  1. Konfirmasi pengiriman
  2. Update status ke COMPLETED
  3. Kirim email konfirmasi
  4. Log aktivitas

#### E. **Pengelolaan Status COMPLETED**
- View detail pesanan
- Export invoice PDF

#### F. **Pengelolaan Status CANCELLED**
- View only (read-only)
- Opsi delete order record (dengan konfirmasi)

### Fitur Logging:
- ✅ Semua aksi admin dicatat
- ✅ Audit trail lengkap
- ✅ Timestamp setiap perubahan

### Email Notifications:
- 📧 Pengiriman barang (SHIPPED)
- 📧 Pembatalan pesanan (CANCELLED)
- 📧 Pengantaran sukses (COMPLETED)

---

## 📦 3. Admin Product Management

**File:** `Admin Product Management.jpg`

### Deskripsi
Diagram ini menjelaskan proses CRUD (Create, Read, Update, Delete) produk oleh admin, termasuk manajemen varian produk.

### Proses Utama:

#### A. **Create Product (Tambah Produk Baru)**
1. Klik "Create Product"
2. Isi informasi dasar:
   - Nama produk
   - Deskripsi
   - Harga
3. Pilih kategori
4. Upload gambar produk
5. **Pilihan Stok**:
   - **Dengan Varian**: 
     - Tentukan tipe varian (Size/Color/dll)
     - Tambah opsi varian
     - Isi info per varian (nama, harga, stok)
     - Tipe stok: Variant-Based
   - **Tanpa Varian**:
     - Set stok produk langsung
     - Tipe stok: Product-Based
6. Validasi form
7. Simpan ke database
8. Upload gambar ke storage
9. Tampilkan pesan sukses

#### B. **Update Product (Edit Produk)**
1. Pilih produk dari list
2. Load data produk
3. Tampilkan form edit
4. Modifikasi field yang diinginkan
5. **Update Gambar** (opsional):
   - Hapus gambar lama
   - Upload gambar baru
6. **Manajemen Varian**:
   - **Add**: Tambah varian baru
   - **Edit**: Modifikasi info varian
   - **Delete**: Hapus varian (dengan validasi order)
     - Cek apakah varian sudah ada di order
     - Jika ada: tampilkan error "Cannot delete"
     - Jika tidak: confirm delete → remove
7. Simpan perubahan
8. Validasi
9. Update database
10. Tampilkan pesan sukses

#### C. **Delete Product (Hapus Produk)**
1. Pilih produk
2. Konfirmasi delete
3. **Validasi**: Cek apakah produk ada di order
   - **Ada order**: Tampilkan error "Cannot delete product with orders"
   - **Tidak ada order**:
     - Delete dari database
     - Delete semua gambar
     - Delete semua varian
     - Tampilkan pesan sukses

### Validation Rules:
- ✅ Nama produk wajib diisi
- ✅ Harga harus angka positif
- ✅ Stok harus angka >= 0
- ✅ Kategori harus dipilih
- ✅ Minimal 1 gambar

### Proteksi Data:
- 🔒 Produk dengan order tidak bisa dihapus
- 🔒 Varian dengan order tidak bisa dihapus
- 🔒 Menjaga integritas data historis pesanan

---

## 🤖 4. Auto-Cancel Expired Orders

**File:** `Auto-Cancel Expired Orders.jpg`

### Deskripsi
Diagram ini menjelaskan proses otomatis pembatalan pesanan yang telah melewati batas waktu pembayaran (cron job yang berjalan setiap 5 menit).

### Proses Utama:

#### A. **Trigger Cron Job**
1. Cron job berjalan setiap 5 menit
2. Ambil waktu saat ini
3. Query order dengan kondisi:
   - Status = UNPAID
   - expiryTime < waktu sekarang

#### B. **Pemrosesan Expired Orders**
1. **Jika tidak ada order expired**: Log "No expired orders" → Selesai
2. **Jika ada order expired**:
   - Inisialisasi array: `cancelledOrderIds[]` dan `failedOrderIds[]`
   - Loop setiap order expired

#### C. **Proses Per Order (dengan Transaction)**
1. Mulai database transaction
2. Ambil semua order items
3. **Loop setiap item**:
   - Cek apakah ada varian
   - **Jika varian**: Restore stok varian += quantity
   - **Jika produk biasa**: Restore stok produk += quantity
4. Update status order ke CANCELLED
5. **Commit transaction**:
   - **Sukses**: Tambahkan ke `cancelledOrderIds[]`
   - **Gagal**: 
     - Rollback transaction
     - Log error dengan order ID
     - Tambahkan ke `failedOrderIds[]`

#### D. **Hasil Pemrosesan**
1. Log jumlah order yang berhasil dibatalkan + ID
2. **Jika ada yang gagal**:
   - Log jumlah & ID order yang gagal
   - ⚠️ **Rekomendasi**: Alert admin untuk review manual

### Karakteristik:
- ⏱️ **Interval**: Setiap 5 menit
- ⏳ **Timeout**: 15 menit dari pembuatan order
- 🔄 **Transaction**: Atomic operation (all or nothing)
- 📊 **Logging**: Lengkap untuk monitoring
- ⚠️ **Error Handling**: Individual per order (satu gagal tidak mempengaruhi yang lain)

### Catatan Penting:
- ✅ Stok dikembalikan secara atomic
- ⚠️ Order yang gagal dibatalkan perlu review manual
- 📈 Tidak ada retry mechanism (butuh improvement)

---

## 💳 5. Payment Webhook Processing

**File:** `Payment Webhook Processing.jpg`

### Deskripsi
Diagram ini menjelaskan bagaimana sistem memproses notifikasi pembayaran dari Midtrans secara real-time.

### Proses Utama:

#### A. **Verifikasi Webhook**
1. Terima webhook dari Midtrans
2. Verifikasi signature key (SHA512)
3. **Jika tidak valid**: Return 401 Unauthorized → Selesai
4. **Jika valid**: Lanjutkan proses

#### B. **Validasi Order**
1. Parse JSON payload
2. Extract data: order_id, transaction_status, fraud_status
3. Cari order berdasarkan ID
4. **Jika tidak ditemukan**: Log "Order Not Found" → Return 404 → Selesai
5. **Jika ditemukan**: Lanjutkan

#### C. **Cek Idempotency**
1. Cek apakah webhook sudah diproses sebelumnya
2. **Jika sudah**: Log "Duplicate Webhook" → Return 200 → Selesai
3. **Jika belum**: Lanjutkan

#### D. **Evaluasi Status Pembayaran**

**Status: capture/settlement**
- Cek fraud status
- **Jika accept**: newStatus = PROCESSING
- **Jika deny/challenge**: newStatus = CANCELLED

**Status: pending**
- newStatus = UNPAID

**Status: cancel/deny/expire**
- newStatus = CANCELLED

#### E. **Pemrosesan CANCELLED (dengan Restorasi Stok)**
⚠️ **FITUR BELUM DIIMPLEMENTASI - CRITICAL BUG**

Seharusnya:
1. Mulai transaction
2. Ambil order items
3. Loop setiap item:
   - Restore stok varian/produk
4. Update status order = CANCELLED
5. Commit transaction

Saat ini:
- ❌ Hanya update status
- ❌ Stok TIDAK dikembalikan (bug kritis)

#### F. **Update Order & Notifikasi**
1. Update order status
2. **Kirim Email**:
   - PROCESSING: Email pembayaran berhasil
   - CANCELLED: Email pembatalan
   - UNPAID: Skip notifikasi
3. Log webhook processing
4. Return 200 OK

### Security Features:
- 🔐 Signature verification dengan SHA512
- 🔐 Validasi order ID
- 🔐 Idempotency check (prevent double processing)

### Critical Issues:
- 🚨 **Bug**: Stok tidak dikembalikan saat cancelled/expired
- 🚨 **Missing**: Transaction untuk atomicity
- 🚨 **Missing**: Stock restoration logic

---

## 🔐 6. User Authentication Flow

**File:** `User Authentication Flow.jpg`

### Deskripsi
Diagram ini menjelaskan proses autentikasi pengguna, termasuk login, register, dan manajemen sesi.

### Proses Utama:

#### A. **Cek Status Awal**
1. User klik Login/Register
2. Cek sesi: Sudah login?
   - **Sudah**: Redirect ke Dashboard → Selesai
   - **Belum**: Tampilkan Auth Modal

#### B. **Login Flow**
1. Pilih tab Login
2. Isi email
3. Isi password
4. Klik Login
5. **Validasi Client-Side**:
   - **Gagal**: Tampilkan error validasi → Kembali ke form
   - **Sukses**: Lanjut ke server

6. **Autentikasi NextAuth**:
   - Call NextAuth Login API
   - **Error Types**:
     - Invalid Credentials → Tampilkan "Invalid credentials"
     - Account Not Found → Tampilkan "Account not found"
     - Other → Tampilkan generic error
   - Semua error → Kembali ke form login

7. **Login Berhasil**:
   - Create session
   - Set session cookie
   - **Cek Guest Cart**:
     - **Ada**: Merge dengan user cart → Update localStorage key
     - **Tidak ada**: Load user cart
   - Tutup modal
   - Refresh page/state
   - Selesai

#### C. **Register Flow**
1. Pilih tab Register
2. Isi nama
3. Isi email
4. Isi password
5. Konfirmasi password
6. Klik Register
7. **Validasi Client-Side**:
   - **Gagal**: Tampilkan error validasi → Kembali ke form
   - **Sukses**: Lanjut ke server

8. **Cek Email Tersedia**:
   - **Email sudah terdaftar**: Tampilkan "Email already registered" → Kembali ke form
   - **Email tersedia**: Lanjutkan

9. **Pembuatan Akun**:
   - Hash password dengan bcrypt
   - Create user di database (role = USER)
   - **Gagal**: Tampilkan error → Kembali ke form
   - **Sukses**:
     - Kirim welcome email
     - Auto login user
     - Create session
     - (Lanjut ke proses cart sync seperti login)

### Session Management:
- 🔑 JWT-based session
- 🍪 HTTP-only cookie
- ⏱️ Session expiry: 30 hari

### Cart Synchronization:
- 🛒 Guest cart key: `cart_guest`
- 🛒 User cart key: `cart_{email}`
- 🔄 Auto-merge saat login
- 💾 Persist di localStorage

### Security:
- 🔐 Password hashing: bcrypt (10 rounds)
- 🔐 CSRF protection: Built-in NextAuth
- 🔐 Session token: Encrypted JWT

---

## 📊 7. Admin Stock Management

**File:** `_Admin Stock Management.jpg`

### Deskripsi
Diagram ini menggambarkan semua operasi manajemen stok dalam sistem, baik dari sisi customer maupun admin.

### Proses Utama:

#### A. **Read Stock (Halaman Produk)**
1. Ambil data produk
2. Cek tipe stok:
   - **Ada varian**: Tampilkan stok per varian di selector
   - **Produk biasa**: Tampilkan stok sebagai "Available Qty"
3. Cek ketersediaan:
   - **Stok > 0**: Enable tombol "Add to Cart"
   - **Stok = 0**: Disable tombol + Tampilkan "Out of Stock"

#### B. **Read Stock (Halaman Cart)**
1. Ambil semua item di cart
2. Loop setiap item:
   - Ambil stok terkini dari database
   - Cek tipe (varian/produk)
   - Bandingkan stok dengan quantity di cart
   - **Stok >= Quantity**: Item valid
   - **Stok < Quantity**: Item invalid + Tampilkan error stok
3. Tampilkan cart dengan info stok

#### C. **Read Stock (Validasi Checkout)**
1. Validasi semua item di cart
2. **Semua valid**: Allow checkout
3. **Ada yang invalid**: Block checkout + Tampilkan stok issues

#### D. **Update Stock (Pembuatan Order)**
1. Mulai transaction
2. Lock records (Product/Variant)
3. Loop setiap order item:
   - Cek tipe (varian/produk)
   - **Varian**: `variant.stock -= quantity`
   - **Produk**: `product.stock -= quantity`
   - Cek apakah stok < 0
     - **Ya**: Rollback transaction → Error "Insufficient stock" → Order failed
     - **Tidak**: Lanjutkan
4. Commit transaction → Stok berkurang

#### E. **Update Stock (Pembatalan Order)**
1. Mulai transaction
2. Lock records
3. Ambil order items
4. Loop setiap item:
   - Cek tipe (varian/produk)
   - **Varian**: `variant.stock += quantity`
   - **Produk**: `product.stock += quantity`
5. Update status order = CANCELLED
6. Commit transaction → Stok dikembalikan

#### F. **Update Stock (Admin Manual)**
1. Admin buka form update stok
2. Input nilai stok baru
3. Validasi: Stok >= 0?
   - **Tidak**: Tampilkan "Invalid stock" → Kembali ke form
   - **Ya**: Lanjutkan
4. Update stok di database
5. Log perubahan stok:
   - Admin ID
   - Old value
   - New value
   - Timestamp
6. Cek apakah stok < 10?
   - **Ya**: Kirim low stock alert
   - **Tidak**: Selesai

### Database Transaction:
- 🔒 **Locking**: Record-level lock untuk prevent race condition
- ⚛️ **Atomicity**: All or nothing (commit/rollback)
- 🔄 **Consistency**: Stok selalu konsisten
- 📊 **Isolation**: Concurrent operations tidak bentrok

### Audit Logging:
- 📝 Log semua perubahan stok manual admin
- 📝 Include: Admin ID, timestamp, old/new value
- 📝 Untuk audit trail & accountability

### Notifications:
- ⚠️ Low stock alert (< 10 items)
- 📧 Email/notifikasi ke admin
- 🔔 Real-time monitoring

---

## 📌 Kesimpulan

Activity Diagram memberikan gambaran detail tentang:
- ✅ Alur proses bisnis yang jelas
- ✅ Decision points dan kondisi percabangan
- ✅ Interaksi antara user, admin, dan sistem
- ✅ Error handling dan validasi
- ✅ Transaction management
- ⚠️ Bug dan area yang perlu improvement

Diagram-diagram ini menjadi panduan implementasi dan dokumentasi untuk tim development.
