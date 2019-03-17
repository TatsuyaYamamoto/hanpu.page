import OmakeError from "../OmakeError";

describe("OmakeError class", () => {
  const testMessage = "test-message-desu";
  const e = new OmakeError("invalid-activation-code", testMessage);

  it("should have name", () => {
    expect(e.name).toBe("OmakeError");
  });

  it("should have message", () => {
    expect(e.message).toBe(testMessage);
  });

  it("should be catchable", () => {
    try {
      throw e;
    } catch (e) {
      if (e instanceof OmakeError) {
        expect(e.message).toBe(testMessage);
      } else {
        fail();
      }
    }
  });
});
