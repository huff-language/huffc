const BN = require('bn.js');
const { Runtime, getNewVM } = require('../../src/runtime.js');

const main = new Runtime('erc20.huff', __dirname);
const vm = getNewVM();

const logSteps = false;
const logGas = false;

if (logSteps) {
    vm.on('step', (data) => {
        console.log(`Opcode: ${data.opcode.name}\tStack: ${data.stack}`);
    });
}

async function init(caller) {
    const initialMemory = []; const inputStack = []; const calldata = []; const
        callvalue = 0;
    const callerAddr = caller;
    await main(vm, 'ERC20', inputStack, initialMemory, calldata, callvalue, callerAddr);
}

async function getTotalSupply() {
    const calldata = [{ index: 0, value: 0x18160ddd, len: 4 }];
    const initialMemory = []; const inputStack = []; const
        callvalue = 0;
    const callerAddr = 0; // callerAddr doesn't matter
    const data = await main(vm, 'ERC20__MAIN', inputStack, initialMemory, calldata, callvalue, callerAddr);
    if (logGas) { console.log(`Gas used by totalSupply(): ${data.gas}`); }
    return new BN(data.returnValue.toString('hex'), 16);
}

async function getBalanceOf(owner) {
    const calldata = [{ index: 0, value: 0x70a08231, len: 4 }, { index: 4, value: owner, len: 32 }];
    const initialMemory = []; const inputStack = []; const
        callvalue = 0;
    const callerAddr = 0; // callerAddr doesn't matter
    const data = await main(vm, 'ERC20__MAIN', inputStack, initialMemory, calldata, callvalue, callerAddr);
    if (logGas) { console.log(`Gas used by balanceOf(...): ${data.gas}`); }
    return new BN(data.returnValue.toString('hex'), 16);
}

async function transfer(caller, to, value) {
    const calldata = [{ index: 0, value: 0xa9059cbb, len: 4 },
        { index: 4, value: to, len: 32 },
        { index: 36, value, len: 32 }];
    const initialMemory = []; const inputStack = []; const
        callvalue = 0;
    const callerAddr = caller;
    const data = await main(vm, 'ERC20__MAIN', inputStack, initialMemory, calldata, callvalue, callerAddr);
    if (logGas) { console.log(`Gas used by transfer(...): ${data.gas}`); }
}

async function mint(caller, to, value) {
    const calldata = [{ index: 0, value: 0x40c10f19, len: 4 },
        { index: 4, value: to, len: 32 },
        { index: 36, value, len: 32 }];
    const initialMemory = []; const inputStack = []; const
        callvalue = 0;
    const callerAddr = caller;
    const data = await main(vm, 'ERC20__MAIN', inputStack, initialMemory, calldata, callvalue, callerAddr);
    if (logGas) { console.log(`Gas used by mint(...): ${data.gas}`); }
}

async function getAllowance(owner, spender) {
    const calldata = [{ index: 0, value: 0xdd62ed3e, len: 4 },
        { index: 4, value: owner, len: 32 },
        { index: 36, value: spender, len: 32 }];
    const initialMemory = []; const inputStack = []; const
        callvalue = 0;
    const callerAddr = 0; // callerAddr doesn't matter
    const data = await main(vm, 'ERC20__MAIN', inputStack, initialMemory, calldata, callvalue, callerAddr);
    if (logGas) { console.log(`Gas used by allowance(...): ${data.gas}`); }
    return new BN(data.returnValue.toString('hex'), 16);
}

async function approve(caller, spender, amount) {
    const calldata = [{ index: 0, value: 0x095ea7b3, len: 4 },
        { index: 4, value: spender, len: 32 },
        { index: 36, value: amount, len: 32 }];
    const initialMemory = []; const inputStack = []; const
        callvalue = 0;
    const callerAddr = caller;
    const data = await main(vm, 'ERC20__MAIN', inputStack, initialMemory, calldata, callvalue, callerAddr);
    if (logGas) { console.log(`Gas used by approve(...): ${data.gas}`); }
}

async function transferFrom(caller, owner, recipient, amount) {
    const calldata = [{ index: 0, value: 0x23b872dd, len: 4 },
        { index: 4, value: owner, len: 32 },
        { index: 36, value: recipient, len: 32 },
        { index: 68, value: amount, len: 32 }];
    const initialMemory = []; const inputStack = []; const
        callvalue = 0;
    const callerAddr = caller;
    const data = await main(vm, 'ERC20__MAIN', inputStack, initialMemory, calldata, callvalue, callerAddr);
    if (logGas) { console.log(`Gas used by transferFrom(...): ${data.gas}`); }
}

module.exports = {
    init, getTotalSupply, getBalanceOf, transfer, mint, approve, getAllowance, transferFrom,
};
