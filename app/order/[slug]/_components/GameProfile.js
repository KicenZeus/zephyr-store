export const getGameData = (slug) => {
  const games = {
    "mobile-legends": {
      name: "Mobile Legends",
      developer: "Moonton",
      denominations: {
        "Diamonds": [
          { id: 1, amount: "86 Diamonds", price: 20000 },
          { id: 2, amount: "172 Diamonds", price: 40000 },
        ],
        "Pass": [
          { id: 101, amount: "Weekly Diamond Pass", price: 28500 },
        ]
      }
    },
    // Tambahin game lain di sini...
  };
  return games[slug] || games["mobile-legends"];
};

export const paymentMethods = [
  { 
    category: "ewallet", 
    label: "E-Wallet & QRIS", 
    options: [
      { id: 'qris', name: 'QRIS', fee: 0, img: '/payments/qris.png' },
      { id: 'dana', name: 'DANA', fee: 500, img: '/payments/dana.png' }
    ]
  },
  { 
    category: "va", 
    label: "Virtual Account", 
    options: [
      { id: 'bca', name: 'BCA VA', fee: 1000 },
    ]
  }
];