# Panduan Login & Register

## Error: Invalid Login Credentials

Error ini berarti email atau password salah, atau akun belum terdaftar.

### Cara Mengatasi:

1. **Daftar Terlebih Dahulu!
   - Buka halaman `/register`
   - Isi nama, email, dan password (min 6 karakter)
   - Klik "Daftar"

2. **Nonaktifkan Email Confirmation (Untuk Development)**
   - Buka Supabase Dashboard
   - Pilih project kamu
   - Buka menu Authentication → Providers → Email
   - Matikan opsi "Confirm email"
   - Simpan perubahan

3. **Periksa Akun di Supabase
   - Buka Authentication → Users
   - Pastikan akun kamu ada di sana
   - Pastikan statusnya "Confirmed"

### Alur Pendaftaran:
1. User daftar di `/register`
2. Akun dibuat di Supabase Auth
3. Profile dibuat otomatis dengan wallet Hardhat
4. User bisa login di `/login`

### Catatan Penting:
- Password minimal 6 karakter
- Email harus valid
- Setiap akun mendapatkan wallet Hardhat otomatis
