const { expect } = require("chai");
const { assert } = require("console");
const { ethers } = require("hardhat");

let erc721, owner;

const DEAD = "0x000000000000000000000000000000000000dAeD"

describe("ERC721", function () {
  before(async function () {
    [owner] = await ethers.getSigners();
  });

  beforeEach(async function () {
    const ERC721 = await ethers.getContractFactory("ERC721");
    erc721 = await ERC721.deploy();
    await erc721.deployed();
  });

  it("ERC721 is deployed", async function () {
    expect(erc721.address).to.not.equal("0x0000000000000000000000000000000000000000");
  });

  it("Can mint a NFT", async function () {
    await erc721.mint(DEAD, 1337);
    expect(await erc721.ownerOf(1337)).to.equal(DEAD);
    expect(await erc721.balanceOf(DEAD)).to.equal(1);
  });

  it("Can approve a NFT", async function () {
    await erc721.mint(owner.address, 1337);
    await erc721.approve(DEAD, 1337);
    expect(await erc721.getApproved(1337)).to.equal(DEAD);
  });
});
