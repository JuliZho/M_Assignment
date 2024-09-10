import { Locator} from '@playwright/test'; 
export interface INodePage {
  getGeneralAccordionButtonLocator(): Locator; 
  clickCreateNewNodeButton(): Promise<void>;
  selectProtocol(protocol: string): Promise<void>;
  selectNetwork(network: string): Promise<void>;
  clickFinalSubmitButton(): Promise<void>;
  waitForLoadingToComplete(): Promise<void>;
  verifyNodeLoaded(protocol: string): Promise<void>;
  clickCopyButton(index: number): Promise<void>;
  getCopiedUrl(index: number): Promise<string>;
  openAccordion(protocol?: string, index?: number): Promise<void>;
  isAccordionOpen(protocol: string): Promise<boolean>;
 clickDeleteNodeButton(protocol?: string,index?: number): Promise<void>;
 confirmDeleteNodeOperationButton(protocol?: string, index?: number,): Promise<void>;
 anyNodeAvailable(): Promise<boolean>;
}
