import { test } from '@playwright/test';
import * as dotenv from 'dotenv';
import { RpcTestScenarioBuilder } from '../../builders/rpc-test-scenario-builder';
import { NodePage } from '../../pages/node-page';
import { LoginPage } from '../../pages/login-page';
import { MainMenu } from '../../pages/main-menu';
import { LoginFlow } from '../../flows/login-flow';
import { NodeFlow } from '../../flows/node-flow';
import { SystemFlow } from '../../flows/system-flow';
import { protocolNetworkMap } from '../../pages/node-page';
import { runTestWithTabHandling } from '../../utils/ui-utils';

dotenv.config();
interface TestCase {
  protocol: string;
  network: string;
}

const testCases: TestCase[] = [];
for (const protocol of Object.keys(protocolNetworkMap)) {
  for (const network of protocolNetworkMap[protocol]) {
    testCases.push({ protocol, network });
  }
}

test.describe
  .serial('Positive scenario E2E test including login, creating node, fetching block number, block details, transaction hash and transaction details', () => {
  let systemFlow: SystemFlow;
  let currentProtocol: string;
  let currentNetwork: string;
  let context: any;
  let page: any;
  const username = process.env.MORALIS_USERNAME || '';
  const password = process.env.MORALIS_PASSWORD || '';
  
  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    const mainMenu = new MainMenu(page);
    const loginFlow = new LoginFlow(new LoginPage(page, mainMenu), page);
    const nodePage = new NodePage(page);
    const nodeFlow = new NodeFlow(nodePage);
    systemFlow = new SystemFlow(loginFlow, nodeFlow, mainMenu);
    await runTestWithTabHandling(context, page);
    await loginFlow.performLogin(username, password);
    console.log('Login performed.');
    await mainMenu.goToNodes();
    console.log('Went to nodes.');
    await page.waitForTimeout(10000);
    const nodesDetected = await nodePage.anyNodeAvailable(); 
    if (nodesDetected) {
      await nodeFlow.ifNodesDetectedDeleteAllNodes(); 
      console.log('Nodes were detected and successfully deleted.');
    } else {
      console.log('No nodes detected.');
    }
    await context.close();
  });

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    const mainMenu = new MainMenu(page);
    const loginFlow = new LoginFlow(new LoginPage(page, mainMenu), page); 
    const nodeFlow = new NodeFlow(new NodePage(page));

    systemFlow = new SystemFlow(loginFlow, nodeFlow, mainMenu);
    await runTestWithTabHandling(context, page);
  });

  testCases.forEach(({ protocol, network }) => {
    test(`Automation flow for ${protocol} on ${network}`, async () => {
      currentProtocol = protocol;
      currentNetwork = network;
      console.log(`Test using ${protocol} on ${network}`);
      const { site1: nodeUrl1, site2: nodeUrl2 } =
        await systemFlow.loginAndCreateNode(
          protocol,
          network,
          username,
          password,
        );
      if (!nodeUrl1 || !nodeUrl2)
        throw new Error('One or both Node URLs are not defined');
      const scenarioBuilder = new RpcTestScenarioBuilder(nodeUrl1);
      await scenarioBuilder.fetchBlockNumber();
      await scenarioBuilder.fetchBlockDetails();
      await scenarioBuilder.fetchTransactionHash();
      await scenarioBuilder.fetchTransactionDetails();
    });
  });

  test.afterEach(async () => {
    try {
      await systemFlow.cleanupNodeAndSession(
        currentProtocol,
        currentNetwork,
        page,
        true,
      );
    } catch (error) {
      console.error('Error during postconditions:', error);
    } finally {
      await context.close();
    }
  });
});
