import { Locator, Page, BrowserContext } from '@playwright/test';
import { DEFAULT_TIMEOUT, VERCEL_SECURITY_CHECKPOINT_URL } from '../config';
import { LoginError, MenuError, NodeError, ErrorType } from './ui-errors'; 

/**
 * Clicks on an element within a specified timeout.
 * @param {Locator} locator - Locator.
 * @param {number} [timeout=DEFAULT_TIMEOUT] - Timeout.
 * @param {ErrorType} errorType - The type of error to throw if the click action fails.
 * @returns {Promise<void>} - Does not return any value.
 * @throws {Error} - Throws an error if the click action fails or times out.
 */
export async function clickWithTimeout(
  locator: Locator,
  timeout: number = DEFAULT_TIMEOUT,
  errorType: ErrorType,
): Promise<void> {
  try {
    await locator.click({ timeout });
  } catch (error) {
    handleError(error, 'Failed to click the element', errorType);
  }
}

/**
 * Fills an input field within a specified timeout.
 * @param {Locator} locator - Locator.
 * @param {string} value - Value.
 * @param {number} [timeout=DEFAULT_TIMEOUT] - Timeout.
 * @param {ErrorType} errorType - The type of error to throw if the fill action fails.
 * @returns {Promise<void>} - Does not return any value.
 * @throws {Error} - Throws an error if the fill action fails.
 */
export async function fillWithTimeout(
  locator: Locator,
  value: string,
  timeout: number = DEFAULT_TIMEOUT,
  errorType: ErrorType,
): Promise<void> {
  try {
    await locator.fill(value, { timeout });
  } catch (error) {
    handleError(error, `Failed to fill input with value: ${value}`, errorType);
  }
}

/**
 * Selects an option in a dropdown or select element within a specified timeout.
 * @param {Locator} locator - Locator.
 * @param {string} value - Value.
 * @param {number} [timeout=DEFAULT_TIMEOUT] - Timeout.
 * @param {ErrorType} errorType - The type of error to throw if the fill action fails.
 * @returns {Promise<void>} - Does not return any value.
 * @throws {Error} - Throws an error if the select action fails or times out.
 */
export async function selectWithTimeout(
  locator: Locator,
  value: string,
  timeout: number = DEFAULT_TIMEOUT,
  errorType: ErrorType,
): Promise<void> {
  try {
    await locator.selectOption(value, { timeout });
  } catch (error) {
    handleError(error, `Failed to select option: ${value}`, errorType);
  }
}

/**
 * Handles errors by logging the context message and throwing an appropriate error type.
 * @param {unknown} error - The error to handle.
 * @param {string} contextMessage - The error message.
 * @param {ErrorType} errorType - The type of error to throw (e.g., LOGIN, MENU, NODE).
 * @throws {LoginError|MenuError|NodeError|Error} - Throws a specific error based on the errorType provided.
 */
export function handleError(
  error: unknown,
  contextMessage: string,
  errorType: ErrorType,
): never {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error(`${contextMessage}: ${errorMessage}`);
  switch (errorType) {
    case ErrorType.LOGIN:
      throw new LoginError(errorMessage);
    case ErrorType.MENU:
      throw new MenuError(errorMessage);
    case ErrorType.NODE:
      throw new NodeError(errorMessage);
    default:
      throw new Error(errorMessage);
  }
}

/**
 * Waits for an element to become hidden within a specified timeout.
 * @param {Locator} locator - Locator.
 * @param {number} [timeout=DEFAULT_TIMEOUT] - Timeout.
 * @param {ErrorType} errorType - The type of error to throw if the fill action fails.
 * @returns {Promise<void>} - Does not return any value.
 * @throws {Error} - Throws an error if the wait for invisibility fails.
 */
export async function waitForInvisibility(
  locator: Locator,
  timeout: number = DEFAULT_TIMEOUT,
  errorType: ErrorType,
): Promise<void> {
  try {
    await locator.waitFor({ state: 'hidden', timeout });
  } catch (error) {
    handleError(
      error,
      `Failed to wait for the element to become hidden`,
      errorType,
    );
  }
}

/**
 * Checks if an element is visible and enabled, with an optional waiting mechanism.
 * @param {Locator} locator - Locator.
 * @param {boolean} waitFor - Whether to wait for the element to become visible before checking.
 * @param {number} [timeout=DEFAULT_TIMEOUT] - Timeout.
 * @param {ErrorType} errorType - The type of error to throw if the check fails.
 * @returns {Promise<boolean>} - Returns true if the element is both visible and enabled, otherwise false.
 * @throws {Error} - Throws an error if the check or wait for the element fails.
 */
export async function checkVisibilityAndEnabled(
  locator: Locator,
  waitFor: boolean,
  timeout: number = DEFAULT_TIMEOUT,
  errorType: ErrorType
): Promise<boolean> {
  try {
    if (waitFor) {
      await locator.waitFor({ state: 'visible', timeout });
    }
    const isVisible = await locator.isVisible();
    if (!isVisible) {
      console.log("Element is not visible.");
      return false;
    }
    const isEnabled = await locator.isEnabled();
    if (!isEnabled) {
      console.log("Element is visible but not enabled.");
      return false;
    }
    return isVisible && isEnabled; 
  } catch (error) {
    handleError(
      error,
      `Failed to check or wait for the element to become visible and enabled`,
      errorType
    );
    return false;
  }
}

/**
 * Closes a Vercel security checkpoint tab and returns focus to the original tab.
 * This function listens for new tabs which navigations to to the Vercel security checkpoint and closes them.
 * @param {BrowserContext} context - The browser context.
 * @param {Page} page - Page.
 * @returns {Promise<void>} - Does not return any value.
 */
export async function runTestWithTabHandling(
  context: BrowserContext,
  page: Page,
): Promise<void> {
  const originalPage = page;
  context.on('page', async (newPage) => {
    const newPageUrl = await newPage.url();
    if (newPageUrl.includes(VERCEL_SECURITY_CHECKPOINT_URL)) {
      await newPage.close();
      await originalPage.bringToFront();
    }
  });
  page.on('framenavigated', async () => {
    const currentUrl = page.url();
    if (currentUrl.includes(VERCEL_SECURITY_CHECKPOINT_URL)) {
      await originalPage.bringToFront();
    }
  });
}
