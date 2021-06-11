/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { withLDProvider } from "launchdarkly-react-client-sdk";

export const LaunchDarklyLauncher = (app: any) => {
  const clientID = process.env.IMJS_LD_CLIENT_ID;
  const deferInitialization = true;

  return withLDProvider({
    clientSideID: clientID as string,
    deferInitialization: deferInitialization,
  })(app);
};
