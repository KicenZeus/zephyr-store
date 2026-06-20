
// Hardhat's default test accounts (index 0-19) - extended to 20 accounts
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
  },
  {
    index: 10,
    address: "0x976EA74026E75A76E1fa0b4Dd7a1407BeD21e17C",
    privateKey: "0x4d5db4107d237df6a3d58ee5f70ae63d73d7658d4ca49f90ff1e513b599795f4"
  },
  {
    index: 11,
    address: "0x1A45a5b60d2d927B2A4a2B3901D3D036612eE15E",
    privateKey: "0x7f2902b97e01fde3c9178f0948d6a9b7c9162e0b028402b3563a3a15a322d063"
  },
  {
    index: 12,
    address: "0x7a0287493B9e043800f752B8229F449a859B01e6",
    privateKey: "0xb8c17a1a39145a561a19a7696e9a50a678f9b317a44f0c51f318c046a278b867"
  },
  {
    index: 13,
    address: "0x06c56B0f7b71178e9497E1f0a126992a985a62D5",
    privateKey: "0x105edde53376373962b2755347270a0300122907b78e293a255c9ed789d60b98"
  },
  {
    index: 14,
    address: "0x8C1b8C838E79A570b33330a6F905B4254c7d9a1a",
    privateKey: "0x97276450f07b80020362098710a408776076e4963001422685b7012095222841"
  },
  {
    index: 15,
    address: "0x1e5B169c245d129d8B3e8087498C6a26567f6c7f",
    privateKey: "0x7b4e154ef1ef15a3b40a00668230d937a9a2926599b303b615b20b31b03f497e"
  },
  {
    index: 16,
    address: "0x72eFd28B80682c8392d03715d2c8e9c2c1425016",
    privateKey: "0x0239b446f93a6c237a419016470a1f61218987e135a2e0e7c41a9022a0e08898"
  },
  {
    index: 17,
    address: "0x57572F59a112272d7d6d2837C044eBd17F04920f",
    privateKey: "0x0c509487b124c879290405401520106770947817097971292b0070318a3b8e03"
  },
  {
    index: 18,
    address: "0xBdaF5c17724C950b212f8C00f721777c3E0200a4",
    privateKey: "0xad490739872369c1980480b332b0d7b5b100e4527f2459707b6a20830786570c"
  },
  {
    index: 19,
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92267",
    privateKey: "0x2a871d0798f97d79848a013d4947c5a37fa782d526244695f1a3113025e8294c"
  }
];

/**
 * Get a Hardhat wallet from the default accounts list
 * @param {number} index - The wallet index (0-19 for default Hardhat accounts)
 * @returns {Object} Wallet object with address and privateKey
 */
export function getHardhatWallet(index) {
  return HARDHAT_ACCOUNTS[index % 20];
}

/**
 * Get the next available wallet index (unused)
 * @param {Array<number>} usedIndexes - Array of already used wallet indexes
 * @returns {number} Next available wallet index
 */
export function getNextWalletIndex(usedIndexes) {
  // Find the smallest index >=1 that's not used
  for (let i = 1; i <= 19; i++) {
    if (!usedIndexes.includes(i)) {
      return i;
    }
  }
  // If all 1-19 are used, start over from 1
  return 1;
}
