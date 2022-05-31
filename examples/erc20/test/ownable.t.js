const { expect } = require("chai");
const { assert } = require("console");
const { ethers, waffle } = require("hardhat");

let ownable;
const [wallet, user] = waffle.provider.getWallets();
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("OWNABLE", function () {
  beforeEach(async function () {
    const Ownable = await ethers.getContractFactory("Ownable");
    ownable = await Ownable.deploy();
    await ownable.deployed();
  });

  it("Ownable is deployed", async function () {
    expect(ownable.address).to.not.equal(ZERO_ADDRESS);
  });

  it("verify the owner", async function () {
    const owner = await ownable.owner();
    expect(owner).to.equal(wallet.address);
  });

  it("owner updated to a new owner", async function () {
    await ownable.connect(wallet).setOwner(user.address);
    const owner = await ownable.owner();
    expect(owner).to.equal(user.address);
  });

  it("Revert on zero address", async function () {
    await expect(ownable.setOwner(ZERO_ADDRESS)).to.be.reverted;
  });

  it("Revert if someone other then owner tries to setOwner", async function () {
    await expect(ownable.connect(user).setOwner(user.address)).to.be.reverted;
  });
});
