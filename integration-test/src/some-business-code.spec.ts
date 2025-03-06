import { SomeBusinessCode } from "./some-business-code";

test("it should start tests automatcly when saving this file or the file under test ; not the untested-code file", () => {
  expect(new SomeBusinessCode().lengthOfAString("str")).toBe(4);
});
