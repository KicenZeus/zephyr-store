// Simulasi Data Game
export const getGameData = (slug) => {
  const games = {
    "mobile-legends": {
      name: "Mobile Legends",
      developer: "Moonton",
      denominations: {
        Diamonds: [
          { id: 1, amount: "56 Diamonds", price: 12000 },
          { id: 2, amount: "86 Diamonds", price: 20000 },
          { id: 3, amount: "172 Diamonds", price: 40000 },
          { id: 4, amount: "257 Diamonds", price: 60000 },
          { id: 5, amount: "344 Diamonds", price: 80000 },
          { id: 6, amount: "429 Diamonds", price: 100000 },
          { id: 7, amount: "514 Diamonds", price: 120000 },
          { id: 8, amount: "688 Diamonds", price: 160000 },
          { id: 9, amount: "860 Diamonds", price: 200000 },
          { id: 10, amount: "1075 Diamonds", price: 250000 },
        ],
        Pass: [
          { id: 101, amount: "Weekly Diamond Pass", price: 28500 },
          { id: 102, amount: "Monthly Diamond Pass", price: 99000 },
          { id: 103, amount: "Twilight Pass", price: 145000 },
          { id: 104, amount: "Starlight Pass", price: 199000 },
        ],
      },
    },
    "free-fire": {
      name: "Free Fire",
      developer: "Garena",
      denominations: {
        Diamonds: [
          { id: 1, amount: "50 Diamonds", price: 8000 },
          { id: 2, amount: "100 Diamonds", price: 15000 },
          { id: 3, amount: "140 Diamonds", price: 20000 },
          { id: 4, amount: "210 Diamonds", price: 30000 },
          { id: 5, amount: "270 Diamonds", price: 35000 },
          { id: 6, amount: "355 Diamonds", price: 50000 },
          { id: 7, amount: "560 Diamonds", price: 80000 },
          { id: 8, amount: "720 Diamonds", price: 100000 },
          { id: 9, amount: "1080 Diamonds", price: 150000 },
          { id: 10, amount: "1450 Diamonds", price: 200000 },
        ],
      },
    },
    "genshin-impact": {
      name: "Genshin Impact",
      developer: "Hoyoverse",
      denominations: {
        Crystals: [
          { id: 1, amount: "60 Crystals", price: 15000 },
          { id: 2, amount: "300 Crystals", price: 75000 },
          { id: 3, amount: "980 Crystals", price: 225000 },
          { id: 4, amount: "1980 Crystals", price: 450000 },
          { id: 5, amount: "3280 Crystals", price: 750000 },
          { id: 6, amount: "6480 Crystals", price: 1450000 },
        ],
      },
    },
    "valorant": {
      name: "Valorant",
      developer: "Riot Games",
      denominations: {
        VP: [
          { id: 1, amount: "475 VP", price: 50000 },
          { id: 2, amount: "1000 VP", price: 100000 },
          { id: 3, amount: "2050 VP", price: 200000 },
          { id: 4, amount: "3650 VP", price: 350000 },
          { id: 5, amount: "5350 VP", price: 500000 },
          { id: 6, amount: "11000 VP", price: 1000000 },
        ],
      },
    },
    "pubg": {
      name: "PUBG Mobile",
      developer: "Tencent",
      denominations: {
        UC: [
          { id: 1, amount: "60 UC", price: 10000 },
          { id: 2, amount: "300 UC", price: 50000 },
          { id: 3, amount: "600 UC", price: 100000 },
          { id: 4, amount: "1500 UC", price: 250000 },
          { id: 5, amount: "3000 UC", price: 500000 },
          { id: 6, amount: "6000 UC", price: 1000000 },
        ],
      },
    },
    "clash-of-clans": {
      name: "Clash Of Clans",
      developer: "Supercell",
      denominations: {
        Gems: [
          { id: 1, amount: "50 Gems", price: 5000 },
          { id: 2, amount: "250 Gems", price: 25000 },
          { id: 3, amount: "500 Gems", price: 50000 },
          { id: 4, amount: "1000 Gems", price: 100000 },
          { id: 5, amount: "2000 Gems", price: 200000 },
          { id: 6, amount: "5000 Gems", price: 500000 },
          { id: 7, amount: "10000 Gems", price: 1000000 },
        ],
      },
    },
    "clash-royale": {
      name: "Clash Royale",
      developer: "Supercell",
      denominations: {
        Gems: [
          { id: 1, amount: "80 Gems", price: 15000 },
          { id: 2, amount: "150 Gems", price: 25000 },
          { id: 3, amount: "500 Gems", price: 80000 },
          { id: 4, amount: "1200 Gems", price: 180000 },
          { id: 5, amount: "2500 Gems", price: 375000 },
          { id: 6, amount: "5000 Gems", price: 750000 },
        ],
      },
    },
    "delta-force": {
      name: "Delta Force",
      developer: "TiMi Studio",
      denominations: {
        Coins: [
          { id: 1, amount: "100 Coins", price: 10000 },
          { id: 2, amount: "300 Coins", price: 30000 },
          { id: 3, amount: "500 Coins", price: 50000 },
          { id: 4, amount: "1000 Coins", price: 100000 },
          { id: 5, amount: "2500 Coins", price: 250000 },
          { id: 6, amount: "5000 Coins", price: 500000 },
        ],
      },
    },
    "league-of-legends": {
      name: "League Of Legends",
      developer: "Riot Games",
      denominations: {
        RP: [
          { id: 1, amount: "250 RP", price: 25000 },
          { id: 2, amount: "500 RP", price: 50000 },
          { id: 3, amount: "1000 RP", price: 100000 },
          { id: 4, amount: "2000 RP", price: 200000 },
          { id: 5, amount: "3500 RP", price: 350000 },
          { id: 6, amount: "5000 RP", price: 500000 },
        ],
      },
    },
    "honor-of-kings": {
      name: "Honor Of Kings",
      developer: "TiMi Studio",
      denominations: {
        Vouchers: [
          { id: 1, amount: "60 Vouchers", price: 10000 },
          { id: 2, amount: "150 Vouchers", price: 25000 },
          { id: 3, amount: "300 Vouchers", price: 50000 },
          { id: 4, amount: "500 Vouchers", price: 80000 },
          { id: 5, amount: "680 Vouchers", price: 100000 },
          { id: 6, amount: "1280 Vouchers", price: 190000 },
          { id: 7, amount: "1980 Vouchers", price: 290000 },
        ],
      },
    },
    "call-of-duty-mobile": {
      name: "Call of Duty Mobile",
      developer: "TiMi Studio",
      denominations: {
        CP: [
          { id: 1, amount: "80 CP", price: 12000 },
          { id: 2, amount: "200 CP", price: 30000 },
          { id: 3, amount: "400 CP", price: 55000 },
          { id: 4, amount: "800 CP", price: 100000 },
          { id: 5, amount: "1400 CP", price: 175000 },
          { id: 6, amount: "2000 CP", price: 250000 },
          { id: 7, amount: "2800 CP", price: 350000 },
        ],
      },
    },
    "arena-of-valor": {
      name: "Arena of Valor",
      developer: "TiMi Studio",
      denominations: {
        Vouchers: [
          { id: 1, amount: "60 Vouchers", price: 10000 },
          { id: 2, amount: "150 Vouchers", price: 22500 },
          { id: 3, amount: "300 Vouchers", price: 45000 },
          { id: 4, amount: "600 Vouchers", price: 85000 },
          { id: 5, amount: "1000 Vouchers", price: 140000 },
          { id: 6, amount: "1500 Vouchers", price: 210000 },
        ],
      },
    },
    "hogwarts-mystery": {
      name: "Hogwarts Mystery",
      developer: "Jam City",
      denominations: {
        Gems: [
          { id: 1, amount: "100 Gems", price: 15000 },
          { id: 2, amount: "250 Gems", price: 35000 },
          { id: 3, amount: "500 Gems", price: 65000 },
          { id: 4, amount: "1000 Gems", price: 120000 },
          { id: 5, amount: "2000 Gems", price: 230000 },
          { id: 6, amount: "5000 Gems", price: 550000 },
        ],
      },
    },
    "brawl-stars": {
      name: "Brawl Stars",
      developer: "Supercell",
      denominations: {
        Gems: [
          { id: 1, amount: "80 Gems", price: 12000 },
          { id: 2, amount: "170 Gems", price: 25000 },
          { id: 3, amount: "360 Gems", price: 50000 },
          { id: 4, amount: "750 Gems", price: 100000 },
          { id: 5, amount: "1400 Gems", price: 180000 },
          { id: 6, amount: "2800 Gems", price: 350000 },
        ],
      },
    },
    "black-desert-mobile": {
      name: "Black Desert Mobile",
      developer: "Pearl Abyss",
      denominations: {
        Pearls: [
          { id: 1, amount: "100 Pearls", price: 20000 },
          { id: 2, amount: "250 Pearls", price: 45000 },
          { id: 3, amount: "500 Pearls", price: 90000 },
          { id: 4, amount: "1000 Pearls", price: 170000 },
          { id: 5, amount: "2000 Pearls", price: 330000 },
          { id: 6, amount: "5000 Pearls", price: 800000 },
        ],
      },
    },
    "roblox": {
      name: "Roblox",
      developer: "Roblox Corporation",
      denominations: {
        Robux: [
          { id: 1, amount: "400 Robux", price: 50000 },
          { id: 2, amount: "800 Robux", price: 95000 },
          { id: 3, amount: "1700 Robux", price: 180000 },
          { id: 4, amount: "2800 Robux", price: 300000 },
          { id: 5, amount: "4500 Robux", price: 475000 },
          { id: 6, amount: "10000 Robux", price: 1000000 },
        ],
      },
    },
    "minecraft": {
      name: "Minecraft",
      developer: "Mojang",
      denominations: {
        Minecoins: [
          { id: 1, amount: "320 Minecoins", price: 40000 },
          { id: 2, amount: "720 Minecoins", price: 80000 },
          { id: 3, amount: "1720 Minecoins", price: 170000 },
          { id: 4, amount: "3500 Minecoins", price: 350000 },
          { id: 5, amount: "5000 Minecoins", price: 500000 },
        ],
      },
    },
    "fifa-mobile": {
      name: "FIFA Mobile",
      developer: "EA Sports",
      denominations: {
        "FIFA Points": [
          { id: 1, amount: "100 FIFA Points", price: 15000 },
          { id: 2, amount: "250 FIFA Points", price: 35000 },
          { id: 3, amount: "500 FIFA Points", price: 65000 },
          { id: 4, amount: "750 FIFA Points", price: 95000 },
          { id: 5, amount: "1050 FIFA Points", price: 120000 },
          { id: 6, amount: "1500 FIFA Points", price: 170000 },
          { id: 7, amount: "2200 FIFA Points", price: 250000 },
        ],
      },
    },
    "mobile-legends-adventure": {
      name: "Mobile Legends Adventure",
      developer: "Moonton",
      denominations: {
        Diamonds: [
          { id: 1, amount: "60 Diamonds", price: 12000 },
          { id: 2, amount: "150 Diamonds", price: 30000 },
          { id: 3, amount: "300 Diamonds", price: 55000 },
          { id: 4, amount: "500 Diamonds", price: 90000 },
          { id: 5, amount: "680 Diamonds", price: 110000 },
          { id: 6, amount: "1000 Diamonds", price: 160000 },
          { id: 7, amount: "2000 Diamonds", price: 320000 },
        ],
      },
    },
    "rise-of-kingdoms": {
      name: "Rise of Kingdoms",
      developer: "Lilith Games",
      denominations: {
        Gems: [
          { id: 1, amount: "100 Gems", price: 15000 },
          { id: 2, amount: "300 Gems", price: 45000 },
          { id: 3, amount: "500 Gems", price: 70000 },
          { id: 4, amount: "1000 Gems", price: 130000 },
          { id: 5, amount: "2000 Gems", price: 260000 },
          { id: 6, amount: "5000 Gems", price: 650000 },
        ],
      },
    },
  };

  return games[slug] ?? games["mobile-legends"];
};

// Data Metode Pembayaran
export const paymentMethods = [
  {
    category: "ewallet",
    label: "E-Wallet & QRIS",
    options: [
      { id: "qris", name: "QRIS", fee: 0, img: "/payments/qris.png" },
      { id: "dana", name: "DANA", fee: 500, img: "/payments/dana.png" },
      { id: "shopeepay", name: "ShopeePay", fee: 500, img: "/payments/shopeepay.png" },
    ],
  },
  {
    category: "va",
    label: "Virtual Account",
    options: [
      { id: "bca", name: "BCA VA", fee: 1000, img: "/payments/bca.png" },
      { id: "bri", name: "BRI VA", fee: 1000, img: "/payments/bri.png" },
    ],
  },
];

// Simulasi validasi ID via API
export const validateGameID = async (userId, zoneId) => {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  if (userId.startsWith("123")) {
    return { success: true, nickname: "VOID_PLAYER_01" };
  }
  return { success: false, msg: "ID User tidak ditemukan!" };
};