const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Token = await ethers.getContractFactory("ERC20");
    const token = await Token.deploy();
    await token.deployed();
  });
});
