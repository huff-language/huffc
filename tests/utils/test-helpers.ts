// Tests
const preTests: { setup: Function }[] = [];
const preTest: { setup: Function }[] = [];
const tests: { name: string; test: Function }[] = [];

export const before = async (setup: Function) => {
  preTests.push({ setup });
};

export const beforeEach = async (setup: Function) => {
  preTests.push({ setup });
};

export const test = async (name: string, test: Function) => {
  tests.push({ name, test });
};

export default async function run(name: string) {
  console.log(name);
  const errors: { name: string; error: string }[] = [];
  for (let i = 0; i < preTests.length; i++) {
    try {
      await preTests[i].setup();
    } catch (error) {
      errors.push({ name: `beforeEach ${i}`, error });
    }
  }

  console.log("----------------------\n");

  for (let i = 0; i < tests.length; i++) {
    for (let y = 0; y < preTest.length; y++) {
      try {
        await preTest[y].setup();
      } catch (error) {
        errors.push({ name: `beforeEach for ${tests[i].name}`, error });
      }
    }

    try {
      const start = Date.now();
      await tests[i].test();
      const executionTime = Date.now() - start;
      const color = executionTime > 200 ? "\x1b[31m" : executionTime < 50 ? "\x1b[32m" : "\x1b[33m";

      console.log(
        "\x1b[0m",
        tests[i].name,
        "\x1b[32m",
        "✔",
        `${color}(${executionTime})${"\x1b[0m"}`
      );
    } catch (error) {
      errors.push({ name: tests[i].name, error });
    }
  }

  if (errors.length === 0) return;
  console.log("\x1b[0m\n----------------------\n");
  for (let i = 0; i < tests.length; i++) {
    console.log("\x1b[31m\x1b[1m", errors[i].name, "\x1b[0m");
    console.log(errors[i].error);
  }
}
