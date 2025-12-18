# Sistem Data Items - Inventory Management

Sistem manajemen inventory yang responsif dengan fitur lengkap untuk mengelola data items.

## 🚀 Fitur Utama

### 📝 Input Data
- Form input yang mudah digunakan dengan validasi real-time
- Mendukung semua field sesuai dengan gambar referensi
- Auto-generate kode item yang unik
- Responsive design untuk semua ukuran layar

### 📊 Tabel Data
- Tampilan tabel yang rapi dengan zebra striping
- Kolom "Kode Item" memiliki highlight khusus
- Pagination untuk data yang banyak
- Selection checkbox untuk bulk actions

### 🔍 Pencarian & Filter
- Pencarian berdasarkan nama, kode, merek, jenis, barcode, dan supplier
- Filter berdasarkan jenis, satuan, status jual, tipe, dan system HPP
- Auto-update dropdown filter berdasarkan data yang tersedia

### 📤 Export & Print
- Export ke format CSV (bisa dibuka di Excel)
- Export ke format JSON
- Print laporan dengan formatting yang rapi
- Laporan summary, detail, dan inventory

### 🎨 UI/UX
- Design modern dengan gradient header
- Animasi smooth untuk transisi
- Mobile-first responsive design
- Icons yang informatif
- Loading states dan feedback

## 📱 Responsive Design (Telah Diperbaiki!)

Sistem ini dirancang untuk bekerja dengan baik di:
- **Desktop** (1200px+): Tampilan lengkap dengan semua kolom + scroll indicators
- **Tablet** (769px - 1024px): Beberapa kolom disembunyikan + horizontal scroll
- **Mobile** (320px - 768px): Kolom penting + floating action buttons + horizontal scroll
- **Small Mobile** (320px - 480px): Minimal columns + touch-friendly interface

### 🆕 Perbaikan Mobile Terbaru:
- ✅ **Horizontal Scroll**: Tabel dapat di-scroll horizontal dengan smooth scrolling
- ✅ **Floating Action Buttons**: Tombol export dan delete yang tidak mengganggu (hanya di mobile)
- ✅ **Touch Swipe**: Support gesture swipe untuk navigasi tabel
- ✅ **Scroll Indicators**: Visual indicator untuk menunjukkan konten yang bisa di-scroll
- ✅ **Sticky Headers**: Header tabel tetap terlihat saat scroll
- ✅ **Touch-Friendly Checkboxes**: Checkbox yang lebih besar untuk mobile
- ✅ **Auto-center**: Tabel auto-center pada kolom penting di mobile

## 🛠️ Teknologi

- **Vanilla JavaScript ES6+**: Tidak menggunakan framework eksternal
- **CSS3**: Modern CSS dengan Flexbox dan Grid
- **HTML5**: Semantic HTML structure
- **Modules**: Modular architecture untuk maintainability

## 📂 Struktur File

```
├── index.html              # Main HTML file
├── styles/
│   ├── main.css           # Main styles
│   └── responsive.css     # Responsive design
├── js/
│   ├── app.js            # Main application
│   └── modules/
│       ├── ItemManager.js    # Data management
│       ├── TableRenderer.js  # Table display
│       ├── FormHandler.js    # Form handling
│       ├── FilterHandler.js  # Search & filter
│       ├── ExportHandler.js  # Export functionality
│       └── ModalHandler.js   # Modal dialogs
└── README.md              # Documentation
```

## 🎯 Field Data

| Field | Tipe | Required | Deskripsi |
|-------|------|----------|-----------|
| Kode Item | Text | ✅ | Kode unik produk |
| Barcode | Text | ❌ | Kode barcode |
| Nama Item | Text | ✅ | Nama lengkap produk |
| Stok | Number | ❌ | Jumlah stok |
| Satuan | Select | ❌ | Unit pengukuran |
| Rak | Text | ❌ | Lokasi rak |
| Jenis | Text | ❌ | Kategori produk |
| Merek | Text | ❌ | Nama merek |
| Harga Pokok | Number | ❌ | Harga beli |
| Harga Jual | Number | ❌ | Harga jual |
| Tipe | Select | ❌ | Jenis inventory |
| System HPP | Select | ❌ | Metode HPP |
| Stok Min | Number | ❌ | Batas minimum stok |
| Status Jual | Select | ❌ | Status penjualan |
| Keterangan | Textarea | ❌ | Catatan tambahan |
| Supplier | Text | ❌ | Kode supplier |

