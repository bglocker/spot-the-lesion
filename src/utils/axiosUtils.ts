import { AxiosError } from "axios";

/**
 * Checks if the given error is an AxiosError
 *
 * @param error Error to type check
 *
 * @return AxiosError type predicate
 */
const isAxiosError = (error: Error): error is AxiosError =>
  (error as AxiosError).isAxiosError !== undefined;

/**
 * Logs the given AxiosError
 *
 * @param error AxiosError to log
 */
const logAxiosError = (error: AxiosError): void => {
  if (error.response) {
    /* Received response error (4xx, 5xx) */
    console.error(
      `Axios response error\n status: ${error.response.status}\n headers: ${error.response.headers}\n data: ${error.response.data}`
    );
  } else if (error.request) {
    /* No response received */
    console.error(`Axios no response error\n request: ${error.request}`);
  } else {
    /* Request could not be created */
    console.error(`Axios unknown error\n message: ${error.message}`);
  }
};

export { isAxiosError, logAxiosError };
