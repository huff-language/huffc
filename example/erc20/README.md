## Mintable ERC20 implementation in Huff

This is an ERC20 contract implemented in Huff to demonstrate the language's (very basic) syntax. It consists of three files:

| filename             | description                                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| `erc20.huff`         | Huff source file                                                                                                |
| `erc20_interface.js` | JavaScript methods allowing the user to easily run Huff macros corresponding to ERC20 methods (e.g. `transfer`) |
| `erc20.spec.js`      | Unit tests -- the Huff code really works!                                                                       |

(Example unit tests can be run from `/huff/` with `yarn exampletest`.)

The process by which the Huff code was created is documented in a series of blog posts on Medium:
1. [About Huff, constructor, and function selector](https://medium.com/aztec-protocol/from-zero-to-nowhere-smart-contract-programming-in-huff-1-2-ba2b6de7fa83)
2. [Events, mappings, and `transfer`](https://medium.com/aztec-protocol/from-zero-to-nowhere-smart-contract-programming-in-huff-2-3-5438ef7e5beb)
3. [`totalSupply`, `balanceOf`, and `mint`](https://medium.com/aztec-protocol/from-zero-to-nowhere-smart-contract-programming-in-huff-3-4-6b347e23d66e)
4. [Nested mappings, `allowance`, `approve`, and `transferFrom`](https://medium.com/aztec-protocol/from-zero-to-nowhere-smart-contract-programming-in-huff-4-4-9e6c34648992)
