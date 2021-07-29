## **Huff**: a low level programming language for the Ethereum Virtual Machine

<p align="center"><img src="https://i.imgur.com/SVRjUhU.png" width="640px"/></p>

Huff is a domain-specific programming language created for the purpose of writing highly optimized code for the Ethereum Virtual Machine. It enables the construction of EVM assembly "macros" - individual blocks of bytecode that can be rigorously tested and evaluated.

Huff barely hides the inner-workings of the EVM behind syntactic sugar. Rather than having variables, Huff directly exposes the EVM's program stack to the developer to be manually manipulated.

### **"That sounds terrible! Why learn Huff?"**

Huff was orginally developed by [Aztec Protocol](https://github.com/AztecProtocol) to create [Weierstrudel](https://github.com/AztecProtocol/weierstrudel/tree/master/huff_modules), an elliptic curve arithmetic library that required extremely optimized code.

Huff is designed for developing extremely optimized smart contract code, where the direct manipulation of the program's bytecode is preferred. Using the Huff runtime testing suite, Huff macros can be rigorously tested without having to split the program into functions and invoke jump instructions.

Beyond writing performant code, learning Huff can help you learn all about the Ethereum Virtual Machine as well as develop your understanding of other EVM programming languages like Solidity and Vyper.

### **"Where can I find example Huff code?"**

[ERC20](https://github.com/JetJadeja/huff/blob/master/example/erc20/erc20.huff), the ERC20 token standard written entirely in Huff.

[Minisig.huff](https://github.com/wolflo/minisig.huff) is a minimal multisignature wallet written in Huff.

[EVM-Hypervisor](https://github.com/d1ll0n/evm-hypervisor) is an EVM emulator, allowing you to execute the logic of another contract without using `DELEGATECALL`.

[Proxies.huff](https://github.com/wolflo/proxies.huff), a collection of different Huff proxy implementations.

[weierstrudel](https://github.com/AztecProtocol/weierstrudel/tree/master/huff_modules) is an elliptic curve arithmetic library written entirely in Huff, with its contract code totalling over 14kb.
