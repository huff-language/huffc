/* Type Representing Defintions */
export type Definitions = {
  data: { [name: string]: { args: any[]; value: string } };
  defintions: string[];
};

/* Top Level Context */
enum Context {
  NONE = 0,
  MACRO = 1,
}
