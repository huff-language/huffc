"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var commander_1 = require("commander");
var _1 = __importDefault(require("./"));
var fs = require("fs");
// Compiler Version
var version = "2.1.0";
// Define terminal commands.
commander_1.program.name("huffc");
commander_1.program.version(version);
commander_1.program
    .option("-V, --version", "Show the version and exit")
    .option("--base-path <path>", "The base path to the contracts", "./")
    .option("--output-directory <output-dir>", "The output directory", "./")
    .option("--bytecode", "Generate and log bytecode", false)
    .option("-o, output", "The output file")
    .option("-p, --paste", "Paste the output to the terminal")
    .option("-n, --no-linebreak", "Omit newline charater");
// Parse the terminal arguments.
commander_1.program.parse(process.argv);
var options = commander_1.program.opts();
var files = commander_1.program.args;
var destination = options.outputDirectory || ".";
// Abort the program.
var abort = function (msg) {
    process.stderr.write("".concat(msg, "\n") || "Error occured\n");
    process.exit(1);
};
// Iterate the imported files.
files.forEach(function (file) {
    // Abort if the file extension is not .huff.
    if (!file.endsWith(".huff"))
        abort("File extension must be .huff");
    // Compile the file.
    var result = (0, _1["default"])({
        kind: "file",
        filePath: file,
        generateAbi: true
    });
    // If the user has specified an output file, write the output to the file.
    var outputPath = "".concat(destination).concat(files[0].replace(".huff", ".json"));
    if (options.output)
        fs.writeFileSync(outputPath, result.abi);
    // If the user has specified for us to log the bytecode, log it.
    if (options.bytecode && !options.paste) {
        process.stdout.write(result.bytecode);
        if (options.linebreak)
            process.stdout.write('\n');
    }
    if (options.paste)
        process.stdout.write("".concat(JSON.stringify(result), "\n"));
});
