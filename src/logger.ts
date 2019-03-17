/**
 * console.log
 *
 * @param message
 * @param optionalParams
 * @deprecated
 */
function log(message?: any, ...optionalParams: any[]): void {
  // tslint:disable:no-console
  console.log(message, ...optionalParams);
}

/**
 * console.log
 *
 * @param message
 * @param optionalParams
 */
function debug(message?: any, ...optionalParams: any[]): void {
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

/**
 * console.error
 *
 * @param message
 * @param optionalParams
 */
function error(message?: any, ...optionalParams: any[]): void {
  // tslint:disable:no-console
  console.error(message, ...optionalParams);
}

export { debug, log, info, error };
