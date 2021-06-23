/// <reference types='codeceptjs' />
type steps_file = typeof import("./steps_file");

// PageObjects
type topPage = typeof import("./pages/topPage");
type verifyPage = typeof import("./pages/verifyPage");
type downloadProductListPage = typeof import("./pages/downloadProductListPage");

declare namespace CodeceptJS {
  interface SupportObject {
    I: I;
    current: any;
    // https://codecept.io/plugins/#autologin
    login: (user: string) => void;
    topPage;
    verifyPage;
    downloadProductListPage;
  }
  interface Methods extends Playwright, Appium, FileSystem {}
  interface I extends ReturnType<steps_file> {}
  namespace Translation {
    interface Actions {}
  }
}
