import { ethers } from "ethers";

export default function encodeArgs(types: string[], values: any[]): string {
  const abiCoder = new ethers.utils.AbiCoder();

  return abiCoder.encode(types, values).replace(/^(0x)/, "");
}
