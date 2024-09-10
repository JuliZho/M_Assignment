import { Locator} from '@playwright/test'; 
export interface IMainMenu {
  goToHome(): Promise<void>;
  goToNodes(): Promise<void>;
  getHomeButtonLocator(): Locator ;
}
