import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Starting deployment...");

  // Deploy contract
  const TopUpPayment = await hre.ethers.getContractFactory("TopUpPayment");
  const topUpPayment = await TopUpPayment.deploy();
  await topUpPayment.waitForDeployment();

  const contractAddress = await topUpPayment.getAddress();

  console.log("==============================================");
  console.log("✅ TopUpPayment deployed to:", contractAddress);
  console.log("==============================================");

  // Get ABI
  const artifact = await hre.artifacts.readArtifact("TopUpPayment");

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
