const { expect } = require("chai");
const { ethers } = require("hardhat");

let token;
let accounts;

describe("ERC20", function () {
  beforeEach(async function () {
    accounts = await hre.ethers.getSigners();

    const Token = await ethers.getContractFactory("ERC20");
    token = await Token.deploy();
    await token.deployed();
  });

  it("Mint & Balance Check", async function () {
    const user = accounts[0].address;
    let bal = await token.balanceOf(user);
    console.log("Balance", bal.toNumber());

    await token.mint(user, 6900);
    // await token.setBalance(user, 6900);

    bal = await token.balanceOf(user);

    expect(bal).to.equal(6900);
  });
});
