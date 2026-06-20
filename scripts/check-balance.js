const ethers = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=== Check Contract Balance ===\n");

  // Connect to local Hardhat node
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8546");
  
  // Read contract data
  const contractDataPath = path.join(__dirname, "..", "app", "contracts", "TopUpPayment.json");
  const contractData = JSON.parse(fs.readFileSync(contractDataPath, "utf8"));

  console.log("Contract Address:", contractData.address);

  // Get contract balance
  const balance = await provider.getBalance(contractData.address);
  console.log("Contract Balance (wei):", balance.toString());
  console.log("Contract Balance (ETH):", ethers.utils.formatEther(balance));

  // Get account #0 balance
  const accounts = await provider.listAccounts();
  const account0 = accounts[0];
  const account0Balance = await provider.getBalance(account0);
  console.log("\nAccount #0 Address:", account0);
  console.log("Account #0 Balance (ETH):", ethers.utils.formatEther(account0Balance));

  // Create contract instance
  const contract = new ethers.Contract(contractData.address, contractData.abi, provider);
  
  // Get contract owner
  const owner = await contract.owner();
  console.log("\nContract Owner:", owner);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
