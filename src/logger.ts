/**
 * console.log
 *
 * @param message
 * @param optionalParams
 */
function log(message?: any, ...optionalParams: any[]): void {
  // tslint:disable:no-console
  console.log(message, ...optionalParams);
}

/**
 * console.info
 *
 * @param message
 * @param optionalParams
 */
function info(message?: any, ...optionalParams: any[]): void {
  // tslint:disable:no-console
  console.info(message, ...optionalParams);
}

export { log, info };
