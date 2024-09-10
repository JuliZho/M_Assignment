import { Page } from 'puppeteer';
import { ILoginPage } from '../interfaces/interface-login-page';

const NODES_BUTTON_SELECTOR = 'button[title="Nodes"]';

export class LoginFlow {
  private loginPage: any;
  private page: Page;

  constructor(loginPage: any, page: Page) {
    this.loginPage = loginPage;
    this.page = page;
  }

  /**
   * Performs the login operation by navigating to the login page,
   * filling in the credentials, and handling CAPTCHA if present.
   *
   * @param {string} email - Email address.
   * @param {string} password - Password.
   * @returns {Promise<void>} - Does not return any value.
   * @throws {Error} - Throws an error if login fails.
   */
  async performLogin(email: string, password: string): Promise<void> {
    if (!email || !password) {
      throw new Error('Email or password is empty');
    }
    await this.loginPage.navigate();
    await this.loginPage.acceptCookies();
    await this.loginPage.fillEmail(email);
    await this.loginPage.fillPassword(password);
    await this.loginPage.clickSubmitButton();
    let isLoggedIn = await this.loginPage.isLoggedIn(false);
    if (!isLoggedIn) {
      const isCaptchaVisible = await this.loginPage.isCaptchaPresent();
      if (isCaptchaVisible) {
        console.log('CAPTCHA detected. Pausing for manual solving...');
        await this.loginPage.pauseForCaptcha();
        isLoggedIn = await this.loginPage.isLoggedIn(false);
        if (!isLoggedIn) {
          console.log('Retrying login after CAPTCHA solved...');
          await this.loginPage.clickSubmitButton();
          isLoggedIn = await this.loginPage.isLoggedIn(true);
          if (!isLoggedIn) {
            throw new Error('Login failed after CAPTCHA resolution and retry.');
          }
        }
      }
    }
    if (isLoggedIn) {
      console.log('Login successful!');
    } else {
      throw new Error(
        'Login failed after CAPTCHA. Browser will remain open for debugging.',
      );
    }
  }
}
