import { AxiosError } from "axios";

/**
 * Checks if an error is an Axios error
 *
 * @param error Error to check
 *
 * @return AxiosError type predicate
 */
const isAxiosError = (error: Error): error is AxiosError =>
  (error as AxiosError).isAxiosError !== undefined;

/**
 * Logs an axios error
 *
 * @param error Axios error to log
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
