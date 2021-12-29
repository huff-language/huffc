# The Huff Programming Language

<img src="https://i.imgur.com/I9IkxuW.png" height="180">

Huff is a low-level programming language, designed for developing highly optimized smart contracts that run on the Ethereum Virtual Machine. Huff does not hide the inner-workings of the EVM, instead, directly exposing its programming stack to the developer for manual manipulation.

Using the Huff

## Example

"Hello World" in Huff:

```
#define macro MAIN() = takes (0) returns (0) {
    0x48656c6c6f2c20776f726c6421 0x00 mstore // Store "Hello, World!" in memory at position 0.
    0x1a 0x00 return // Return 26 bytes of data starting from memory pointer position 0.
}
```
