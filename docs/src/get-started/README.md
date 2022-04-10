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

Here are the full list of arguments:

```
Usage: huffc [options]
Options:
  -V, --version                    output the version number
  -V, --version                    Show the version and exit
  --base-path <path>               The base path to the contracts (default: "./")
  --output-directory <output-dir>  The output directory (default: "./")
  --bytecode                       Generate and log bytecode (default: false)
  -o, output                       The output file
  -p, --paste                      Paste the output to the terminal
  -h, --help                       display help for command
```

## Hardhat Quickstart

You may use Huff from the command line or with Hardhat, a development environment for compiling, deploying, testing, and debugging smart contracts. With Hardhat, you can do things like automate compilation, write and run unit tests, deploy to mainnet, and much more.

> **_NOTE:_** The rest of the documentation will assume that you are using Hardhat
> To use Huff and Hardhat together, you must use the Hardhat Huff project template, which may be found [here](https://github.com/JetJadeja/huff-project-template). Once you have created a repository using the template, you can install the necessary packages by running:

```sh
npm install
```

To compile and test the contracts you can run the following commands respectively:

```sh
npx hardhat compile
npx hardhat test
```

For more information on how to use Hardhat, check out their documentation, located [here](https://hardhat.org/getting-started/).
