const { expect } = require("chai");
const { ethers } = require("hardhat");

let token;
let owner, bob, chad;
let val;

function encodeShortString(arg) {
  const encodedArg = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(arg));
  const encodedLength = ethers.utils.hexZeroPad(ethers.utils.hexValue((encodedArg.length-2)/2), 2).substr(2);
  return encodedArg + "0".repeat(64 - encodedArg.length - 2) + encodedLength;
}

describe("ERC20", () => {
  beforeEach(async () => {
    val = 1e10;
    [owner, bob, chad] = await ethers.getSigners();

    const name = encodeShortString('Huff Token');
    const symbol = encodeShortString('HUFF');
    const constructorArgs = name.substr(2) + symbol.substr(2);

    const ERC20 = await ethers.getContractFactory("ERC20");
    const NERC20 = await new ethers.ContractFactory(ERC20.interface, ERC20.bytecode + constructorArgs, owner);
    token = await NERC20.deploy();
    await token.deployed();
  });

  it("Metadata Check", async () => {
    let name = await token.name();
    let symbol = await token.symbol();

    expect(name).to.equal("Huff Token");
    expect(symbol).to.equal("HUFF");
  });

  it("Mint & Balance Check", async () => {
    // Chad cannot mint
    await expect(token.connect(chad).mint(bob.address, val)).to.be.reverted;
    // Owner can mint
    let bal = await token.balanceOf(bob.address);
    expect(bal).to.equal(0);

    await token.mint(bob.address, val);

    expect(await token.balanceOf(bob.address)).to.equal(val);
  });

  it("allowance test", async () => {
    let initAllowance = await token.allowance(owner.address, bob.address);

    expect(initAllowance).to.equal(0);

    await token.approve(bob.address, val);

    let newAllowance = await token.allowance(owner.address, bob.address);

    expect(newAllowance).to.equal(val);
  });
});
