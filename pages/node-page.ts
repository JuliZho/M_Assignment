import { Page, Locator } from '@playwright/test';
import { INodePage } from '../interfaces/interface-node-page';
import { DEFAULT_TIMEOUT } from '../config';
import {
  clickWithTimeout,
  selectWithTimeout,
  waitForInvisibility,
  checkVisibilityAndEnabled,
  handleError,
} from '../utils/ui-utils';
import { NodeError, ErrorType } from '../utils/ui-errors';

export const protocolNetworkMap: Record<string, string[]> = {
  Ethereum: ['Mainnet', 'Sepolia', 'Holesky'],
  Base: ['Mainnet', 'Sepolia'],
  Binance: ['Mainnet'],
  Arbitrum: ['Mainnet', 'Sepolia'],
  Optimism: ['Mainnet', 'Sepolia'],
  Moonbeam: ['Mainnet'],
  Blast: ['Mainnet', 'Sepolia'],
  Mantle: ['Mainnet', 'Sepolia'],
  zkSync: ['Mainnet', 'Sepolia'],
  Fantom: ['Mainnet'],
  OpBNB: ['Mainnet'],
  Polygon: ['Mainnet'],
  Gnosis: ['Mainnet'],

  /**
   * Unable to fetch the transaction hash, functional tests fail, the reason for this issue was not investigated.
   * 
   * Polygon: ['Amoy'],
   * Avalanche: ['Mainnet'],
   * Binance: ['Testnet'],
   * Gnosis: [''Testnet'],
   * 'Polygon zkEVM': ['Mainnet', 'Cardona'],
   * Moonbeam: ['Moonriver', 'Moonbase]',
   * Zetachain: ['Mainnet', 'Testnet'],
   */
};

export class NodePage implements INodePage {
  private page: Page;
  private createNewNodeButtonLocator: Locator;
  private protocolDropdownLocator: Locator;
  private networkDropdownLocator: Locator;
  private finalSubmitButtonLocator: Locator;
  private copyButtonLocator: Locator;
  private urlInputFieldLocator: Locator;
  private loadingSpinnerLocator: Locator;
  private deleteNodeButtonLocator: Locator;
  private confirmDeleteNodeOperationButtonLocator: Locator;
  private deleteModalLocator: Locator;

