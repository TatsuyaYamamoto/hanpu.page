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

export { log };
