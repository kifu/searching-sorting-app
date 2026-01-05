# Searching - Sorting:  Mobile Algorithm Visualization Lab

Proyek ini adalah aplikasi mobile berbasis **React Native** yang memvisualisasikan cara kerja berbagai algoritma pencarian (*searching*) dan pengurutan (*sorting*) secara interaktif.  Aplikasi ini dirancang untuk membantu mahasiswa memahami logika algoritma melalui animasi visual yang dinamis dan *real-time* langsung dari perangkat seluler.

## 👥 Anggota Kelompok

Proyek ini dikembangkan oleh: 
1. **Andi Syaichul Mubaraq** - 18223139
2. **Leon Arif Sutiono** - 18223120

---

## ✨ Fitur Utama

* **Autentikasi Pengguna**:  Sistem Login dan Register aman menggunakan **Firebase Authentication**. 
* **Profil Pengguna**: Menyimpan data pengguna dan tanggal pembuatan akun menggunakan **Cloud Firestore**. 
* **Visualisasi Interaktif**: Animasi *bar chart* yang bergerak sesuai langkah algoritma. 
* **Kontrol Penuh**:
    * **Kecepatan Dinamis**: Atur kecepatan animasi (50ms - 1000ms) bahkan saat algoritma sedang berjalan.
    * **Ukuran Data**: Slider untuk mengatur jumlah elemen array (5 - 50 data).
    * **Algoritma**:  Pilihan lengkap untuk Sorting dan Searching. 
* **User Interface Modern**:
    * Desain responsif dan bersih. 
    * **Dark Mode Support**: Tampilan tetap konsisten dan terbaca jelas baik dalam mode terang maupun gelap.
    * Indikator warna untuk proses (Merah:  Komparasi, Hijau: Terurut, Kuning: Swap).
* **Deskripsi Algoritma**: Penjelasan teori singkat yang muncul otomatis sesuai algoritma yang dipilih.

---

## 🚀 Algoritma yang Diimplementasikan

### 📊 Sorting (Pengurutan)

1. **Bubble Sort**: Membandingkan elemen bersebelahan secara berulang dan menukarnya jika urutan salah. 
2. **Selection Sort**: Mencari nilai minimum dari bagian yang belum terurut dan menukarnya ke posisi depan. 
3. **Insertion Sort**: Membangun array terurut satu per satu dengan menyisipkan elemen ke posisi yang tepat.

### 🔍 Searching (Pencarian)

1. **Linear Search**: Memeriksa setiap elemen satu per satu dari awal hingga akhir.
2. **Binary Search**: Algoritma pencarian efisien (Divide and Conquer) pada data yang sudah terurut.

---

## 🛠 Teknologi yang Digunakan

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | [React Native](https://reactnative.dev/) (dengan Expo SDK) |
| **Bahasa** | TypeScript |
| **Backend & Database** | Firebase (Auth & Firestore) |
| **Build Tool** | EAS (Expo Application Services) untuk generate APK |
| **Komponen UI** | React Native Community Slider, Picker |

---

## ⚙️ Cara Menjalankan (Local Development)

Ikuti langkah ini untuk menjalankan proyek di komputer Anda: 

### 1. Prasyarat

Pastikan Anda sudah menginstal:
* [Node.js](https://nodejs.org/)
* Git

### 2. Kloning Repositori

```bash
git clone https://github.com/kifu/searching-sorting-app.git
cd searching-sorting-app
```

### 3. Instal Dependensi

```bash
npm install
```

### 4. Jalankan Aplikasi

```bash
npx expo start
```

* Scan QR Code yang muncul menggunakan aplikasi **Expo Go** (Android/iOS).
* Atau tekan `a` untuk membuka di Android Emulator. 

---

## 📱 Cara Build APK (Android)

Untuk mengubah kode menjadi file `.apk` yang siap instal:

1. Pastikan Anda sudah login ke akun Expo CLI:

    ```bash
    eas login
    ```

2. Jalankan perintah build:

    ```bash
    eas build -p android --profile preview
    ```

3. Tunggu proses selesai dan unduh link yang diberikan. 

---
