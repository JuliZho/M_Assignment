/**
 * Custom error class for handling LoginError errors.
 * @param {string} message - The error message that describes the LoginError error.
 * @throws {GenericAPIError} - Throws an LoginError with the given message.
*/
export class LoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LoginError';
  }
}

/**
 * Custom error class for handling MenuError errors.
 * @param {string} message - The error message that describes the MenuError error.
 * @throws {GenericAPIError} - Throws an MenuError with the given message.
*/
export class MenuError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MenuError';
  }
}

/**
 * Custom error class for handling NodeError errors.
 * @param {string} message - The error message that describes the NodeError error.
 * @throws {GenericAPIError} - Throws an NodeError with the given message.
*/
export class NodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NodeError';
  }
}

/**
 * Enumeration for various error types: LOGIN, MENU, NODE, API.
 */
export enum ErrorType {
  LOGIN = 'LOGIN',
  MENU = 'MENU',
  NODE = 'NODE',
}