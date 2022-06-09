import { program } from "commander";
import compile from "./";
import fs = require("fs");

// Compiler Version
const version = "2.0.0";

// Define terminal commands.
program.name("huffc");
program.version(version);
program
  .option("-V, --version", "Show the version and exit")
  .option("--base-path <path>", "The base path to the contracts", "./")
  .option("--output-directory <output-dir>", "The output directory", "./")
  .option("--bytecode", "Generate and log bytecode", false)
  .option("-o, output", "The output file")
  .option("-p, --paste", "Paste the output to the terminal")
  .option("-n, --no-linebreak", "Omit newline charater");

// Parse the terminal arguments.
program.parse(process.argv);
const options = program.opts();

var files = program.args;
var destination = options.outputDir || ".";

// Abort the program.
const abort = (msg) => {
  process.stderr.write(`${msg}\n` || "Error occured\n");
  process.exit(1);
};

// Iterate the imported files.
files.forEach((file) => {
  // Abort if the file extension is not .huff.
  if (!file.endsWith(".huff")) abort("File extension must be .huff");

  // Compile the file.
  const result = compile({
    filePath: file,
    generateAbi: true,
  });

  // If the user has specified an output file, write the output to the file.
  const outputPath = `${options.outputDirectory}${files[0].replace(".huff", ".json")}`;
  if (options.output) fs.writeFileSync(outputPath, result.abi);

  // If the user has specified for us to log the bytecode, log it.
  if (options.bytecode && !options.paste) {
    process.stdout.write(result.bytecode);
    if (options.linebreak) process.stdout.write('\n');
  }
  if (options.paste) process.stdout.write(`${JSON.stringify(result)}\n`);
});
