import compile from "../src/compiler";
import encodeArgs from "./utils/encode";
import run, { test } from "./utils/test-helpers";

test("Proxy compiles", async () => {
  const code = compile(
    "1_Correct.huff",
    "./tests/contracts",
    encodeArgs(["address"], ["0x8733593b6418be9A0CCDEF9BbB8C0CC4E7bE88aC"]),
    {}
  );

  if (
    code !==
    "33600155601F38036000526020600051600139600051600055610045806100266000396000f360003560e01c8063c89e43611461002d5780638da5cb5b146100395760003680828337818291836000545af4f35b60005460005260206000f35b60015460005260206000f30000000000000000000000008733593b6418be9a0ccdef9bbb8c0cc4e7be88ac"
  ) {
    throw "Code does not match";
  }
});

run("Compiler");
