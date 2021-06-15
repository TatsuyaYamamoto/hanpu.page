/// <reference types='codeceptjs' />
type steps_file = typeof import("./steps_file");

// PageObjects
type topPage = typeof import("./pages/topPage");
type verifyPage = typeof import("./pages/verifyPage");

declare namespace CodeceptJS {
  interface SupportObject {
    I: I;
    current: any;
    // https://codecept.io/plugins/#autologin
    login: (user: string) => void;
    topPage;
    verifyPage;
  }
  interface Methods extends Playwright {}
  interface I extends ReturnType<steps_file> {}
  namespace Translation {
    interface Actions {}
  }
}
