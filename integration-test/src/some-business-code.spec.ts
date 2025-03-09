import { SomeBusinessCode } from "./some-business-code";

test("it should InfiniTest!", () => {
  const service = new SomeBusinessCode();
  expect(service.lengthOfAString("ABC")).toBe(3);
});
