import { Page, Locator } from '@playwright/test';
import { IMainMenu } from '../interfaces/interface-main-menu';
import { LOGIN_URL, DEFAULT_TIMEOUT } from '../config';
import {
  clickWithTimeout,
  fillWithTimeout,
  handleError,
  waitForInvisibility,
  checkVisibilityAndEnabled,
} from '../utils/ui-utils';
import {
  LoginError,
  MenuError,
  NodeError,
  ErrorType,
} from '../utils/ui-errors';

const HOME_BUTTON_SELECTOR = 'button[title="Home"]';
const NODES_BUTTON_SELECTOR = 'button[title="Nodes"]';
const NODES_PAGE_TITLE_SELECTOR = 'text=Nodes';

export class MainMenu implements IMainMenu {
  private page: Page;
  private homeButtonLocator: Locator;
  private nodesButtonLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeButtonLocator = this.page.locator(HOME_BUTTON_SELECTOR);
    this.nodesButtonLocator = this.page.locator(NODES_BUTTON_SELECTOR);
  }

  /**
   * Returns the locator for the Home button.
   * @returns {Locator} - The locator for the Home button.
   */
  public getHomeButtonLocator(): Locator {
    return this.homeButtonLocator;
  }

  /**
   * Navigates to the Home page by clicking the Home button.
   * @returns {Promise<void>} - Does not return any value.
   * @throws {Error} - Throws an error if the navigation to the Home page fails.
   */
  async goToHome(): Promise<void> {
    try {
      await checkVisibilityAndEnabled(
        this.homeButtonLocator,
        true,
        DEFAULT_TIMEOUT,
        ErrorType.MENU,
      );
      await clickWithTimeout(
        this.homeButtonLocator,
        DEFAULT_TIMEOUT,
        ErrorType.MENU,
      );
    } catch (error) {
      handleError(
        error,
        'Unknown error during navigation to home',
        ErrorType.MENU,
      );
    }
  }

  /**
   * Navigates to the Nodes page by clicking the Nodes button.
   * @returns {Promise<void>} - Does not return any value.
   * @throws {Error} - Throws an error if the navigation to the Nodes page fails.
   */
  async goToNodes(): Promise<void> {
    try {
      await checkVisibilityAndEnabled(
        this.nodesButtonLocator,
        true,
        DEFAULT_TIMEOUT,
        ErrorType.MENU,
      );
      await clickWithTimeout(
        this.nodesButtonLocator,
        DEFAULT_TIMEOUT,
        ErrorType.MENU,
      );
    } catch (error) {
      handleError(
        error,
        'Unknown error during navigation to node',
        ErrorType.MENU,
      );
    }
  }
}
