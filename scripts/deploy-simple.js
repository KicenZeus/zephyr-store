const ethers = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment...");

  // Connect to local Hardhat node
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8546");
  
  // Get default signer (account 0)
  const signer = provider.getSigner();
  const signerAddress = await signer.getAddress();
  console.log("Using signer:", signerAddress);

  // Read contract artifact
  const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "TopUpPayment.sol", "TopUpPayment.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  // Deploy contract
  const TopUpPayment = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
  const topUpPayment = await TopUpPayment.deploy();
  await topUpPayment.deployed();

  const contractAddress = topUpPayment.address;

  console.log("==============================================");
  console.log("✅ TopUpPayment deployed to:", contractAddress);
  console.log("==============================================");

  // Save to frontend
  const contractsDir = path.join(__dirname, "..", "app", "contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, "TopUpPayment.json"),
    JSON.stringify({
      address: contractAddress,
      abi: artifact.abi,
    }, null, 2)
  );

  console.log("📄 Contract data saved to app/contracts/TopUpPayment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
