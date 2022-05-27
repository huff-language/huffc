const { expect } = require("chai");
const { assert } = require("console");
const { ethers } = require("hardhat");

let erc721;

describe("ERC721", function () {

  beforeEach(async function () {
    const ERC721 = await ethers.getContractFactory("ERC721");
    erc721 = await ERC721.deploy();
    await erc721.deployed();
  });

  it("ERC721 is deployed", async function () {
    expect(erc721.address).to.not.equal(
      "0x0000000000000000000000000000000000000000"
    );
  });

  it("Can mint a NFT", async function () {
    await erc721.mint("0x000000000000000000000000000000000000daed", 0);
    expect(await erc721.ownerOf(0)).to.equal("0x000000000000000000000000000000000000daed");
    expect(await number.balanceOf("0x000000000000000000000000000000000000daed")).to.equal(1);
  });
});
