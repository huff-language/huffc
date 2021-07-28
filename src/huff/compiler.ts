const parser = require("./language/parser");
const { padNBytes, toHex } = require("./language/utils");

export default function compile(filename: string, paths: string, args: string, settings: any) {
  return `${generateBytecode(filename, paths, {
    mainMacro: "MAIN",
    constructorMacro: "CONSTRUCTOR",
    ...settings,
  })}${args !== undefined ? args : ""}`;
}

export function generateBytecode(filename: string, paths: string, settings: any) {
  const { inputMap, macros, jumptables } = parser.parseFile(filename, paths);

  //prettier-ignore
  const { data: macroData } = parser.processMacro(settings.mainMacro, 0, [], macros, inputMap, jumptables);
  //prettier-ignore
  const { data: constructorData } = parser.processMacro(settings.constructorMacro, 0, [], macros, inputMap, {});

  const contractLength = macroData.bytecode.length / 2;
  const constructorLength = constructorData.bytecode.length / 2;

  const contractSize = padNBytes(toHex(contractLength), 2);
  const contractCodeOffset = padNBytes(toHex(13 + constructorLength), 2);

  // push2(contract size) dup1 push2(offset to code) push1(0) codecopy push1(0) return
  const bootstrapCode = `61${contractSize}8061${contractCodeOffset}6000396000f3`;
  const constructorCode = `${constructorData.bytecode}${bootstrapCode}`;

  const { bytecode } = macroData;
  const deployedBytecode = `${constructorCode}${bytecode}`;

  return deployedBytecode;
}
