import { default as Compile } from "./huff/compiler";
import { Runtime, getNewVM as NewVM } from "./huff/language/runtime";

export { Runtime, NewVM };
export default Compile;
