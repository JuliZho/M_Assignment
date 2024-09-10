/**
 * Custom error class for handling RPC errors.
 * @param {string} message - The error message that describes the RPC error.
 * @throws {RPCError} - Throws an RPCError with the given message.
*/
export class RPCError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RPCError';
  }
}

/**
 * Custom error class for handling WalletAPIError errors.
 * @param {string} message - The error message that describes the WalletAPIError error.
 * @throws {WalletAPIError} - Throws an WalletAPIError with the given message.
*/
export class WalletAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WalletAPIError';
  }
}

/**
 * Custom error class for handling UserAPIError errors.
 * @param {string} message - The error message that describes the UserAPIError error.
 * @throws {UserAPIError} - Throws an UserAPIError with the given message.
*/
export class UserAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserAPIError';
  }
}

/**
 * Custom error class for handling GenericAPIError errors.
 * @param {string} message - The error message that describes the GenericAPIError error.
 * @throws {GenericAPIError} - Throws an GenericAPIError with the given message.
*/
export class GenericAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GenericAPIError';
  }
}

/**
 * Enumeration for various error types: RPCError, WalletAPIError, UserAPIError, GenericAPIError.
 */
export enum ErrorType {
  RPC = 'RPC',
  WALLET_API = 'WALLET_API',
  USER_API = 'USER_API',
  GENERIC_API = 'GENERIC_API',
}
