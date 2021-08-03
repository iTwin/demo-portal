/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import expand from "dotenv-expand";
import { config } from "dotenv-flow";

export interface User {
  username: string;
  password: string;
}

const envResult = config({ silent: true });
if (envResult.error) {
  throw envResult.error;
}
expand(envResult);

export const User1: User = {
  username: process.env.TestUserName ?? "",
  password: process.env.TestPassword ?? "",
};

export const UnauthorizedUser: User = {
  username: process.env.UnauthorizedUserName ?? "",
  password: process.env.UnauthorizedPassword ?? "",
};

export const SiteUrl: string = process.env.SiteUrl ?? "";

export const BrowserName = process.env.BROWSER ?? "chromium";
