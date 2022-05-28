const { expect } = require("chai");
const { assert } = require("console");
const { ethers } = require("hardhat");

let erc721, owner, erc721Buffoon, buffoon;

const DEAD = "0x000000000000000000000000000000000000dAeD";
const BEEF = "0x000000000000000000000000000000000000bEEF";
const CAFE = "0x000000000000000000000000000000000000cafE";
const FEED = "0x000000000000000000000000000000000000FEeD";
const ADDRESS0 = "0x0000000000000000000000000000000000000000";

describe("ERC721", function () {
  before(async function () {
    [owner, buffoon] = await ethers.getSigners();
    console.log(`Owner is ${owner.address}`);
    console.log(`Buffoon is ${buffoon.address}`);
  });

  beforeEach(async function () {
    const ERC721 = await ethers.getContractFactory("ERC721");
    erc721 = await ERC721.deploy();
    await erc721.deployed();

    erc721Buffoon = await erc721.connect(buffoon);
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

  it("Can approve for all", async function () {
    await erc721.setApprovalForAll(DEAD, true);
    expect(await erc721.isApprovedForAll(owner.address, DEAD)).to.equal(1);
  });

  it("Can transerFrom", async function () {
    const from = buffoon.address;

    await erc721.mint(from, 1337);

    await erc721Buffoon.approve(owner.address, 1337);
    await erc721.transferFrom(from, DEAD, 1337);

    expect(await erc721.ownerOf(1337)).to.equal(DEAD);
    expect(await erc721.balanceOf(DEAD)).to.equal(1);
    expect(await erc721.getApproved(1337)).to.equal(ADDRESS0);
    expect(await erc721.balanceOf(from)).to.equal(0);
  });

  it("Can transerFrom as self", async function () {

    await erc721.mint(owner.address, 1337);
    await erc721.transferFrom(owner.address, DEAD, 1337);

    expect(await erc721.ownerOf(1337)).to.equal(DEAD);
    expect(await erc721.balanceOf(DEAD)).to.equal(1);
    expect(await erc721.getApproved(1337)).to.equal(ADDRESS0);
    expect(await erc721.balanceOf(owner.address)).to.equal(0);
  });

  it("Cannot double mint", async function() {
    await erc721.mint(owner.address, 1337);
    await expect(erc721.mint(owner.address, 1337)).to.be.reverted;
  });

  it("Cannot approve unminted", async function() {
    await expect(erc721.approve(DEAD, 1337)).to.be.reverted;
  });

  it("Cannot approve someone's else token", async function() {
    await erc721.mint(owner.address, 1337);
    await expect(erc721Buffoon.approve(DEAD, 1337)).to.be.reverted;
  });

  it("Cannot transfer unowned token", async function() {
    await expect(erc721.transferFrom(buffoon.address, DEAD, 1337)).to.be.reverted;
  });

  it("Cannot transferFrom using wrong from", async function() {
      await erc721.mint(CAFE, 1337);
      await expect(erc721.transferFrom(FEED, BEEF, 1337)).to.be.reverted;
  });

});
