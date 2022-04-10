# Getting Started

## Overview

Huff is a low-level assembly language, designed for developing highly optimized smart contracts that run on the Ethereum Virtual Machine. Huff does not hide the inner-workings of the EVM, instead, directly exposing its programming stack to the developer for manual manipulation.

Originally developed by the Aztec Protocol team, Huff was developed to write [Weierstrudel](https://github.com/AztecProtocol/weierstrudel/tree/master/huff_modules), an on-chain eliptical curve arithmetic library that required code so optimized, that it could not be written in Solidity, or even Yul.

While Huff can be used by EVM experts to design highly-efficient smart contracts for use in production, it can also serve as a way for beginners to learn more about the Ethereum Virtual Machine, projects built on it, and languages made for it.

## Command-Line Usage

If you plan on using Huff from the command line, you can use the `Huffc` package, which can be installed using [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). To install it globally, simply run:

```sh
npm install -g huffc
```

To compile a Huff contract and output its bytecode from the command line, you can run:

```sh
huffc compile filename.huff --bytecode
```

## Project Quickstart

While Huff can be used via the command-line, if you plan on having a project
