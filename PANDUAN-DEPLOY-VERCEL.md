# Panduan Deploy ke Vercel

Berikut adalah langkah-langkah deploy project Zephyr Store ke Vercel:

---

## 📋 Prasyarat
1. Akun Vercel (https://vercel.com)
2. Akun Supabase (https://supabase.com)
3. Project sudah diupload ke GitHub/GitLab/Bitbucket
4. File `.npmrc` sudah ada di root project (sudah dibuat untuk mengatasi dependency conflict)

---

## 🚀 Langkah 1: Siapkan Environment Variables di Vercel

1. Buka Vercel Dashboard → New Project
2. Pilih repository kamu
3. Di bagian "Environment Variables", tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`: Isi dengan URL project Supabase kamu (contoh: `https://abcdefghijklmnopqrst.supabase.co`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Isi dengan Anon Key Supabase kamu (dapatkan di Supabase Dashboard → Project Settings → API)
4. Klik "Deploy"

---

## 🔗 Langkah 2: Konfigurasi Supabase untuk Deployment

Untuk mengizinkan akses dari domain Vercel, kita perlu update Setting di Supabase:

1. Buka Supabase Dashboard → Project kamu
2. Buka menu **Authentication** → **Providers** → **Email**
3. Di bagian "Site URL" dan "Redirect URLs", tambahkan:
   - Site URL: `https://your-vercel-domain.vercel.app`
   - Redirect URLs: `https://your-vercel-domain.vercel.app/**`
4. (Opsional) Buka **Authentication** → **URL Configuration**
5. Tambahkan domain Vercel kamu ke "Additional Redirect URLs"

---

## 📝 Langkah 3: (Opsional) Buat File `vercel.json`

Kamu bisa buat file `vercel.json` di root project untuk konfigurasi tambahan (contoh):

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

---

## 🧪 Langkah 4: Testing Deployment

Setelah deploy selesai:
1. Buka URL Vercel kamu (contoh: `https://zephyr-store.vercel.app`)
2. Test register dan login
3. Test fitur web3 (pastikan kamu masih menjalankan Hardhat Node lokal jika ingin testing di network lokal)

---

## ⚠️ Catatan Penting untuk Web3

- **Hardhat Node**: Untuk production, kamu perlu gunakan testnet seperti Sepolia atau mainnet, bukan Hardhat lokal
- **Smart Contract**: Deploy smart contract ke testnet/mainnet, update `app/contracts/TopUpPayment.json` dengan address contract baru
- **Network Configuration**: Update `components/web3/ConnectWallet.jsx` dengan network configuration untuk testnet/mainnet

---

## 🛠️ Troubleshooting

1. **Dependency Conflict Error**: Sudah diatasi dengan file `.npmrc` yang berisi `legacy-peer-deps=true`
2. **Environment Variables tidak terbaca**: Pastikan kamu menambahkan variabel di Vercel Dashboard, tidak di file `.env.local`
3. **Supabase Auth Error**: Pastikan Site URL dan Redirect URLs di Supabase sudah diupdate dengan domain Vercel kamu
4. **Build Error**: Pastikan semua dependencies sudah diinstall dan tidak ada error di `npm run build`

Selamat mencoba! 🎉
