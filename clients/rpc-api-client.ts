import RpcFactory from '../utils/rpc-factory';
import {  DEFAULT_TIMEOUT } from '../config'; 
import {
  apiRequestWithTimeout,
  retryApiRequest,
  validateApiResponse,
} from '../utils/api-utils';
import { ErrorType } from '../utils/api-errors';

export class RpcAPIClient {
  private nodeUrl: string;

  constructor(nodeUrl: string) {
    this.nodeUrl = nodeUrl;
  }

  /**
   * Fetches the current block number from the node.
   * Retries the request if it fails.
   *
   * @returns {Promise<string>} - The current block number as a string.
   * @throws {Error} - Throws an error if unable to fetch the block number after retries.
   */
  async fetchBlockNumber(): Promise<string> {
    const blockNumber = await retryApiRequest(
      () =>
        apiRequestWithTimeout(
          () =>
            RpcFactory.callRpcMethod<string>(this.nodeUrl, 'eth_blockNumber'),
          DEFAULT_TIMEOUT,
          `Failed to fetch block number for - ${this.nodeUrl}`,
          ErrorType.RPC,
        ),
      2,
      `Failed to fetch block number after retries`,
      ErrorType.RPC,
    );
    validateApiResponse(
      { number: blockNumber },
      'Failed to validate block number response',
      ErrorType.RPC,
    );
    return blockNumber;
  }

  /**
   * Fetches block details for block number.
   * Retries the request if it fails.
   *
   * @param {string} blockNumber - The block number for which to fetch details.
   * @returns {Promise<any>} - The block details object.
   * @throws {Error} - Throws an error if unable to fetch block details after retries.
   */
  async fetchBlockDetails(blockNumber: string): Promise<any> {
    const blockDetails = await retryApiRequest(
      () =>
        apiRequestWithTimeout(
          () =>
            RpcFactory.callRpcMethod(this.nodeUrl, 'eth_getBlockByNumber', [
              blockNumber,
              false,
            ]),
            DEFAULT_TIMEOUT,
          `Failed to fetch block details for block number - ${blockNumber}`,
          ErrorType.RPC,
        ),
      2,
      `Failed to fetch block details for block number - ${blockNumber} after retries`,
      ErrorType.RPC,
    );
    validateApiResponse(
      blockDetails,
      'Failed to validate block details response',
      ErrorType.RPC,
    );

    return blockDetails;
  }

    /**
   * Fetches the first transaction hash.
   * Retries the request if it fails.
   *
   * @param {any} blockDetails - The block details object.
   * @returns {Promise<string>} - The first transaction hash.
   * @throws {Error} - Throws an error if unable to fetch block details or transaction.
   */
  async fetchTransactionHash(blockDetails: any): Promise<string> {
    if (
      !blockDetails ||
      !blockDetails.transactions ||
      blockDetails.transactions.length === 0
    ) {
      throw new Error('Block details or transactions are not available');
    }

    const transactionHash = await retryApiRequest(
      () =>
        apiRequestWithTimeout(
          async () => blockDetails.transactions[0], 
          DEFAULT_TIMEOUT, 
          'Failed to fetch transaction hash',
          ErrorType.RPC,
        ),
      2, 
      'Failed to fetch transaction hash after retries',
      ErrorType.RPC,
    );

    validateApiResponse(
      { hash: transactionHash },
      'Failed to validate transaction hash',
      ErrorType.RPC,
    );

    return transactionHash;
  }

  /**
   * Fetches the transaction details for a transaction hash.
   * Retries the request if it fails.
   *
   * @param {string} transactionHash - The hash of the transaction.
   * @returns {Promise<any>} - The transaction details object.
   * @throws {Error} - Throws an error if unable to fetch transaction details after retries.
   */
  async fetchTransactionDetails(transactionHash: string): Promise<any> {
    const transactionDetails = await retryApiRequest(
      () =>
        apiRequestWithTimeout(
          () =>
            RpcFactory.callRpcMethod(this.nodeUrl, 'eth_getTransactionByHash', [
              transactionHash,
            ]),
            DEFAULT_TIMEOUT,
          `Failed to fetch transaction details for transaction hash - ${transactionHash}`,
          ErrorType.RPC,
        ),
      2,
      `Failed to fetch transaction details for transaction hash after retries ${transactionHash}`,
      ErrorType.RPC,
    );
    validateApiResponse(
      transactionDetails,
      'Failed to validate transaction details response',
      ErrorType.RPC,
    );

    return transactionDetails;
  }
}