  private generalAccordionButtonLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createNewNodeButtonLocator = this.page.locator(
      'button[data-testid="mui-button-primary"]',
    );
    this.protocolDropdownLocator = this.page.locator(
      'select[data-testid="test-CardCountrySelect"]',
    );
    this.networkDropdownLocator = this.page.locator(
      'select[data-testid="mui-select"]',
    );
    this.finalSubmitButtonLocator = this.page.locator(
      'div[data-testid="mui-modal"] button[data-testid="mui-button-primary"]:has-text("Create Node")',
    );
    this.copyButtonLocator = this.page.locator(
      'button[data-testid="mui-button"]',
    );
    this.urlInputFieldLocator = this.page.locator(
      'input[data-testid="mui-input"][readonly]',
    );
    this.loadingSpinnerLocator = this.page.locator('div.loading-spinner');
    this.deleteNodeButtonLocator = this.page.locator(
      'button[data-testid="mui-button-outline"] svg[data-icon="trash"]',
    );
    this.confirmDeleteNodeOperationButtonLocator = this.page.locator(
      'button[data-testid="mui-button-destructive"]',
    );
    this.deleteModalLocator = this.page.locator('div.mui-modal');
    this.generalAccordionButtonLocator = this.page.locator(
      'button[aria-controls="control-string"][data-style="accordion-button"]',
    );
  }

  /**
   * Returns the locator for the general accordion button.
   * @returns {Locator} - The locator for the general accordion button.
   */
  public getGeneralAccordionButtonLocator(): Locator {
    return this.generalAccordionButtonLocator;
  }

  /**
   * Opens an accordion based on the provided protocol or index.
   * @param {string} [protocol] - Protocol.
   * @param {number} [index] - Index.
   * @returns {Promise<void>} - Does not return any value.
   * @throws {Error} - Throws an error if the accordion fails to open.
   */
  async openAccordion(protocol?: string, index?: number): Promise<void> {
    try {
      let accordionButton;
      if (protocol) {
        accordionButton = this.page
          .locator(
            `button[aria-controls="control-string"] span._title_1xepc_427:has-text("${protocol}")`,
          )
          .first();
      }
      else if (index !== undefined) {
        accordionButton = this.generalAccordionButtonLocator.nth(index);
      }
      else {
        accordionButton = this.generalAccordionButtonLocator.first();
      }
      const isExpanded = await accordionButton.evaluate(
        (button) => button.getAttribute('aria-expanded') === 'true',
      );
      if (!isExpanded) {
        await accordionButton.scrollIntoViewIfNeeded();
        await accordionButton.click();
      }
    } catch (error) {
      handleError(
        error,
        protocol
          ? `Error opening accordion for ${protocol}`
          : index !== undefined
          ? `Error opening accordion at index ${index}`
          : 'Error opening the general accordion',
        ErrorType.NODE,
      );
    }
  }

  /**
   * Checks if an accordion for the given protocol is already open.
   * @param {string} protocol - Protocol.
   * @returns {Promise<boolean>} - Returns true if the accordion is open, otherwise false.
   * @throws {Error} - Throws an error if checking the accordion state fails.
   */
  async isAccordionOpen(protocol: string): Promise<boolean> {
    try {
      const accordionButton = this.page
        .locator(
          `button[aria-controls="control-string"] span._title_1xepc_427:has-text("${protocol}")`,
        )
        .first();
      const isExpanded = await accordionButton.evaluate(
        (button) => button.getAttribute('aria-expanded') === 'true',
      );
      return isExpanded;
    } catch (error) {
      handleError(
        error,
        `Error checking accordion state for ${protocol}`,
        ErrorType.NODE,
      );
      return false;
    }
  }

  /**
   * Clicks the delete node button for the given protocol or index.
   * @param {string} [protocol] - Protocol.
   * @param {number} [index] - Index.
   * @returns {Promise<void>} - Does not return any value.
   * @throws {Error} - Throws an error if clicking the delete button fails.
   */
  async clickDeleteNodeButton(
    protocol?: string,
    index?: number,
  ): Promise<void> {
    try {
      let deleteButtonLocator;
      if (protocol) {
        deleteButtonLocator = this.deleteNodeButtonLocator;
      }
      else if (index !== undefined) {
        deleteButtonLocator = this.deleteNodeButtonLocator.nth(index);
      }
      else {
        deleteButtonLocator = this.deleteNodeButtonLocator;
      }
      await checkVisibilityAndEnabled(
        deleteButtonLocator,
        true,
        DEFAULT_TIMEOUT,
        ErrorType.NODE,
      );
      await deleteButtonLocator.click();
    } catch (error) {
      handleError(
        error,
        protocol
          ? `Error clicking Delete Node button for ${protocol}`
          : index !== undefined
          ? `Error clicking Delete Node button at index ${index}`
          : 'Error clicking general Delete Node button',
        ErrorType.NODE,
      );
    }
  }

  /**
   * Confirms the deletion of a node.
   * @param {string} [protocol] - Protocol.
   * @param {number} [index] - Index.
   * @returns {Promise<void>} - Does not return any value.
   * @throws {Error} - Throws an error if the confirmation fails.
   */
  async confirmDeleteNodeOperationButton(
    protocol?: string,
    index?: number,
  ): Promise<void> {
    try {
      let confirmDeleteButtonLocator;
      if (protocol) {
        confirmDeleteButtonLocator = this.page
          .locator(
            `button[aria-controls="control-string"] span._title_1xepc_427:has-text("${protocol}")`,
          )
          .locator('button[data-testid="mui-button-destructive"]');
      }
      else if (index !== undefined) {
        confirmDeleteButtonLocator =
          this.confirmDeleteNodeOperationButtonLocator.nth(index);
      }
      else {
        confirmDeleteButtonLocator =
          this.confirmDeleteNodeOperationButtonLocator;
      }
      await checkVisibilityAndEnabled(
        this.deleteModalLocator,
        true,
        DEFAULT_TIMEOUT,
        ErrorType.NODE,
      );
      await checkVisibilityAndEnabled(
        confirmDeleteButtonLocator,
        true,
        DEFAULT_TIMEOUT,
        ErrorType.NODE,
      );
      await clickWithTimeout(
        confirmDeleteButtonLocator,
        DEFAULT_TIMEOUT,
        ErrorType.NODE,
      );
      await waitForInvisibility(
        this.deleteModalLocator,
        DEFAULT_TIMEOUT,
        ErrorType.NODE,
      );
    } catch (error) {
      handleError(
        error,
        protocol
          ? `Error clicking Confirm Delete Node button for ${protocol}`
          : index !== undefined
          ? `Error clicking Confirm Delete Node button at index ${index}`
          : 'Error clicking general Confirm Delete Node button',
        ErrorType.NODE,
      );
    }
  }

  /**
   * Clicks the "Create New Node" button.
   * @returns {Promise<void>} - Does not return any value.
   * @throws {Error} - Throws an error if clicking the "Create New Node" button fails.
   */
  async clickCreateNewNodeButton(): Promise<void> {
    try {
      await checkVisibilityAndEnabled(
        this.createNewNodeButtonLocator,
        true,
        DEFAULT_TIMEOUT,
        ErrorType.NODE,
      );
      await clickWithTimeout(
        this.createNewNodeButtonLocator,
        DEFAULT_TIMEOUT,
        ErrorType.NODE,
      );
    } catch (error) {
      handleError(
        error,
        'Error clicking Create New Node button',
        ErrorType.NODE,
      );
    }
  }

  /**
   * Selects a protocol from the dropdown.
   * @param {string} protocol - Protocol.
   * @returns {Promise<void>} - Does not return any value.
   * @throws {Error} - Throws an error if selecting the protocol fails.
   */
  async selectProtocol(protocol: string): Promise<void> {
    try {
      await checkVisibilityAndEnabled(
        this.protocolDropdownLocator,
        true,
        DEFAULT_TIMEOUT,
        ErrorType.NODE,
      );
      await selectWithTimeout(
        this.protocolDropdownLocator,
        protocol,
        DEFAULT_TIMEOUT,
        ErrorType.NODE,
      );
    } catch (error) {
      handleError(
        error,
        `Failed to select protocol: ${protocol}`,
        ErrorType.NODE,
      );
    }
  }

  /**
   * Selects a network from the dropdown.
   * @param {string} network - Network.
   * @returns {Promise<void>} - Does not return any value.
   * @throws {Error} - Throws an error if selecting the network fails.
   */
  async selectNetwork(network: string): Promise<void> {
    try {
      await checkVisibilityAndEnabled(
        this.networkDropdownLocator,
        true,
        DEFAULT_TIMEOUT,
        ErrorType.NODE,
      );
      await selectWithTimeout(
        this.networkDropdownLocator,
        network,
        DEFAULT_TIMEOUT,
        ErrorType.NODE,
      );
    } catch (error) {
      handleError(
        error,
        `Failed to select network: ${network}`,
        ErrorType.NODE,
      );
    }
  }

  /**
   * Clicks the final submit button to create a node.
   * @returns {Promise<void>} - Does not return any value.
   * @throws {Error} - Throws an error if clicking the final submit button fails.
   */
  async clickFinalSubmitButton(): Promise<void> {
    try {
      await checkVisibilityAndEnabled(
        this.finalSubmitButtonLocator,
        true,
        DEFAULT_TIMEOUT,
        ErrorType.NODE,
      );
      await clickWithTimeout(
        this.finalSubmitButtonLocator,
        DEFAULT_TIMEOUT,
        ErrorType.NODE,
      );
    } catch (error) {
      handleError(error, `Failed to click the button`, ErrorType.NODE);
    }
  }

  /**
   * Waits for loading to complete by ensuring the loading spinner is hidden.
   * @returns {Promise<void>} - Does not return any value.
   */
  async waitForLoadingToComplete(): Promise<void> {
    await this.loadingSpinnerLocator.waitFor({
      state: 'hidden',
      timeout: 10000,
    });
  }

  /**
   * Verifies that the node for the specified protocol has loaded.
   * @param {string} protocol - Protocol.
   * @returns {Promise<void>} - Does not return any value.
   * @throws {Error} - Throws an error if the node is not found or does not match the protocol.
   */
  async verifyNodeLoaded(protocol: string): Promise<void> {
    const nodeTitle = this.page.locator(
      `button[aria-controls="control-string"] span#control-string:has-text("${protocol}")`,
    );
    await checkVisibilityAndEnabled(
      nodeTitle,
      true,
      DEFAULT_TIMEOUT,
      ErrorType.NODE,
    );
    const nodeTitleText = await nodeTitle.textContent();
    if (nodeTitleText !== protocol) {
      throw new Error(
        `Node with protocol ${protocol} not found. Actual text: ${nodeTitleText}`,
      );
    }
  }

  /**
   * Clicks the copy button for the specified index.
   * @param {number} index - Index.
   * @returns {Promise<void>} - Does not return any value.
   */
  async clickCopyButton(index: number): Promise<void> {
    await checkVisibilityAndEnabled(
      this.copyButtonLocator.nth(index),
      true,
      DEFAULT_TIMEOUT,
      ErrorType.NODE,
    );
    await this.copyButtonLocator.nth(index).click();
  }

  /**
   * Gets the copied URL from the input field for the specified index.
   * @param {number} index - Index.
   * @returns {Promise<string>} - The copied URL.
   */
  async getCopiedUrl(index: number): Promise<string> {
    const copiedUrl = await this.urlInputFieldLocator.nth(index).inputValue();
    return copiedUrl;
  }

  /**
   * Copies the node URLs by clicking the copy buttons and returning the copied URLs.
   * @returns {Promise<{ site1: string; site2: string }>} - The copied URLs.
   */
  async copyNodeUrls(): Promise<{ site1: string; site2: string }> {
    await this.clickCopyButton(0);
    const site1Url = await this.getCopiedUrl(0);
    await this.clickCopyButton(1);
    const site2Url = await this.getCopiedUrl(1);
    return { site1: site1Url, site2: site2Url };
  }

  /**
   * Checks if any node accordion is available (visible and enabled).
   * @returns {Promise<boolean>} - Returns true if a node is available, otherwise false.
   * @throws {Error} - Throws an error if checking node availability fails.
   */
  async anyNodeAvailable(): Promise<boolean> {
    try {
      const accordions = this.generalAccordionButtonLocator;
      const accordionCount = await accordions.count();
      console.log(`Number of accordions found: ${accordionCount}`);
      if (accordionCount === 0) {
        return false;
      }
      for (let i = 0; i < accordionCount; i++) {
        const accordion = accordions.nth(i);
        const isAccordionVisibleAndEnabled = await checkVisibilityAndEnabled(
          accordion,
          false, 
          DEFAULT_TIMEOUT,
          ErrorType.NODE,
        );
        if (isAccordionVisibleAndEnabled) {
          return true;
        }
      }
      return false;
    } catch (error) {
      handleError(
        error,
        `Error checking if accordion sections are available`,
        ErrorType.NODE,
      );
      return false;
    }
  }
}
