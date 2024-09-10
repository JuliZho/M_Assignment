import { Page, Locator } from '@playwright/test';
import { ILoginPage } from '../interfaces/interface-login-page';
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

export class LoginPage implements ILoginPage {
  private page: Page;
  private emailInputLocator: Locator;
  private passwordInputLocator: Locator;
  private submitButtonLocator: Locator;
  private acceptCookiesButtonLocator: Locator;
  private captchaLocator: Locator;
  private homeLocator: Locator;
  private mainMenu: any;

  constructor(page: Page, mainMenu: any) {
    this.mainMenu = mainMenu;
    this.page = page;
    this.emailInputLocator = this.page.locator(
      'div.sc-jmnVvD input#admin-login-email',
    );
    this.passwordInputLocator = this.page.locator(
      'div.sc-jmnVvD input#admin-login-password',
    );
    this.submitButtonLocator = this.page.locator(
      'div#login-form-footer button[data-testid="test-button"]',
    );
    this.acceptCookiesButtonLocator = this.page.locator(
      'div#cookiescript_accept[role="button"]',
    );
    this.captchaLocator = this.page.locator('iframe[title="reCAPTCHA"]');

    this.homeLocator = this.page.locator('button[title="Home"]');
  }

  /**
   * Navigates to the login page URL.
   * @returns {Promise<void>} - Does not return any value.
   * @throws {Error} - Throws an error if navigation fails.
   */
  async navigate(): Promise<void> {
    try {
      await this.page.goto(LOGIN_URL, { timeout: DEFAULT_TIMEOUT });
    } catch (error) {
      handleError(error, 'Unknown error during navigation', ErrorType.LOGIN);
    }
  }

  /**
   * Accepts cookies by clicking the "Accept Cookies" button.
   * @returns {Promise<void>} - Does not return any value.
   * @throws {Error} - Throws an error if cookie acceptance fails.
   */
  async acceptCookies(): Promise<void> {
    try {
      await checkVisibilityAndEnabled(
        this.acceptCookiesButtonLocator,
        true,
        DEFAULT_TIMEOUT,
        ErrorType.LOGIN,
      );
      await clickWithTimeout(
        this.acceptCookiesButtonLocator,
        DEFAULT_TIMEOUT,
        ErrorType.LOGIN,
      );
    } catch (error) {
      handleError(
        error,
        'Unknown error during cookie acceptance',
        ErrorType.LOGIN,
      );
    }
  }

  /**
   * Fills the email input field with the provided email.
   * @param {string} email - Email.
   * @returns {Promise<void>} - Password.
   * @throws {Error} - Throws an error if the email input process fails.
   */
  async fillEmail(email: string): Promise<void> {
    try {
      await checkVisibilityAndEnabled(
        this.emailInputLocator,
        true,
        DEFAULT_TIMEOUT,
        ErrorType.LOGIN,
      );
      await fillWithTimeout(
        this.emailInputLocator,
        email,
        DEFAULT_TIMEOUT,
        ErrorType.LOGIN,
      );
    } catch (error) {
      handleError(error, 'Unknown error during email fill', ErrorType.LOGIN);
    }
  }

  /**
   * Fills the password input field with the provided password.
   * @param {string} password - Password.
   * @returns {Promise<void>} - Does not return any value.
   * @throws {Error} - Throws an error if the password input process fails.
   */
  async fillPassword(password: string): Promise<void> {
    try {
      await checkVisibilityAndEnabled(
        this.passwordInputLocator,
        true,
        DEFAULT_TIMEOUT,
        ErrorType.LOGIN,
      );
      await fillWithTimeout(
        this.passwordInputLocator,
        password,
        DEFAULT_TIMEOUT,
        ErrorType.LOGIN,
      );
    } catch (error) {
      handleError(error, 'Unknown error during password fill', ErrorType.LOGIN);
    }
  }

  /**
   * Clicks the submit button to attempt login.
   * @returns {Promise<void>} - Does not return any value.
   * @throws {Error} - Throws an error if the submit button click fails.
   */
  async clickSubmitButton(): Promise<void> {
    try {
      await checkVisibilityAndEnabled(
        this.submitButtonLocator,
        true,
        DEFAULT_TIMEOUT,
        ErrorType.LOGIN,
      );
      await clickWithTimeout(
        this.submitButtonLocator,
        DEFAULT_TIMEOUT,
        ErrorType.LOGIN,
      );
    } catch (error) {
      handleError(
        error,
        'Unknown error during submit button click',
        ErrorType.LOGIN,
      );
    }
  }

  /**
   * Pauses the page to allow manual CAPTCHA solving.
   * @returns {Promise<void>} - Does not return any value.
   * @throws {Error} - Throws an error if the page pause fails.
   */
  async pauseForCaptcha(): Promise<void> {
    try {
      await this.page.pause();
    } catch (error) {
      handleError(error, 'Unknown error during captcha pause', ErrorType.LOGIN);
    }
  }

  /**
   * Checks if a CAPTCHA is present on the page.
   * @returns {Promise<boolean>} - Returns true if CAPTCHA is present, otherwise returns false.
   * @throws {Error} - Throws an error if CAPTCHA detection fails.
   */
  async isCaptchaPresent(): Promise<boolean> {
    try {
      const iframeCount = await this.captchaLocator.count();
      if (iframeCount > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      handleError(
        error,
        'Unknown error during CAPTCHA detection',
        ErrorType.LOGIN,
      );
      return false;
    }
  }

  /**
   * Checks if the user is logged in by verifying the visibility of the home button.
   * @param {boolean} [waitFor=false] - The function immediately checks the visibility and enabled state without waiting.
   * @returns {Promise<boolean>} -  Returns true if the user is logged in, otherwise false.
   * @throws {Error} - Throws an error if the login check fails.
   */
  async isLoggedIn(waitFor: boolean = false): Promise<boolean> {
    try {
      console.log(`Checking if the user is logged in... (waitFor: ${waitFor})`);
      const homeButtonLocator = this.mainMenu.getHomeButtonLocator();
      const isLoggedIn = await checkVisibilityAndEnabled(
        this.mainMenu.homeButtonLocator,
        waitFor,
        DEFAULT_TIMEOUT,
        ErrorType.LOGIN,
      );
      console.log(`User logged in status: ${isLoggedIn}`);
      return isLoggedIn;
    } catch (error) {
      console.log('Error encountered while checking if the user is logged in.');
      console.error(error);
      return false;
    }
  }
}
