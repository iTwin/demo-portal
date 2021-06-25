/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
// import fs from "fs";
import { Browser, BrowserContext, chromium, Page } from "playwright-chromium";

import { SiteUrl, User1 } from "./helpers/config"; // BrowserName
import { Home, OIDC } from "./helpers/selectors";
import { elementExists, getBrowserPath } from "./helpers/utils";

let context: BrowserContext;
let browser: Browser;
let page: Page;

//e2e tests take a lot longer
jest.setTimeout(600000);
jest.retryTimes(2);

const login = async (): Promise<void> => {
  context = await browser.newContext();
  page = await context.newPage();

  try {
    await page.goto(SiteUrl);
    if (await elementExists(page, OIDC.v2.usernameInput)) {
      await page.fill(OIDC.v2.usernameInput, User1.username);
      await page.click(OIDC.v2.nextInput, { delay: 500 });
      if (!User1.username.includes("@bentley.com")) {
        await page.fill(OIDC.v2.passwordInput, User1.password);
        await page.click(OIDC.v2.signInButton, { delay: 500 });
      } else {
        // SSO
        await page.fill(
          'input[aria-label="firstname.lastname@bentley.com"]',
          User1.username
        );
        await page.press(
          'input[aria-label="firstname.lastname@bentley.com"]',
          "Enter"
        );
        await page.fill('input[name="Password"]', User1.password);
        await page.press('input[name="Password"]', "Enter");
        await page.click('input[type="submit"]');
      }
    } else {
      await page.fill(OIDC.v1.usernameInput, User1.username);
      await page.fill(OIDC.v1.passwordInput, User1.password);
      await page.click(OIDC.v1.signInButton, { delay: 500 });
    }
    await page.waitForSelector(Home.Portal);
  } catch (error) {
    await page.screenshot({ path: "login-failure.png" });
    throw error;
  }
};

beforeAll(async () => {
  browser = await chromium.launch({
    headless: process.env.NODE_ENV !== "test",
    // devtools: process.env.NODE_ENV === "test",
    executablePath: getBrowserPath(),
    slowMo: 250,
  });
});

afterAll(async () => {
  await browser.close();
});

beforeEach(async () => {
  await login();
});
afterEach(async () => {
  await page.close();
});

export { page };