## 🚀 Cara Penggunaan

### 1. Menambah Item Baru
1. Klik tombol "Tambah Item Baru"
2. Isi form dengan data item
3. Klik "Simpan Data"
4. Item akan muncul di tabel

### 2. Mencari Item
1. Gunakan field "Cari" untuk pencarian teks
2. Atau gunakan dropdown filter untuk filter spesifik
3. Hasil akan otomatis terupdate

### 3. Mengedit Item
1. Klik tombol ✏️ di kolom Actions
2. Edit data di modal yang muncul
3. Klik "Simpan Perubahan"

### 4. Menghapus Item
1. Centang checkbox item yang ingin dihapus
2. Klik "Hapus Terpilih"
3. Atau klik tombol 🗑️ untuk hapus individual

### 5. Export Data
1. Klik "Export Excel" untuk download CSV
2. File dapat dibuka di Microsoft Excel
3. Atau gunakan browser untuk print laporan

## 🎨 Customization

### Menambah Field Baru
1. Edit `index.html` untuk menambah field di form dan table
2. Update `ItemManager.js` untuk handle field baru
3. Update `FormHandler.js` untuk validasi field baru

### Mengubah Style
1. Edit `styles/main.css` untuk styling utama
2. Edit `styles/responsive.css` untuk responsive design
3. CSS menggunakan CSS custom properties untuk konsistensi

### Menambah Fitur
1. Tambah method di module yang sesuai
2. Bind event di `app.js`
3. Update UI jika diperlukan

## 📝 Sample Data

Sistem sudah include sample data untuk demonstration:
- GIZEH ROLLBOX (AS01)
- FILTER REGULAR (AS161)
- TAS SEKOLAH ANAK (PR001)

## 🔧 Development

### Local Development
1. Clone atau download file
2. Buka `index.html` di browser
3. Sistem siap digunakan

### Adding Features
- Semua JavaScript menggunakan ES6+ modules
- Modular architecture memudahkan maintenance
- Event-driven architecture untuk scalability

## 📄 Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 🎯 Performance

- Lazy loading untuk table data
- Efficient DOM manipulation
- Minimal dependencies
- Optimized for mobile devices

## 📞 Support

Untuk pertanyaan atau pengembangan lebih lanjut, sistem ini dapat dengan mudah di-extend dengan fitur tambahan seperti:
- Database integration
- User authentication
- Advanced reporting
- Barcode scanning
- Stock movements tracking
- Multi-location support

## 📝 Changelog

### v1.1.0 (2025-12-18) - Mobile Improvements
**Fixed Issues:**
- ✅ **Horizontal Scroll**: Fixed table horizontal scrolling on mobile browsers
- ✅ **Button Size**: Reduced export/delete button sizes on mobile to avoid obstruction
- ✅ **Touch UX**: Improved touch targets and gestures for mobile devices

**New Features:**
- 🆕 **Floating Action Buttons**: Added mobile-friendly FAB for export and delete actions
- 🆕 **Touch Swipe Gestures**: Support left/right swipe to navigate table columns
- 🆕 **Scroll Indicators**: Visual indicators showing scrollable content
- 🆕 **Sticky Headers**: Table headers remain visible during horizontal scroll
- 🆕 **Auto-center**: Table automatically centers on important columns on mobile

**Improvements:**
- 📱 Enhanced mobile responsive design with better column prioritization
- 🎯 Larger, touch-friendly checkboxes for better mobile interaction
- ⚡ Smooth scrolling behavior with momentum on touch devices
- 🎨 Better visual hierarchy and spacing on small screens

### v1.0.0 (2025-12-18) - Initial Release
- 🎉 Complete inventory management system
- 📝 Full CRUD operations for items
- 🔍 Advanced search and filtering
- 📊 Export functionality (CSV, JSON, Print)
- 📱 Responsive design foundation

---

**Dibuat dengan ❤️ menggunakan Vanilla JavaScript ES6+ | Last Updated: 2025-12-18**