/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { LDFlagValue } from "launchdarkly-js-sdk-common";

export type LdFlags = "delete-imodel";

export type DemoFlagSet = {
  [key in LdFlags]: LDFlagValue;
};
