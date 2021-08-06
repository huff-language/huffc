# Introduction

## What is Huff?

Huff is a domain-specific programming language created for the purpose of writing highly optimized code for the Ethereum Virtual Machine. It enables the construction of EVM assembly "macros" - individual blocks of bytecode that can be rigorously tested and evaluated.

Huff barely hides the inner-workings of the EVM behind syntactic sugar. Rather than having variables, Huff directly exposes the EVM's program stack to the developer to be manually manipulated. While this makes Huff programs significantly harder to write, it gives the developer much more control over the code they write.

## Why you should learn Huff!

Huff was orginally developed by [Aztec Protocol](https://github.com/AztecProtocol) to create [Weierstrudel](https://github.com/AztecProtocol/weierstrudel/tree/master/huff_modules), an elliptic curve arithmetic library that required extremely optimized code that could not be written on Solidity or even inline assembly.

Huff is designed for developing extremely optimized smart contract code, where the direct manipulation of a program's bytecode is beneficial to the developer. Using the Huff runtime testing suite, each macro can be rigorously evaluated without having to split the contract into seperate functions.

Beyond writing performant code, learning Huff can teach you all about the Ethereum Virtual Machine as well as develop your understanding of other EVM programming languages like Solidity and Vyper.
