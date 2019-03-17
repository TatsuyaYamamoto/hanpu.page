import { ActivationCode } from "../ActivationCode";

const BASE32_ENCODE_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".split("");

describe("ActivationCode#generateCode", () => {
  Array(10 /* times */)
    .fill(0)
    .forEach(() => {
      const code = ActivationCode.generateCode();

      it("should has 8 chars", () => {
        expect(code).toHaveLength(8);
      });
      it("should contain base32 char type", () => {
        code.split("").forEach(char => {
          expect(BASE32_ENCODE_CHAR).toContain(char);
        });
      });
    });
});
