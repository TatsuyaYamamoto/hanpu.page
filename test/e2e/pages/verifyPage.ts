const { I } = inject();

export = {
  goto: () => {
    I.amOnPage("/download/verify");
  },
  isDisplayed: () => {
    I.seeCurrentUrlEquals("/download/verify");
  },
  verify: (downloadCode: string) => {
    I.fillField("input[type=text]", downloadCode);
    I.click("実行");
  }
};
