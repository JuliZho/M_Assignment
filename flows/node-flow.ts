import { INodePage } from '../interfaces/interface-node-page';
import { ErrorType } from '../utils/ui-errors';

export class NodeFlow {
  private nodePage: INodePage;
  private nodeUrl: string | null = null;

  constructor(nodePage: INodePage) {
    this.nodePage = nodePage;
  }
 
  /**
   * Executes the flow to create a new node with the specified protocol and network.
   * @param {string} protocol - Protocol.
   * @param {string} network - Network.
   * @returns {Promise<void>} - Does not return any value.
   * @throws {Error} - Throws an error if the node creation process fails.
   */
  async createNode(protocol: string, network: string): Promise<void> {
    try {
      await this.nodePage.clickCreateNewNodeButton();
      await this.nodePage.selectProtocol(protocol);
      await this.nodePage.selectNetwork(network);
      await this.nodePage.waitForLoadingToComplete();
      await this.nodePage.clickFinalSubmitButton();
    } catch (error) {
      console.error('Error during node creation flow:', ErrorType.NODE);
      throw error;
    }
  }

  /**
   * Copies and returns the URLs of the created node(site 1 and site 2).
   * @param {string} protocol - Protocol.
   * @returns {Promise<{ site1: string; site2: string }>} - Returns the URLs of site 1 and site 2.
   * @throws {Error} - Throws an error if copying the node URLs fails.
   */
  async copyNodeUrls(
    protocol: string,
  ): Promise<{ site1: string; site2: string }> {
    try {
      if (this.nodeUrl) {
        return { site1: this.nodeUrl, site2: this.nodeUrl };
      }
      const isOpen = await this.nodePage.isAccordionOpen(protocol);
      if (!isOpen) {
        await this.nodePage.openAccordion(protocol);
      }
      await this.nodePage.verifyNodeLoaded(protocol);
      await this.nodePage.waitForLoadingToComplete();
      await this.nodePage.clickCopyButton(0);
      const site1Url = await this.nodePage.getCopiedUrl(0);
      await this.nodePage.clickCopyButton(1);
      const site2Url = await this.nodePage.getCopiedUrl(1);
      console.log(`Copied Site 2 URL: ${site2Url}`);
      this.nodeUrl = site1Url;
      return { site1: site1Url, site2: site2Url };
    } catch (error) {
      console.error('Error during copying node URLs:', ErrorType.NODE);
      throw error;
    }
  }

  /**
   * Deletes a node based on the provided protocol.
   * @param {string} protocol - Protocol.
   * @returns {Promise<void>} - Does not return any value.
   * @throws {Error} - Throws an error if the node deletion process fails.
   */
  async deleteNode(protocol: string): Promise<void> {
    try {
      await this.nodePage.openAccordion(protocol);
      await this.nodePage.clickDeleteNodeButton();
      await this.nodePage.confirmDeleteNodeOperationButton();
    } catch (error) {
      console.error('Error during deleting node:', ErrorType.NODE);
      throw error;
    }
  }

  /**
   * Deletes all detected nodes
   * @returns {Promise<void>} - Does not return any value.
   * @throws {Error} - Throws an error if the deletion process fails.
   */
  async ifNodesDetectedDeleteAllNodes(): Promise<void> {
    try {
      const nodesAvailable = await this.nodePage.anyNodeAvailable();
      if (!nodesAvailable) {
        console.log('No nodes detected. Skipping deletion.');
        return;
      }
      const accordions = this.nodePage.getGeneralAccordionButtonLocator();
      let accordionCount = await accordions.count();
      for (let i = accordionCount - 1; i >= 0; i--) {
        try {
          await this.nodePage.openAccordion(undefined, i); 
          await this.nodePage.clickDeleteNodeButton(undefined, i);
          await this.nodePage.confirmDeleteNodeOperationButton(undefined, i);
          console.log(`Successfully deleted node at index ${i}`);
        } catch (error) {
          console.error(`Error deleting node at accordion index ${i}:`, error);
        }
      }
      console.log(`Successfully deleted all nodes from all accordions`);
    } catch (error) {
      console.error('Error during deleting nodes:', error);
      throw error;
    }
  }
}
