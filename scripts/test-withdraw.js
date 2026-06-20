const ethers = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=== Test Withdraw ===\n");

  // Connect to local Hardhat node
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8546");
  
  // Get signer (account #0)
  const signer = provider.getSigner();
  const signerAddress = await signer.getAddress();

  // Read contract data
  const contractDataPath = path.join(__dirname, "..", "app", "contracts", "TopUpPayment.json");
  const contractData = JSON.parse(fs.readFileSync(contractDataPath, "utf8"));

  // Create contract instance
  const contract = new ethers.Contract(contractData.address, contractData.abi, signer);

  console.log("1. Sending 1 ETH to contract...");
  const tx1 = await signer.sendTransaction({
    to: contractData.address,
    value: ethers.utils.parseEther("1.0")
  });
  await tx1.wait();
  console.log("   ✅ Transaction sent:", tx1.hash);

  // Check balance after send
  const balanceAfterSend = await provider.getBalance(contractData.address);
  console.log("\n2. Contract balance after sending 1 ETH:", ethers.utils.formatEther(balanceAfterSend));

  // Check account #0 balance
  const account0BalanceBefore = await provider.getBalance(signerAddress);
  console.log("   Account #0 balance before withdraw:", ethers.utils.formatEther(account0BalanceBefore));

  // Withdraw
  console.log("\n3. Withdrawing all ETH from contract...");
  const tx2 = await contract.withdraw();
  await tx2.wait();
  console.log("   ✅ Withdraw transaction sent:", tx2.hash);

  // Check balances after withdraw
  const balanceAfterWithdraw = await provider.getBalance(contractData.address);
  const account0BalanceAfter = await provider.getBalance(signerAddress);
  
  console.log("\n4. Balances after withdraw:");
  console.log("   Contract balance:", ethers.utils.formatEther(balanceAfterWithdraw));
  console.log("   Account #0 balance:", ethers.utils.formatEther(account0BalanceAfter));

  console.log("\n✅ Test completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
