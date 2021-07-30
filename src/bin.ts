import { program } from "commander";
import compiler from "./huff/compiler";

console.log("");

program
  .option("-a, --args <args>", "arguments", "")
  .option("-d, --dir <dir>", "default directory for contracts", "./");

program.parse(process.argv);
const options = program.opts();

const command = process.argv[2];

if (command === "compile") {
  const errors = [];

  for (let i = 3; i < process.argv.length; i++) {
    const file = process.argv[i];
    const path = file.split("/");

    if (file.startsWith("--")) continue;

    try {
      console.log("-----------------------------");
      console.log(`\x1b[1mCompiling ${path[path.length - 1]}`, "\n\x1b[0m");
      const code = `0x${compiler(process.argv[i], options.dir, options.args)}`;
      console.log("\x1b[32m", "Compiled Sucessfully", "\x1b[0m");
      console.log(code, "\n");
    } catch (e) {
      errors.push(e);
    }
  }

  for (let i = 0; i < errors.length; i++) {
    console.log(errors[i]);
  }
} else if (command === "help" || !command) {
  console.log(`
                                                                                    
                                                                                
                                     (@@@/                                      
                                 &&&&&@#&&&&&&&                                 
                               &&&&&&&&&&&&&&                                   
                                &&&&&&@&&&&@&&                                  
                              @#&&&& &&&&&&&&&&                                 
                              &&@&&&@&&&@&&&&&&&                                
                               &&&&&@&&.@   &&&@                                
                               @&@&&&&&&&.@.                                    
                                &.&&&&&&&&&.&&                                  
                                &@&&&&&&&&&& &&                                 
                                 &&&&&&&&&&&&&                                  
                                  &&&&&&&&&&&%                                  
                                   &&&&&&&&&&                                   
                                 %&&&&&&&&&&&&                                  
                               &&&&&&&&&&&&%%%%&                                
                                                      
  `);
  console.log(`
                             _    _        __  __ 
                            | |  | |      / _|/ _|
                            | |__| |_   _| |_| |_ 
                            |  __  | | | |  _|  _|
                            | |  | | |_| | | | |  
                            |_|  |_|\__,_|_| |_|  
                        
  `);
}
