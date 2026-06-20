# 📖 Panduan Reset & Penggunaan Wallet

---

## 1. Cara Reset MetaMask

### Reset Akun MetaMask:
1. Buka MetaMask
2. Klik ikon profile (pojok kanan atas)
3. Pilih **Settings**
4. Scroll ke bawah, pilih **Advanced**
5. Klik **Reset Account**
6. Konfirmasi dengan klik **Reset**

### Atau, Buat Wallet Baru di MetaMask:
1. Klik ikon profile
2. Pilih **Create Account**
3. Beri nama (misal: "Hardhat Admin")
4. Klik **Create**

---

## 2. Cara Reset Hardhat Node

### Hentikan Hardhat Node (jika berjalan):
- Tekan `Ctrl + C` di terminal tempat Hardhat berjalan

### Jalankan Hardhat Node Kembali (Fresh):
```bash
npx hardhat node
```

Setelah berjalan, kamu akan melihat **20 akun Hardhat** beserta private keynya!

---

## 3. Cara Import Semua Wallet Hardhat ke MetaMask (Tanpa Satu-satu!)

### Kita gunakan daftar wallet Hardhat default:
Ini adalah daftar **10 wallet Hardhat pertama** (sudah ada di kode kamu):

| Index | Alamat Wallet | Private Key | Status |
|-------|----------------|-------------|--------|
| 0 | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0xac0974bec39a17e36ba4a6b4d238ff949bacb478cbed5efcae784d7bf4f2ff80` | **ADMIN** |
| 1 | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d` | User |
| 2 | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a` | User |
| 3 | `0x90F79bf6EB2c4f870365E785982E1f101E93b906` | `0x7c852118294e51e653712a81e05800f41914175be03e629b4e65a96a63a22603` | User |
| 4 | `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65` | `0x47e179ec197488593f1390ca55e19b5e9f0b5d452d52e19e3e2f2e6c66e31480` | User |
| 5 | `0x9965507D1c31cbe42c2e6a120D438c0e47ffbA1c` | `0x8b3a35a0b15a99467910b9b62e0a0a3f532179ec28e189e5534662276647c03` | User |
| 6 | `0x3a6d44607fA3C008870a420E864650117f0f9625` | `0x689af8efa8c651a91ad2770cff13919a468df3ef2a6b949a1c47c3276e8e5a0d` | User |
| 7 | `0x2546BcD3c84621e97698219805a8Cc5127267909` | `0x4bbbf85ce3377467afe5d46f804f2218d3bb6671a552435a6f7c787f72267944` | User |
| 8 | `0xa0Ee7A142d267C1f36714E4a8F75612F20a7bD92` | `0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e` | User |
| 9 | `0x1CBd3b2770909D4e10f157cABC84C7264073C9c` | `0x92db14e403b83dfe1d7bc2e671d95c0e653e4b4735a883f32e96099b08174829` | User |

### Cara Import ke MetaMask:
1. Buka MetaMask
2. Klik ikon profile → **Import Account**
3. Pilih opsi **Private Key**
4. Copy-paste private key dari daftar di atas
5. Klik **Import**
6. Ulangi untuk wallet yang lain (opsional)

---

## 4. Cara Reset Database Supabase

### Opsi 1: Hapus Data dari Tabel (Soft Reset)
1. Buka **Supabase Dashboard**
2. Pilih project kamu
3. Klik menu **Table Editor**
4. Pilih tabel `profiles`
5. Klik **Truncate** (hapus semua baris)
6. Lakukan hal yang sama untuk tabel `transactions`

### Opsi 2: Reset Total (Hapus dan Buat Ulang Tabel)
1. Buka **Supabase Dashboard**
2. Klik menu **SQL Editor**
3. Hapus tabel lama (jika ingin):
   ```sql
   DROP TABLE IF EXISTS public.transactions;
   DROP TABLE IF EXISTS public.profiles;
   ```
4. Jalankan script `supabase-setup.sql` (file kamu) untuk buat tabel baru
5. Jalankan script `add-wallet-columns.sql` (jika belum)

---

## 5. Wallet #0 sebagai ADMIN

Dalam kode kamu, wallet index **0** sudah otomatis ditandai sebagai **ADMIN** di halaman profil!

- Semua transaksi seharusnya dikirim ke wallet ADMIN (index 0)
- Kamu bisa melihat wallet ADMIN di halaman profil ketika login dengan akun yang mendapatkan wallet index 0

---

## 6. Lihat Wallet Detail di Halaman Profil

Setiap user yang login bisa melihat:
- 📦 Alamat wallet mereka
- 🔑 Private key (untuk testing)
- 🏷️ Status (ADMIN atau USER)
- 💰 Estimasi saldo (1000 ETH default Hardhat)
- Tombol copy untuk mempermudah import ke MetaMask!
