const chai = require('chai');

const { expect } = chai;
const BN = require('bn.js');
const crypto = require('crypto');
const erc20 = require('./erc20_interface.js');

describe('ERC20 Huff contract', () => {
    const owner = new BN(crypto.randomBytes(20), 16);
    const user1 = new BN(crypto.randomBytes(20), 16);
    const user2 = new BN(crypto.randomBytes(20), 16);
    const user3 = new BN(crypto.randomBytes(20), 16);
    const user4 = new BN(crypto.randomBytes(20), 16);
    const value1 = new BN(12000);
    const value2 = new BN(7300);
    const value3 = new BN(6500);
    const value4 = new BN(5003);
    const value5 = new BN(4720);
    const value6 = new BN(4302);

    before(async () => {
        await erc20.init(owner);
    });

    it('balances and totalSupply initialised to 0', async () => {
        const balance1 = await erc20.getBalanceOf(owner);
        expect(balance1.eq(new BN(0))).to.equal(true);
        const balance2 = await erc20.getBalanceOf(user1);
        expect(balance2.eq(new BN(0))).to.equal(true);
        const totalSupply = await erc20.getTotalSupply();
        expect(totalSupply.eq(new BN(0))).to.equal(true);
    });

    it('mint tokens to owner', async () => {
        await erc20.mint(owner, owner, value1);
        const ownerBalance = await erc20.getBalanceOf(owner);
        expect(ownerBalance.eq(value1)).to.equal(true);
        const totalSupply = await erc20.getTotalSupply();
        expect(totalSupply.eq(value1)).to.equal(true);
    });

    it('mint tokens to non-owner', async () => {
        await erc20.mint(owner, user1, value2);
        const balance = await erc20.getBalanceOf(user1);
        expect(balance.eq(value2)).to.equal(true);
        const totalSupply = await erc20.getTotalSupply();
        expect(totalSupply.eq(value1.add(value2))).to.equal(true);
    });

    it('transfer tokens', async () => {
        await erc20.transfer(user1, user2, value3);
        const balance1 = await erc20.getBalanceOf(user1);
        const balance2 = await erc20.getBalanceOf(user2);
        expect(balance1.eq(value2.sub(value3))).to.equal(true);
        expect(balance2.eq(value3)).to.equal(true);
    });

    it('allowances initialised to 0', async () => {
        const allowance1 = await erc20.getAllowance(owner, user2);
        expect(allowance1.eq(new BN(0))).to.equal(true);
        const allowance2 = await erc20.getAllowance(user1, user3);
        expect(allowance2.eq(new BN(0))).to.equal(true);
    });

    it('approve tokens', async () => {
        await erc20.approve(user2, user3, value4);
        const allowance = await erc20.getAllowance(user2, user3);
        expect(allowance.eq(value4)).to.equal(true);
    });

    it('transferFrom', async () => {
        await erc20.transferFrom(user3, user2, user4, value5);
        const allowance = await erc20.getAllowance(user2, user3);
        expect(allowance.eq(value4.sub(value5))).to.equal(true);
        const balance2 = await (erc20.getBalanceOf(user2));
        const balance3 = await (erc20.getBalanceOf(user3));
        const balance4 = await (erc20.getBalanceOf(user4));
        expect(balance2.eq(value3.sub(value5))).to.equal(true);
        expect(balance3.eq(new BN(0))).to.equal(true);
        expect(balance4.eq(value5)).to.equal(true);
    });

    it('transfer again', async () => {
        await erc20.transfer(user4, user1, value6);
        const balance1 = await (erc20.getBalanceOf(user1));
        const balance4 = await (erc20.getBalanceOf(user4));
        expect(balance1.eq(value2.sub(value3).add(value6))).to.equal(true);
        expect(balance4.eq(value5.sub(value6))).to.equal(true);
    });

    it('mint again', async () => {
        await erc20.mint(owner, user2, value4);
        const balance2 = await (erc20.getBalanceOf(user2));
        expect(balance2.eq(value3.sub(value5).add(value4)));
        const totalSupply = await erc20.getTotalSupply();
        expect(totalSupply.eq(value1.add(value2).add(value4))).to.equal(true);
    });
});
