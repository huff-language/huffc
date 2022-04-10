# Basics

## What is Bytecode?

While most smart contract code is written with a high level language like Solidity or Vyper, it's compiled into something called _bytecode_ before being deployed onto the chain.

Bytecode is, as its name suggests, a sequence of bytes that serve as instructions for the Ethereum Virtual Machine. It isn't human-readable, but thankfully high level languages completely obscure the process of interacting with it.

**For example, here's a small Solidity contract:**

```js
pragma solidity 0.7.3;

contract Test {
    uint256 num = 100;
}
```

**The compiled bytecode for the contract above looks like this:**

```
0x60806040526064600055348015601457600080fd5b50603f8060226000396000f3fe60806040526000
80fdfea2646970667358221220dd2bec268729a625bb1afe439577f654b0102b6d7aeb76aeaeef1d14d6
359d6f64736f6c63430007030033
```

## Opcodes

Bytecode is composed of different opcodes, a set of instructions that tell the EVM to execute specific tasks. At the time of writing this, there are more than 170 different opcodes.

### Example

Take the bytecode sequence `0x6005600202` for example. While this may look like random sequence of bytes, it's actually a set of instructions that tells the EVM to multiply 5 and 2.

<p align="center"><img src="https://i.imgur.com/n38Fd1i.png" width="640px"/></p>
