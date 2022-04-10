# Installation

## Prerequisites

In order to install the Huff compiler, you must have the Node Package Manager (npm). If you don't have it, you can install [here](https://nodejs.org/en/download/).

## Install

To install the Huff compiler, run:

```sh
npm install huff-language -g
```

If you prefer to use a local version, you can instead run:

```sh
npm install huff-language
```

## Usage

Installing the `huff-language` package installs both the compiler and the macro testing suite. The compiler can be used via the command line as well as a library that can be imported into your code and used for automated compilation. For now, we'll only focus on the CLI!

The Huff command line interfaces compiles files through the command line and logs the bytecode of the program (or raises an error if there is a syntax error within the code). The `huff-language` package also comes with a library that you can use to compile Huff files within your own code, but we will get to that later.

To use Huff's command line interface, use npx:

```py
npx huff compile file_1.huff file_2.huff
```

