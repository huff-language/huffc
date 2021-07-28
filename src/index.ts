import { program } from "commander";
import compiler from "./compiler";

program.option("-a, --args <args>", "arguments", "");

program.parse(process.argv);
const options = program.opts();

const command = process.argv[2];

if (command === "compile") {
  const file = process.argv[3];
  const path = file.split("/");

  console.log(`Compiling ${path[path.length - 1]}`, "\n");
  const code = `0x${compiler(process.argv[3], "./", options.args, {})}`;

  console.log("\x1b[32m", "Compiled Sucessfully", "\x1b[0m");
  console.log(code, "\n");
}

// if () {
//   console.log(`0x${compiler(options.compile, options.dir, options.args, {})}`);
// }
