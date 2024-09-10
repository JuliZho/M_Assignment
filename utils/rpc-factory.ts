import axios from 'axios';

interface RpcResponse<T> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: { code: number; message: string };
}

class RpcFactory {

  /**
   * Creates and sends an RPC request to the specified node URL.
   * @template T - The expected type of the result field in the response.
   * @param {string} method - The RPC method to call.
   * @param {any[]} [params=[]] - The parameters for the RPC method.
   * @param {number} [id=1] - The unique identifier for the request.
   * @param {string} nodeUrl - The URL of the node to which the request is sent.
   * @returns {Promise<RpcResponse<T>>} - Returns the RPC response.
   * @throws {Error} - Throws an error if the RPC request fails or if the response contains an error.
   */
  static async createRequest<T>(
    method: string,
    params: any[] = [],
    id: number = 1,
    nodeUrl: string,
  ): Promise<RpcResponse<T>> {
    const requestBody = {
      jsonrpc: '2.0',
      method,
      params,
      id,
    };
    try {
      const response = await axios.post(nodeUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.error) {
        throw new Error(`RPC Error: ${response.data.error.message}`);
      }
      return response.data;
    } catch (error: any) {
      console.error(`Error calling ${method}:`, error.message);
      throw error;
    }
  }

  /**
   * Calls an RPC method and returns the result.
   * @template T - The expected type of the result.
   * @param {string} nodeUrl - The URL of the node to call.
   * @param {string} method - The RPC method to call.
   * @param {any[]} [params=[]] - The parameters for the RPC method.
   * @returns {Promise<T>} - Returns the result of the RPC call.
   * @throws {Error} - Throws an error if the RPC request call fails.
   */
  static async callRpcMethod<T>(
    nodeUrl: string,
    method: string,
    params: any[] = [],
  ): Promise<T> {
    const response = await this.createRequest<T>(method, params, 1, nodeUrl);
    return response.result as T;
  }
}

export default RpcFactory;
