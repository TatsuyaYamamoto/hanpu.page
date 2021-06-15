import assert from "assert";

const { I } = inject();

export = {
  goto: () => {
    I.amOnPage("/");
  },
  isDisplayed: async () => {
    I.seeInTitle("DEVELOPMENT DLCode");
    I.see("DLCode");

    const version = await this.grabTextFrom("h6");
    const trimmedVersion = version.trim();
    assert.match(trimmedVersion, /^v[0-9]\.[0-9]\.[0-9]\.[0-9a-z]{7}$/); // ${semanticVersion}.${gitRevShort}
    I.see(trimmedVersion); // grabTextFromのあとだと、なぜかconsole.logがnestされない
  }
};
