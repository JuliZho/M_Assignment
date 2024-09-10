import { LoginFlow } from './login-flow';
import { NodeFlow } from './node-flow';
import { IMainMenu } from '../interfaces/interface-main-menu';

export class SystemFlow {
  private loginFlow: LoginFlow;
  private nodeFlow: NodeFlow;
  private mainMenu: IMainMenu;

  constructor(loginFlow: LoginFlow, nodeFlow: NodeFlow, mainMenu: IMainMenu) {
    this.loginFlow = loginFlow;
    this.nodeFlow = nodeFlow;
    this.mainMenu = mainMenu;
  }
  
    /**
   * Performs the complete login and node creation flow.
   * @param {string} protocol - Protocol.
   * @param {string} network - Network.
   * @param {string} email - Email.
   * @param {string} password - Password.
   * @returns {Promise<{ site1: string; site2: string }>} - Returns the URLs of site 1 and site 2.
   * @throws {Error} - Throws an error if login or node creation fails.
   */
  async loginAndCreateNode(
    protocol: string,
    network: string,
    email: string,
    password: string,
  ): Promise<{ site1: string; site2: string }> {
    await this.loginFlow.performLogin(email, password);
    await this.mainMenu.goToNodes();
    await this.nodeFlow.createNode(protocol, network);
    const nodeUrls = await this.nodeFlow.copyNodeUrls(protocol);
    return nodeUrls;
  }

  /**
   * Cleans up the session with deleting the node, clearing cookies, and closing the browser page.
   * @param {string} protocol - Protocol.
   * @param {string} network - Network.
   * @param {any} page - Page.
   * @param {boolean} [shouldDeleteNode=true] - Provides an option whether to delete the node before cleanup.
   * @returns {Promise<void>} - Does not return any value.
   * @throws {Error} - Throws an error if cleanup fails.
   */
  public async cleanupNodeAndSession(
    protocol: string,
    network: string,
    page: any,
    shouldDeleteNode: boolean = true,
  ): Promise<void> {
    if (shouldDeleteNode) {
      await this.nodeFlow.deleteNode(protocol);
    }
    await page.context().clearCookies();
    await page.close();
  }
}
