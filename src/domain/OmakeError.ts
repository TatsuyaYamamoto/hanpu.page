type ErrorCode = "invalid-activation-code";

/**
 * @link https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
class OmakeError extends Error {
  public readonly name: string;

  constructor(readonly errorCode: ErrorCode, m?: string) {
    super(
      ((code, message) =>
        JSON.stringify({
          code,
          message
        }))(errorCode, m)
    );
    this.name = new.target.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OmakeError);
    }
  }
}

export default OmakeError;
