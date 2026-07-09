# Papan Tulis Digital Realtime - Kelompok 5

Aplikasi papan tulis kolaboratif (*whiteboard*) yang memungkinkan beberapa *user* menggambar secara bersamaan dan *realtime*. Aplikasi ini menggunakan kalkulasi koordinat responsif, sehingga posisi coretan tetap presisi meskipun ukuran layar perangkat berbeda (misalnya antara HP dan layar *browser* laptop).

Proyek ini terbagi menjadi dua bagian utama yang harus dijalankan secara paralel:
1. **Frontend:** `hello-mobile` (React Native / Expo)
2. **Backend:** `whiteboard-server` (Node.js & Socket.io)

---

## ⚙️ Persyaratan Sistem (Prerequisites)
Pastikan perangkat pengembangan (Laptop/PC) sudah terpasang:
* **Node.js** (Versi LTS terbaru).
* Aplikasi **Expo Go** terinstal di perangkat Android/iOS masing-masing anggota (unduh via Play Store / App Store).

---

## 🚀 Langkah-Langkah Eksekusi

### Langkah 1: Konfigurasi Jaringan & IP Address (Wajib)
Aplikasi ini berjalan secara lokal (LAN). Semua perangkat yang ingin saling terhubung (Laptop dan HP) **wajib** berada di satu jaringan WiFi atau Hotspot yang sama.
1. Pastikan Laptop dan HP terhubung ke jaringan yang sama.
2. Buka Terminal/Command Prompt di laptop, ketik `ipconfig` (Windows) atau `ifconfig` (Mac).
3. Cari bagian **IPv4 Address** pada *adapter* WiFi yang aktif (contoh: `192.168.1.6`). 
4. **Catat angka IP ini.**

### Langkah 2: Menjalankan Server Backend
Server bertugas menerima koordinat sentuhan dari satu perangkat dan menyebarkannya ke perangkat lain secara instan.
1. Buka Terminal baru, arahkan ke folder backend:
   ```bash
   cd whiteboard-server

```

2. Instal semua dependensi (hanya perlu dilakukan sekali):
```bash
npm install

```

3. Nyalakan server:
```bash
node index.js

```

*Biarkan terminal ini tetap menyala di latar belakang. Server akan berjalan di port 3000.*

### Langkah 3: Menjalankan Frontend (Aplikasi Mobile)

1. Buka file konfigurasi *socket* di *code editor*: `hello-mobile/src/utils/socket.js`.
2. Ubah variabel `BACKEND_URL` dengan IPv4 Address laptop dari Langkah 1.
*Contoh penulisan yang benar:* `const BACKEND_URL = "http://192.168.1.10:3000";`
*(Gunakan `http://`, JANGAN gunakan `https://`)*.
3. Simpan file tersebut.
4. Buka Terminal baru, arahkan ke folder frontend:
```bash
cd hello-mobile

```

5. Instal dependensi frontend (hanya perlu dilakukan sekali):
```bash
npm install

```

6. Jalankan *bundler* Expo dengan memori bersih (*clear cache*):
```bash
npx expo start atau npx expo start --tunnel

```


### Langkah 4: Pengujian & Penggunaan

1. Di terminal Expo, sebuah **QR Code** akan muncul.
2. Buka aplikasi **Expo Go** di HP kalian, ketuk opsi *Scan QR Code*, dan arahkan kamera ke layar laptop.
3. *(Opsional untuk pengujian ganda)* Tekan tombol `w` di terminal Expo untuk membuka versi Web secara langsung di *browser* laptop.
4. **Mulai Mencoret:** Tarik garis di kanvas. Coretan akan otomatis muncul di perangkat lain secara *realtime*.
5. Tekan tombol **Bersihkan Canvas Bersama** untuk mereset seluruh kanvas di semua perangkat serentak.

---

## ⚠️ Troubleshooting (Pemecahan Masalah)

* **Status Indikator Merah (Terputus):** Jika indikator di atas kanvas berwarna merah, 99% masalahnya ada di konfigurasi jaringan:
1. IP Address laptop berubah (sering terjadi jika WiFi *disconnect* lalu *reconnect*). Cek ulang `ipconfig` dan sesuaikan IP di file `socket.js`.
2. Windows Firewall memblokir koneksi dari HP. Matikan perlindungan untuk *Private* dan *Public Network* di pengaturan Windows Defender Firewall.
3. Server Node.js di terminal belum dijalankan atau tertutup secara tidak sengaja.


* **Peringatan "Not Secure" di Browser Laptop:**
Saat membuka aplikasi via Web, *browser* (Chrome/Edge) mungkin menampilkan label merah "Not Secure" di *address bar*. Ini normal pada tahap pengembangan karena Expo menggunakan jalur aman sementara (HTTPS), sedangkan koneksi *socket* ke laptop menggunakan jalur standar (HTTP). Abaikan peringatan ini; fungsionalitas aplikasi tidak akan terpengaruh.

```

```