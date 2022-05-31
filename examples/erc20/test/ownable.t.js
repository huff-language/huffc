const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

let accounts;
let owner;
let user;

let ownable;
//utils
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("OWNABLE", function () {
  beforeEach(async function () {
    const Ownable = await ethers.getContractFactory("Ownable");
    accounts = await hre.ethers.getSigners();

    owner = accounts[0].address;
    user = accounts[1].address;

    ownable = await Ownable.deploy();
    await ownable.deployed();
  });

  it("Ownable is deployed", async function () {
    expect(ownable.address).to.not.equal(ZERO_ADDRESS);
  });

  it("verify the owner", async function () {
    const newOwner = await ownable.owner();
    expect(newOwner).to.equal(owner);
  });

  it("owner updated to a new owner", async function () {
    await ownable.setOwner(user);
    const newOwner = await ownable.owner();
    expect(newOwner).to.equal(user);
  });

  it("Revert on zero address", async function () {
    await expect(ownable.setOwner(ZERO_ADDRESS)).to.be.reverted;
  });
});
