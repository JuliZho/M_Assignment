import {
  RPCError,
  WalletAPIError,
  UserAPIError,
  GenericAPIError,
} from './api-errors'; 
import { DEFAULT_TIMEOUT } from '../config';

/**
 * Handles an error by logging a context message and throwing a specific type of error based on the errorType.
 * @param {unknown} error - The error object to be handled.
 * @param {string} contextMessage - Error message.
 * @param {string} errorType - The type of error to throw (e.g., 'RPC', 'WALLET_API', 'USER_API', 'GENERIC_API').
 * @throws {RPCError|WalletAPIError|UserAPIError|GenericAPIError} - Throws a specific error type based on the errorType provided.
 */
export function handleError(
  error: unknown,
  contextMessage: string,
  errorType: string,
): never {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error(`${contextMessage}: ${errorMessage}`);
  switch (errorType) {
    case 'RPC':
      throw new RPCError(errorMessage);
    case 'WALLET_API':
      throw new WalletAPIError(errorMessage);
    case 'USER_API':
      throw new UserAPIError(errorMessage);
    default:
      throw new GenericAPIError(errorMessage);
  }
}

/**
 * Executes an API request with a specified timeout and handles errors using a custom error type.
 * @param {() => Promise<T>} action - The API request.
 * @param {number} [timeout=DEFAULT_TIMEOUT] - Timeout.
 * @param {string} [errorMessage='Failed to execute API request'] - The custom error message to use if the API request fails.
 * @param {string} [errorType='GENERIC_API'] - The type of error to handle in case of failure.
 * @returns {Promise<T>} - The result of the API request.
 * @throws {Error} - Throws an error if the API request fails.
 */
export async function apiRequestWithTimeout<T>(
  action: () => Promise<T>,
  timeout: number = DEFAULT_TIMEOUT,
  errorMessage: string = 'Failed to execute API request',
  errorType: string = 'GENERIC_API',
): Promise<T> {
  try {
    const result = await Promise.race([
      action(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('API request timed out')), timeout),
      ),
    ]);
    return result;
  } catch (error: any) {
    handleError(error, errorMessage, errorType);
  }
}

/**
 * Validates the structure and content of an API response.
 * @param {any} response - The API response to validate.
 * @param {string} [errorMessage='Invalid API response'] - Error message if the validation fails.
 * @param {string} [errorType='GENERIC_API'] - The type of error in case of failure.
 * @throws {Error} - Throws an error if the response is invalid or contains errors.
 */
export function validateApiResponse(
  response: any,
  errorMessage: string = 'Invalid API response',
  errorType: string = 'GENERIC_API',
): void {
  if (!response) {
    handleError(
      new Error('Response is null or undefined'),
      errorMessage,
      errorType,
    );
  }
  if (response.error) {
    handleError(
      new Error(`RPC Error: ${response.error.message}`),
      errorMessage,
      errorType,
    );
  }
  if (response.number && response.hash) {
    if (!/^0x[a-fA-F0-9]+$/.test(response.number)) {
      handleError(
        new Error('Invalid block number format'),
        errorMessage,
        errorType,
      );
    }
    if (!/^0x[a-fA-F0-9]{64}$/.test(response.hash)) {
      handleError(
        new Error('Invalid block hash format'),
        errorMessage,
        errorType,
      );
    }
  }
  if (response.transactionIndex && response.from && response.to) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(response.from)) {
      handleError(
        new Error('Invalid "from" address format'),
        errorMessage,
        errorType,
      );
    }
    if (response.to !== null && !/^0x[a-fA-F0-9]{40}$/.test(response.to)) {
      handleError(
        new Error('Invalid "to" address format'),
        errorMessage,
        errorType,
      );
    }
    if (!/^0x[a-fA-F0-9]+$/.test(response.transactionIndex)) {
      handleError(
        new Error('Invalid transaction index format'),
        errorMessage,
        errorType,
      );
    }
  }
  if (!response.number && !response.hash && !response.transactionIndex) {
    handleError(
      new Error('Block or transaction response are invalid'),
      errorMessage,
      errorType,
    );
  }
}

/**
 * Retries an API request a specified number of times before throwing an error.
 * @param {() => Promise<T>} action - The API request.
 * @param {number} [retries=1] - The number of times to retry the API request before failing.
 * @param {string} [errorMessage='Failed to execute API request after retries'] - The custom error message to use if the retries fail.
 * @param {string} [errorType='GENERIC_API'] - The type of error to handle in case of failure.
 * @returns {Promise<T>} - The result of the API request.
 * @throws {Error} - Throws an error if the API request fails after all retries.
 */
export async function retryApiRequest<T>(
  action: () => Promise<T>,
  retries: number = 3,
  errorMessage: string = 'Failed to execute API request after retries',
  errorType: string = 'GENERIC_API',
): Promise<T> {
  let attempts = 0;
  while (attempts < retries) {
    try {
      return await action();
    } catch (error: any) {
      attempts++;
      if (attempts >= retries) {
        handleError(error, errorMessage, errorType);
      }
    }
  }
  handleError(new Error('All retries failed'), errorMessage, errorType);
}
