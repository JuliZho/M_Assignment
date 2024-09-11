export interface ILoginPage {
  navigate(): Promise<void>;
  acceptCookies(): Promise<void>;
  fillEmail(email: string): Promise<void>;
  fillPassword(password: string): Promise<void>;
  clickSubmitButton(): Promise<void>;
  isCaptchaPresent(): Promise<boolean>;
  pauseForCaptcha(): Promise<void>;
  isLoggedIn(): Promise<boolean>;
}
