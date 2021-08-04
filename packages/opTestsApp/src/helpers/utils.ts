/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { Page } from "playwright-chromium";

import { BrowserName } from "./config";

export const elementExists = async (
  page: Page,
  selector: string
): Promise<boolean> => {
  try {
    await page.waitForSelector(selector);
    return true;
  } catch {
    return false;
  }
};

export const getBrowserPath = (): string => {
  switch (BrowserName) {
    case "chromium":
      return getChromePath();
    case "webkit":
      return getWebkitPath();
    case "firefox":
      return getFirefoxPath();
    default:
      return "";
  }
};

export const getChromePath = (): string => {
  switch (process.platform) {
    case "darwin":
      return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    case "win32":
      return "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
    case "linux":
      return "/usr/bin/google-chrome";
    default:
      return "";
  }
};

export const getFirefoxPath = (): string => {
  switch (process.platform) {
    case "darwin":
      return "/Applications/Firefox.app/Contents/MacOS/firefox";
    case "win32":
      return "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe";
    case "linux":
      return "/usr/bin/firefox";
    default:
      return "";
  }
};

export const getWebkitPath = (): string => {
  switch (process.platform) {
    case "darwin":
      return "/Applications/Safari.app/Contents/MacOS/Safari";
    case "linux":
      return "/usr/bin/safari";
    default:
      return "";
  }
};
