# Getting started

Huff is a low-level programming language designed for developing highly optimized smart contracts that run on the ethereum virtual machine (EVM). Huff does not hide the inner workings of the EVM. Instead, Huff exposes its programming stack to the developer for manual manipulation.

Rather than having functions, Huff has macros - individual blocks of bytecode that can be rigorously tested and evaluated using the Huff runtime testing suite.

The [Aztec Protocol](https://aztec.network/) team created Huff to write [Weierstrudel](https://github.com/aztecprotocol/weierstrudel/tree/master/huff_modules). Weierstrudel is an on-chain elliptical curve arithmetic library that requires incredibly optimized code that neither [Solidity](https://docs.soliditylang.org/) nor [Yul](https://docs.soliditylang.org/en/latest/yul.html) could provide.

While EVM experts can use Huff to write highly-efficient smart contracts for use in production, it can also serve as a way for beginners to learn more about the EVM.

## Command-line quickstart

If you plan on using Huff from the command-line, use the `huffc` package. `huffc` can be installed using [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). You'll also need [Typescript](https://www.npmjs.com/package/ts-node#overview) and [TS-Code](https://www.npmjs.com/package/ts-node#overview) installed.

Here's how to create the contract bytecode to output _Hello, World!_ in Huff.

1. Install Huff globally using NPM:

    ```shell
    npm install -g huffc
    ```

1. Create a file called `hello-world.huff` and enter the following content:

    ```javascript
    #define macro MAIN() = takes (0) returns (0) {
        0x48656c6c6f2c20776f726c6421 0x00 mstore // Store "Hello, World!" in memory.
        0x1a 0x00 return // Return 26 bytes starting from memory pointer 0.
    }
    ```

1. Use `huffc` to compile the contract and output bytecode:

    ```shell
    huffc hello-world.huff --bytecode
    ```

    This will output something like:

    ```plaintext
    6100168061000d6000396000f36c48656c6c6f2c20776f726c6421600052601a6000f3 
    ```

## Hardhat

[Hardhat](https://hardhat.org/) is a development environment for compiling, deploying, testing, and debugging smart contracts. Hardhat lets you automatically compile your contracts, write and run unit tests, deploy to mainnet, and much more.

We highly recommend using Hardhat when working with Huff. It makes managing your contracts much easier and will save you lots of time. From this point forward, **the rest of the documentation assumes that you are using Hardhat**.

:::warning
Before we get started, you need to ensure you have the latest _Long-term support_ (LTS) version of Node.js installed. We recommend using [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm) to easily switch between Node.js versions.
:::

1. Create a new repository using the [huff-language/huff-project-template](https://github.com/huff-language/huff-project-template) template on GitHub.
1. Clone your repository and install the packages:

    ```shell
    git clone https://github.com/<USERNAME>/<PROJECT_NAME> 
    cd <PROJECT_NAME>
    npm install
    ```

1. Compile the contracts within this project:

    ```shell
    npx hardhat compile
    ```

    This command should output something like:

    ```plaintext
    Nothing to compile
    Pulling Huff version 0.0.17
    Compiling contracts/Number.huff
    ```

1. Run the tests to check that the contract does what it's designed to:

    ```shell
    npx hardhat test
    ```

    This command should output something like:

    ```plaintext
    Compiling contracts/Number.huff

    Greeter
        ✓ Number is deployed
        ✓ Number can be set

    [...]

    2 passing (312ms)
    ```

For more information on using Hardhat, [check out their documentation](https://hardhat.org/getting-started/).

## Troubleshooting Hardhat

If you run into issues with compiling and testing the contracts, it might be because you are running an incompatible version of Node.js with Hardhat. This quote is from the official Hardhat documentation:

> Hardhat supports every currently maintained LTS Node.js version, up to two months after its end-of-life. After that period of time, we will stop testing against it, and print a warning when trying to use it. At that point, we will release a new minor version.
>
> We recommend running Hardhat using the current LTS Node.js version. You can learn about it [here (opens new window)](https://nodejs.org/en/about/releases/).
