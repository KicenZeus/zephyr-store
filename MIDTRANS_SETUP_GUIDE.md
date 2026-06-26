# Panduan Setup Midtrans Sandbox

## 1. Siapkan Credential Midtrans
1. Buka dan login ke https://dashboard.midtrans.com
2. Pastikan pilih **Environment Sandbox** (di pojok kanan atas)
3. Buka menu **Settings → Access Keys**
4. Salin `Server Key` dan `Client Key`

## 2. Isi Environment Variables
Pastikan file `.env.local` kamu sudah diisi dengan benar:
```env
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-KAMU_DISINI
MIDTRANS_SERVER_KEY=SB-Mid-server-KAMU_DISINI
```

## 3. Test Transaksi
1. Jalankan development server: `npm run dev`
2. Pilih game → Pilih nominal → Pilih "💳 Traditional" → Pilih metode pembayaran
3. Klik Bayar!
4. Kamu akan melihat popup Midtrans Snap Sandbox
5. Gunakan detail pembayaran testing:
   - **Transfer Bank BCA**: No. VA bisa apa saja
   - **Gopay**: Gunakan sandbox Gopay
   - **Kartu Kredit**: Gunakan `4811-1111-1111-1114` (3DS), `112` CVV, exp date apa saja di masa depan

## 4. Setup Webhook (Opsional tapi Direkomendasikan)
Untuk auto update status transaksi:
1. Install ngrok: https://ngrok.com/download
2. Jalankan ngrok: `ngrok http 3000`
3. Copy URL ngrok (contoh: `https://abc123.ngrok-free.app`)
4. Di Midtrans Dashboard (Sandbox), buka **Settings → Webhooks**
5. Isi **Production Webhook URL** dengan: `https://url-ngrok-kamu.ngrok-free.app/api/midtrans/webhook`
6. Klik Save

## 5. Done! 🎉
Kamu sudah bisa test transaksi dengan Midtrans Sandbox!
