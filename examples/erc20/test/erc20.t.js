const { expect } = require("chai");
const { ethers } = require("hardhat");

let token;
let accounts;
let owner;
let user;

describe("ERC20", function () {
  beforeEach(async function () {
    accounts = await hre.ethers.getSigners();

    owner = accounts[0].address;
    user = accounts[1].address;

    const Token = await ethers.getContractFactory("ERC20");
    token = await Token.deploy();
    await token.deployed();
  });

  it("Mint & Balance Check", async function () {
    let bal = await token.balanceOf(user);

    await token.mint(user, 6900);

    bal = await token.balanceOf(user);

    expect(bal).to.equal(6900);
  });

  it("total supply check", async function () {
    let initSupply = await token.totalSupply();

    expect(initSupply.toNumber()).to.equal(0);

    const val = 6900;
    await token.mint(user, val);

    let newSupply = await token.totalSupply();

    expect(newSupply).to.equal(val);
  });
});
