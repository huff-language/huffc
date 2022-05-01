# Understanding the EVM

The Ethereum Virtual Machine, or EVM for short, is the brains behind Ethereum. It's a computation engine, as the name suggests, similar to the virtual machines in Microsoft's.NET Framework or interpreters for other bytecode-compiled programming languages like Java.

The EVM is the part of the Ethereum protocol that controls the deployment and execution of smart contracts. It can be compared to a global decentralized computer with millions of executable things (contracts), each with its own permanent data store.

## Technical

> **_NOTE:_** This tutorial assumes that you are somewhat familiar with Solidity and therefore understand the basics of Ethereum development, including contracts, state, external calls, etc...

The EVM runs as a stack machine with a depth of 1024 items. Each item is a 256 bit word (32 bytes), which was chosen due its compatibility with 256-bit encryption. Since the EVM is a stack-based VM, you typically PUSH data onto the top of it, POP data off, and apply instructions like ADD or MUL to the first few values that lay on top of it.

<p align="center"><img src="https://i.imgur.com/q6iEY7Z.png" width="640px"/></p>
<figcaption align = "center"><b>Fig.1 - Push/Pop Example from <i> "Playdate with the EVM"</i> by Femboy Capital</b></figcaption>

Here's an example of what pushing to and popping from the stack looks like. On the left, we see an element, `e`, being pushed to the top of stack and on the right, we see how `e` is removed or "popped" from it.

It's important to note that, while `e` was the last element to be pushed onto the stack (it is preceded by a, b, c, d), it is the first element to be removed when a pop occurs. This is because stacks follow the **LIFO** (Last In, First Out) principle, where the last element to be added is the first element to be removed.

<p align="center"><img src="https://i.imgur.com/SYJBUBS.png" width="640px"/></p>
<figcaption align = "center"><b>Fig.2 - MUL Opcode Example from <i> "Playdate with the EVM"</i> by Femboy Capital</b></figcaption>

Opcodes will often use stack elements as input, always taking the top (most recently added) elements. In the example above, we start with a stack consisting of `a`, `b`, `c`, and `d`. If you use the `MUL` opcode (which multiplies the two values at the top of the stack), `c` and `d` get popped from the stack and replaced by their product.

If this confuses you, don't worry! While reading about the EVM will teach you the basics, actually writing assembly serves as the best way to get the hang of it (and it's the most fun). Let's dive into some simple projects.
