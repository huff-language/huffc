# The Huff Programming Language

![Huff logo.](logo.png)

Huff is a low-level programming language designed for developing highly optimized smart contracts that run on the Ethereum Virtual Machine (EVM). Huff does not hide the inner workings of the EVM. Instead, Huff exposes its programming stack to the developer for manual manipulation.

Rather than having functions, Huff has macros - individual blocks of bytecode that can be rigorously tested and evaluated using the Huff runtime testing suite.

Initially developed by the Aztec Protocol team, Huff was created to write [Weierstrudel](https://github.com/aztecprotocol/weierstrudel/tree/master/huff_modules). Weierstrudel is an on-chain elliptical curve arithmetic library that requires incredibly optimized code that neither [Solidity](https://docs.soliditylang.org/en/v0.8.14/) nor [Yul](https://docs.soliditylang.org/en/v0.8.9/yul.html) could provide.

While EVM experts can use Huff to write highly-efficient smart contracts for use in production, it can also serve as a way for beginners to learn more about the EVM.

## Examples

For usage examples, see the [huff-examples](https://github.com/huff-language/huff-examples) repository.

## Installation

### Prerequisities

Make sure you have the following programs installed:

- [yarn](https://www.npmjs.com/package/yarn)
- [Typescript](https://www.npmjs.com/package/typescript)
- [ts-node](https://www.npmjs.com/package/ts-node#overview)

### Steps

This is how to create the contract bytecode to output _Hello, World!_ in Huff.

1. Install Huff globally:

    ```shell
    yarn global add huffc
    ```

**Note:** You may need to add yarn to your system's path to access globally installed packages. See [the yarn docs on global](https://classic.yarnpkg.com/en/docs/cli/global) for more details.

## Hello World

1. Create a file called `hello-world.huff` and enter the following content:

    ```javascript
    #define macro MAIN() = takes (0) returns (0) {
        0x48656c6c6f2c20776f726c6421 0x00 mstore // Store "Hello, World!" in memory.
        0x1a 0x00 return // Return 26 bytes starting from memory pointer 0.
    }
    ```

2. Use `huffc` to compile the contract and output bytecode:

    ```shell
    huffc hello-world.huff --bytecode
    ```

    This will output something like:

    ```plaintext
    6100168061000d6000396000f36c48656c6c6f2c20776f726c6421600052601a6000f3 
    ```

## More help

Run `huffc --help` to view a full list of arguments:

```shell
huffc --help

> Usage: huffc [options]
> 
> Options:
>   -V, --version                    output the version number
>   -V, --version                    Show the version and exit
>   --base-path <path>               The base path to the contracts (default: "./")
>   --output-directory <output-dir>  The output directory (default: "./")
>   --bytecode                       Generate and log bytecode (default: false)
>   -o, output                       The output file
>   -p, --paste                      Paste the output to the terminal
>   -h, --help                       display help for command
```
