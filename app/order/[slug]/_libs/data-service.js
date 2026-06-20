// Simulasi Data Game
export const getGameData = (slug) => {
  const games = {
    "mobile-legends": {
      name: "Mobile Legends",
      developer: "Moonton",
      denominations: {
        Diamonds: [
          { id: 1, amount: "86 Diamonds", price: 20000 },
          { id: 2, amount: "172 Diamonds", price: 40000 },
          { id: 3, amount: "257 Diamonds", price: 60000 },
        ],
        Pass: [
          { id: 101, amount: "Weekly Diamond Pass", price: 28500 },
          { id: 102, amount: "Twilight Pass", price: 145000 },
        ],
      },
    },
    "free-fire": {
      name: "Free Fire",
      developer: "Garena",
      denominations: {
        Diamonds: [
          { id: 1, amount: "50 Diamonds", price: 8000 },
          { id: 2, amount: "140 Diamonds", price: 20000 },
          { id: 3, amount: "270 Diamonds", price: 35000 },
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
        ],
      },
    },
    "clash-of-clans": {
      name: "Clash Of Clans",
      developer: "Supercell",
      denominations: {
        Gems: [
          { id: 1, amount: "500 Gems", price: 25000 },
          { id: 2, amount: "1000 Gems", price: 50000 },
          { id: 3, amount: "2000 Gems", price: 100000 },
        ],
      },
    },
    "clash-royale": {
      name: "Clash Royale",
      developer: "Supercell",
      denominations: {
        Gems: [
          { id: 1, amount: "80 Gems", price: 15000 },
          { id: 2, amount: "500 Gems", price: 80000 },
          { id: 3, amount: "1200 Gems", price: 180000 },
        ],
      },
    },
    "delta-force": {
      name: "Delta Force",
      developer: "TiMi Studio",
      denominations: {
        Coins: [
          { id: 1, amount: "100 Coins", price: 10000 },
          { id: 2, amount: "500 Coins", price: 50000 },
          { id: 3, amount: "1000 Coins", price: 100000 },
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
        ],
      },
    },
    "honor-of-kings": {
      name: "Honor Of Kings",
      developer: "TiMi Studio",
      denominations: {
        Vouchers: [
          { id: 1, amount: "60 Vouchers", price: 10000 },
          { id: 2, amount: "300 Vouchers", price: 50000 },
          { id: 3, amount: "680 Vouchers", price: 100000 },
        ],
      },
    },
    "call-of-duty-mobile": {
      name: "Call of Duty Mobile",
      developer: "TiMi Studio",
      denominations: {
        CP: [
          { id: 1, amount: "80 CP", price: 12000 },
          { id: 2, amount: "400 CP", price: 55000 },
          { id: 3, amount: "800 CP", price: 100000 },
        ],
      },
    },
    "arena-of-valor": {
      name: "Arena of Valor",
      developer: "TiMi Studio",
      denominations: {
        Vouchers: [
          { id: 1, amount: "60 Vouchers", price: 10000 },
          { id: 2, amount: "300 Vouchers", price: 45000 },
          { id: 3, amount: "600 Vouchers", price: 85000 },
        ],
      },
    },
    "hogwarts-mystery": {
      name: "Hogwarts Mystery",
      developer: "Jam City",
      denominations: {
        Gems: [
          { id: 1, amount: "100 Gems", price: 15000 },
          { id: 2, amount: "500 Gems", price: 65000 },
          { id: 3, amount: "1000 Gems", price: 120000 },
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
        ],
      },
    },
    "black-desert-mobile": {
      name: "Black Desert Mobile",
      developer: "Pearl Abyss",
      denominations: {
        Pearls: [
          { id: 1, amount: "100 Pearls", price: 20000 },
          { id: 2, amount: "500 Pearls", price: 90000 },
          { id: 3, amount: "1000 Pearls", price: 170000 },
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
        ],
      },
    },
    "fifa-mobile": {
      name: "FIFA Mobile",
      developer: "EA Sports",
      denominations: {
        "FIFA Points": [
          { id: 1, amount: "100 FIFA Points", price: 15000 },
          { id: 2, amount: "500 FIFA Points", price: 65000 },
          { id: 3, amount: "1050 FIFA Points", price: 120000 },
        ],
      },
    },
    "mobile-legends-adventure": {
      name: "Mobile Legends Adventure",
      developer: "Moonton",
      denominations: {
        Diamonds: [
          { id: 1, amount: "60 Diamonds", price: 12000 },
          { id: 2, amount: "300 Diamonds", price: 55000 },
          { id: 3, amount: "680 Diamonds", price: 110000 },
        ],
      },
    },
    "rise-of-kingdoms": {
      name: "Rise of Kingdoms",
      developer: "Lilith Games",
      denominations: {
        Gems: [
          { id: 1, amount: "100 Gems", price: 15000 },
          { id: 2, amount: "500 Gems", price: 70000 },
          { id: 3, amount: "1000 Gems", price: 130000 },
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