// in this file you can append custom step methods to 'I' object

// https://gist.github.com/richardhendricksen/37b11d97c356f2c1827a31d976dbc343
export = function() {
  return actor({
    // https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
    isOnIOS: function(): Promise<boolean> {
      return this.executeScript(
        () =>
          "iPad Simulator,iPhone Simulator,iPod Simulator,iPad,iPhone,iPod"
            .split(",")
            .includes(navigator.platform) ||
          (navigator.userAgent.includes("Mac") && "ontouchend" in document)
      );
    }
  });
};
