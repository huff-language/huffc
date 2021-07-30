## What is Huff?

Huff is a domain-specific programming language created for the purpose of writing highly optimized code for the Ethereum Virtual Machine. It enables the construction of EVM assembly "macros" - individual blocks of bytecode that can be rigorously tested and evaluated.

Huff barely hides the inner-workings of the EVM behind syntactic sugar. Rather than having variables, Huff directly exposes the EVM's program stack to the developer to be manually manipulated. While this makes Huff programs significantly harder to write, it gives the developer much more control over the code they write.
