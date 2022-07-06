import { Definitions } from "../parser/utils/types";
/**
 * Generate a contract ABI
 * @param path The path to write the ABI to.
 * @param functions Function definitions map.
 * @param events Event definitions map.
 * @returns Contract ABI.
 */
export declare const generateAbi: (functions: Definitions["data"], events: Definitions["data"]) => string;
//# sourceMappingURL=index.d.ts.map