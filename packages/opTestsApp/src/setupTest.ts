/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
// import fs from "fs";
import { Browser, BrowserContext, chromium, Page } from "playwright-chromium";

import { SiteUrl, User, User1 } from "./helpers/config"; // BrowserName
import { Base, Home, OIDC } from "./helpers/selectors";
import { elementExists, getBrowserPath } from "./helpers/utils";

let context: BrowserContext;
let browser: Browser;
let page: Page;

//e2e tests take a lot longer
jest.setTimeout(600000);
jest.retryTimes(2);

export const login = async (
  user: User = User1,
  waitFor: string = Home.Portal
): Promise<void> => {
  context = await browser.newContext();
  page = await context.newPage();

  try {
    console.log(`SiteUrl: ${SiteUrl}`);
    await page.goto(SiteUrl);
    await page.click(Base.signInButton);
    if (await elementExists(page, OIDC.v2.usernameInput)) {
      await page.fill(OIDC.v2.usernameInput, user.username);
      await page.click(OIDC.v2.nextInput, { delay: 500 });
      if (!user.username.includes("@bentley.com")) {
        await page.fill(OIDC.v2.passwordInput, user.password);
        await page.click(OIDC.v2.signInButton, { delay: 500 });
      } else {
        // SSO
        await page.fill(
          'input[aria-label="firstname.lastname@bentley.com"]',
          user.username
        );
        await page.press(
          'input[aria-label="firstname.lastname@bentley.com"]',
          "Enter"
        );
        await page.fill('input[name="Password"]', user.password);
        await page.press('input[name="Password"]', "Enter");
        await page.click('input[type="submit"]');
      }
    } else {
      await page.fill(OIDC.v1.usernameInput, user.username);
      await page.fill(OIDC.v1.passwordInput, user.password);
      await page.click(OIDC.v1.signInButton, { delay: 500 });
    }
    await page.waitForSelector(waitFor);
  } catch (error) {
    await page.screenshot({ path: "login-failure.png" });
    throw error;
  }
};

beforeAll(async () => {
  browser = await chromium.launch({
    headless: process.env.NODE_ENV === "test",
    // devtools: process.env.NODE_ENV === "test",
    executablePath: getBrowserPath(),
    slowMo: 250,
  });
});

afterAll(async () => {
  try {
    await browser.close();
  } catch (error) {
    console.log(error);
  }
});

beforeEach(async () => {
  await login();
});
afterEach(async () => {
  await page.close();
});

export { page };
