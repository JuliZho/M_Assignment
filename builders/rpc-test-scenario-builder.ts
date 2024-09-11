import { RpcAPIClient } from '../clients/rpc-api-client';

export class RpcTestScenarioBuilder {
  private apiClient: RpcAPIClient;
  private blockNumber: string | null = null;
  private blockDetails: any = null;
  private transactionHash: string | null = null;

  constructor(nodeUrl: string) {
    this.apiClient = new RpcAPIClient(nodeUrl);
  }

  /**
   * Fetches the latest block number from the blockchain node.
   * The method retrieves the current block number and stores it in the `blockNumber` property.
   * @returns {Promise<RpcTestScenarioBuilder>} - Returns the instance of the scenario builder.
   * @throws {Error} - Throws an error if unable to fetch the block number.
   */
  async fetchBlockNumber(): Promise<RpcTestScenarioBuilder> {
    this.blockNumber = await this.apiClient.fetchBlockNumber();
    console.log("Block Number fetched:", this.blockNumber);
    return this;
  }

  /**
   * Fetches the block details for the block number.
   * It stores the block details in the `blockDetails` property.
   * @returns {Promise<RpcTestScenarioBuilder>} - Returns the instance of the scenario builder.
   * @throws {Error} - Throws an error if block number is not available or block details cannot be fetched.
   */
  async fetchBlockDetails(): Promise<RpcTestScenarioBuilder> {
    if (!this.blockNumber) throw new Error('Block number is not available');
    this.blockDetails = await this.apiClient.fetchBlockDetails(
      this.blockNumber,
    );
    console.log("Block Details fetched:", this.blockDetails);
    return this;
  }

  /**
   * Fetches the transaction hash from the block details.
   * It will retry a specified number of times if transactions are not available initially.
   * @returns {Promise<RpcTestScenarioBuilder>} - Returns the instance of the scenario builder.
   * @throws {Error} - Throws an error if transactions are not available after the maximum number of retries.
   */
  async fetchTransactionHash(): Promise<RpcTestScenarioBuilder> {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000;
    let retries = 0;
    while (!this.blockDetails || !this.blockDetails.transactions.length) {
      if (retries >= MAX_RETRIES) {
        throw new Error(
          'Block details or transactions are not available after maximum retries',
        );
      }
      console.log(`Retrying to fetch block details (attempt ${retries + 1})`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      retries++;
    }
    this.transactionHash = await this.apiClient.fetchTransactionHash(
      this.blockDetails,
    );
    console.log("Transaction hash:", this.transactionHash);
    return this;
  }
  
  /**
   * Fetches the transaction details for the transaction hash.
   * @returns {Promise<any>} - Returns the details of the transaction.
   * @throws {Error} - Throws an error if the transaction hash is not available.
   */
async fetchTransactionDetails(): Promise<any> {
  if (!this.transactionHash) {
    throw new Error('Transaction hash is not available');
  }
  const transactionDetails = await this.apiClient.fetchTransactionDetails(this.transactionHash);
  console.log("Transaction details:", transactionDetails);
  return transactionDetails;
}
}
