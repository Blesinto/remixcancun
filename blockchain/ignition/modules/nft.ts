import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TokenModule = buildModule("Deployment", (m) => {

  // Deploy the TariToken contract
  const remixCancunNFT = m.contract("RemixCancunNFT", [10], {
    // Optional: Additional deployment parameters
  });

  // Return the deployed contract for potential further use
  return { remixCancunNFT };
});

export default TokenModule;
