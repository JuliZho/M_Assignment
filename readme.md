# Project Overview

This project is a test automation framework for blockchain operations. The framework automates processes such as fetching block and transaction details, creating nodes, and managing nodes across multiple blockchain protocol-network combinations.

---

## Key Components

### 1. **RPC Test Scenario Builder (`rpc-test-scenario-builder.ts`)**

- A utility to interact with an RPC API client to retrieve block and transaction details.
- Functions include fetching block numbers, block details, transaction hashes, and transaction details.

### 2. **RPC API Client (`rpc-api-client.ts`)**

- Provides methods to make requests to blockchain nodes using RPC.
- Responsible for fetching block details, transaction hashes, and transaction details with retries and validation.

### 3. **Login Flow (`login-flow.ts`)**

- Automates logging into a blockchain node management interface.
- Includes CAPTCHA handling for manual resolution if CAPTCHA is detected.

### 4. **Node Flow (`node-flow.ts`)**

- Manages the lifecycle of blockchain nodes, including creating, copying node URLs, and deleting nodes.

### 5. **System Flow (`system-flow.ts`)**

- Combines the login and node creation processes into a full end-to-end flow.
- Cleans up sessions by deleting nodes and clearing browser cookies.

### 6. **E2E Tests (`positiveScenarioLoginNodeCreationFetchingBlockNumberAndDetailsTransactionHashAndDetails.spec.ts`)**

- End-to-end tests for logging in, creating a node, and fetching blockchain data (block numbers, block details, transaction details, transaction hash).
- Utilizes 21 different blockchain network-protocols combinations.
- Note that 10 additional combinations were not included, due to consistent problem with receiving transaction hash, the issue was not investigated.

---

## Dependencies

Before running the tests, ensure that the following dependencies are installed:

1. **Playwright**:
   - Playwright is used for browser automation and end-to-end testing.
     npm install @playwright/test
2. **Install dependencies**:
   - "@playwright/test": "^1.19.0",
   - "dotenv": "^8.2.0",
   - "axios": "^0.21.1",
   - "puppeteer": "^9.0.0",
   - "typescript": "^4.2.3",
   - "ts-node": "^9.1.1"
3. **Set up environment variables**:
   - Create a .env file in the moralis-assignment directory. Add the following environment variables:
     MORALIS_USERNAME
     MORALIS_PASSWORD

---

## Installation

1. Clone the repository:
   git clone <repository-url>

---

## Running

1. Run the tests with:
   npx playwright test "functional-tests/E2E/positiveScenarioLoginNodeCreationFetchingBlockNumberAndDetailsTransactionHashAndDetails.spec.ts"
