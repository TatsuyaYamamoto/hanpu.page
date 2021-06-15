const { I } = inject();

export = {
  goto: () => {
    I.amOnPage("/download/verify");
  },
  isDisplayed: () => {
    I.seeCurrentUrlEquals("/download/verify");
  }
};
