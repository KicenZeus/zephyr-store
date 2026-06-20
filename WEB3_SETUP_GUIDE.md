# Web3 dApp Setup Guide (FINAL)

Follow these steps EXACTLY to run your Web3 top-up game store!

---

## STEP 1: INSTALL ALL DEPENDENCIES

Run these commands in your terminal (in project root):
```bash
npm install
```

---

## STEP 2: SETUP SUPABASE

1. Open your Supabase project dashboard
2. Go to **SQL Editor** → **New Query**
3. Copy ALL code from `supabase-setup.sql → Paste → Run
4. Go to **Authentication** → **Providers** → **Email** → Toggle OFF "Confirm email"
5. Go to **Project Settings** → **API**:
   - Copy **Project URL**
   - Copy **anon public key**
6. Create/Update your `.env.local` file in project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

---

## STEP 3: START HARDHAT NODE

Open **NEW TERMINAL 1** → Run:
```bash
npx hardhat node
```
- Keep this terminal running!
- You'll see 10 test accounts with private keys!
- Copy 1 private key for later!

---

## STEP 4: DEPLOY SMART CONTRACT

Open **NEW TERMINAL 2** → Run:
```bash
npx hardhat run scripts/deploy.js --network localhost
```
- This deploys contract → Saves to `app/contracts/TopUpPayment.json`!

---

## STEP 5: ADD HARDHAT NETWORK TO METAMASK

1. Open MetaMask → Settings → Networks → Add Network
2. Fill in:
   - **Network Name**: Hardhat Localhost
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH
3. Save!
4. Import test account:
   - MetaMask → My Accounts → Import Account
   - Paste private key from Terminal 1!

---

## STEP 6: START NEXT.JS DEV SERVER

Open **NEW TERMINAL 3** → Run:
```bash
npm run dev
```

---

## STEP 7: ENJOY YOUR DAPP!

Open http://localhost:3000 → Happy testing! 🎮✨

---

## TROUBLESHOOTING

### "Failed to fetch"?
- Make sure .env.local is in project root!
- Restart dev server!
- Check Supabase credentials!

### Can't connect MetaMask?
- Make sure Hardhat node is running!
- Make sure you added Hardhat network to MetaMask!
- Make sure you're on Hardhat network in MetaMask!

### Can't pay with ETH?
- Make sure contract is deployed!
- Make sure you imported test ETH!
