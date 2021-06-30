/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { LDFlagValue } from "launchdarkly-js-sdk-common";

export type LdFlags = "deleteImodel";

export const LdFlagDefaults = {
  "delete-imodel": false,
};

export type DemoFlagSet = {
  [key in LdFlags]: LDFlagValue;
};
