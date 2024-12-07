import { expect } from "chai";
import { ethers } from "hardhat";
import { TariToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("TariToken", function () {
  let tariToken: TariToken;
  let owner: SignerWithAddress;
  let recipient: SignerWithAddress;

  beforeEach(async function () {
    // Get signers
    [owner, recipient] = await ethers.getSigners();

    // Deploy contract
    const MyTokenFactory = await ethers.getContractFactory("TariToken");
    tariToken = await MyTokenFactory.deploy(owner.address);
    await tariToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await tariToken.name()).to.equal("TariToken");
      expect(await tariToken.symbol()).to.equal("TTK");
    });

    it("Should set the correct owner", async function () {
      expect(await tariToken.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    const tokenURI = "https://example.com/token/1";

    it("Should allow owner to mint tokens", async function () {
      await expect(tariToken.connect(owner).safeMint(recipient.address, tokenURI))
        .to.emit(tariToken, "Transfer")
        .withArgs(ethers.ZeroAddress, recipient.address, 0);

      expect(await tariToken.ownerOf(0)).to.equal(recipient.address);
      expect(await tariToken.tokenURI(0)).to.equal(tokenURI);
    });

    it("Should prevent non-owners from minting", async function () {
      await expect(
        tariToken.connect(recipient).safeMint(recipient.address, tokenURI)
      ).to.be.revertedWithCustomError(tariToken, "OwnableUnauthorizedAccount");
    });
  });

  describe("Token URI", function () {
    const tokenURI = "https://example.com/token/1";

    it("Should set and retrieve token URI correctly", async function () {
      await tariToken.connect(owner).safeMint(recipient.address, tokenURI);
      
      const retrievedURI = await tariToken.tokenURI(0);
      expect(retrievedURI).to.equal(tokenURI);
    });
  });
});