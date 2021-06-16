const { I } = inject();
const url = "/download/list";

export = {
  goto: () => {
    I.amOnPage(url);
  },
  isDisplayed: () => {
    I.seeCurrentUrlEquals(url);
  }
};
