import { program } from "commander";
import compile from "../src/index";

// Define terminal commands.
program
  .option("-a, --args <args>", "arguments to pass in", "")
  .option("-i, --input <file>", "files to compile", "./")
  .option("-o, --output <file>", "files to output the abi", "./");

// Parse the terminal arguments.
program.parse(process.argv);
const options = program.opts();
const command = process.argv[2];

// The user wants us to compile a file.
if (command === "compile") {
  compile(options.input, options.output, [{ value: options.args, type: "bytes" }]);
}
