
// Hardhat's default test accounts (index 0-9)
const HARDHAT_ACCOUNTS = [
  {
    index: 0,
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    privateKey: "0xac0974bec39a17e36ba4a6b4d238ff949bacb478cbed5efcae784d7bf4f2ff80"
  },
  {
    index: 1,
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
  },
  {
    index: 2,
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
  },
  {
    index: 3,
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    privateKey: "0x7c852118294e51e653712a81e05800f41914175be03e629b4e65a96a63a22603"
  },
  {
    index: 4,
    address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    privateKey: "0x47e179ec197488593f1390ca55e19b5e9f0b5d452d52e19e3e2f2e6c66e31480"
  },
  {
    index: 5,
    address: "0x9965507D1c31cbe42c2e6a120D438c0e47ffbA1c",
    privateKey: "0x8b3a35a0b15a99467910b9b62e0a0a3f532179ec28e189e5534662276647c03"
  },
  {
    index: 6,
    address: "0x3a6d44607fA3C008870a420E864650117f0f9625",
    privateKey: "0x689af8efa8c651a91ad2770cff13919a468df3ef2a6b949a1c47c3276e8e5a0d"
  },
  {
    index: 7,
    address: "0x2546BcD3c84621e97698219805a8Cc5127267909",
    privateKey: "0x4bbbf85ce3377467afe5d46f804f2218d3bb6671a552435a6f7c787f72267944"
  },
  {
    index: 8,
    address: "0xa0Ee7A142d267C1f36714E4a8F75612F20a7bD92",
    privateKey: "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e"
  },
  {
    index: 9,
    address: "0x1CBd3b2770909D4e10f157cABC84C7264073C9c",
    privateKey: "0x92db14e403b83dfe1d7bc2e671d95c0e653e4b4735a883f32e96099b08174829"
  }
];

/**
 * Get a Hardhat wallet from the default accounts list
 * @param {number} index - The wallet index (0-9 for default Hardhat accounts)
 * @returns {Object} Wallet object with address and privateKey
 */
export function getHardhatWallet(index) {
  return HARDHAT_ACCOUNTS[index % 10];
}

/**
 * Get the next available wallet index (simplified for demo)
 * @param {number} userCount - Number of existing users
 * @returns {number} Next wallet index
 */
export function getNextWalletIndex(userCount) {
  return userCount % 10; // Cycle through first 10 Hardhat accounts
}
