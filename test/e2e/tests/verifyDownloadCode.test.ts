Feature(`ダウンロードコード検証`).tag(`verifyDownloadCode`);

const TEST_DOWNLOAD_CODE = "GFSTKZRR";
const TEST_PRODUCT_NAME = "e2e test content";

Scenario(`topPageからverifyPageへ遷移する`, ({ I, topPage, verifyPage }) => {
  I.say("Given I am in topPage");
  topPage.goto();

  I.say("When I click button");
  I.click("ダウンロードページへ");

  I.say("Then I am in verifyPage");
  verifyPage.isDisplayed();
  I.see("ダウンロードコードを入力してください");

  I.say("And '実行ボタン' in disabled");
  I.seeElement("button[type=button]:disabled/*[text()='実行']");
});

Scenario(
  "DownloadCodeを入力してプロダクトを表示する",
  async ({ I, verifyPage }) => {
    I.say("Given I am in verifyPage");
    verifyPage.goto();

    I.say("When I insert download code and click button");
    I.seeElement("button[type=button]:disabled/*[text()='実行']");
    I.fillField("input[type=text]", TEST_DOWNLOAD_CODE);
    I.click("実行");

    I.say("Then I am on DownloadProductListPage and the product is displayed");
    I.seeCurrentUrlEquals(`/download/list`);
    I.see(TEST_PRODUCT_NAME, "button");
  }
);

Scenario(
  "不正なダウンロードコードを入力してエラーダイアログを表示する",
  async ({ I, verifyPage }) => {
    I.say("Given I am in verifyPage");
    verifyPage.goto();

    I.say("When 不正なダウンロードコードを入力する");
    I.fillField("input[type=text]", "dummy");
    I.click("実行");

    I.say("Then エラーダイアログが表示される");
    const verifyErrorMessage =
      "ダウンロードコードが不正です。入力した文字に間違いがないか確認してください。";
    I.see(verifyErrorMessage);
    I.click("OK");
    I.dontSee(verifyErrorMessage);
  }
);

Data([
  {
    desc: "trailing slash",
    // see createPptx.sh
    url: `/d/?c=any-text`
  },
  {
    desc: "non trailing slash",
    url: `/d?c=nandamoiiyoooooooooooo`
  }
]).Scenario(
  `QRCodeに印字された Short URL から verifyPageに侵入する`,
  async ({ I, current }) => {
    const testDownloadCode = current.url.split("=")[1];

    I.say(`Given nothing`);

    I.say(`When ShortURL (${current.url}) でアクセスする`);
    I.amOnPage(current.url);

    I.say(`Then formにdownload code (${testDownloadCode}) が入力されている`);
    I.seeInField("input", testDownloadCode);
  }
);

Scenario.skip(
  `verify済みのProductのdownload codeを入力してリストを表示する`,
  async ({ I }) => {}
);

Scenario.skip(
  `verify済みのユーザーが別のProductのdownload codeを入力してリストを表示する`,
  async ({ I }) => {}
);
