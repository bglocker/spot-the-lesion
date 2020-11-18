/**
 * Logs an uncaught error in a function
 *
 * @param fnName Function name where error occurred
 * @param error  Uncaught error to log
 */
const logUncaughtError = (fnName: string, error: Error): void =>
  console.error(`Uncaught error in ${fnName}\n ${error.message}`);

export default logUncaughtError;
