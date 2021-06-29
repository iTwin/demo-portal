/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { LDProvider, useFlags } from "launchdarkly-react-client-sdk";
import React, { useEffect, useState } from "react";

import { useConfig } from "./config/ConfigProvider";
//import { LdFlags } from "./ldFlagList";

export interface LDUserProps {
  key: string;
  name: string;
}

// export const useDemoFlags = () => {
//   return useFlags() as LdFlags
// }

export const LaunchDarklyLauncher = (props: any) => {
  const [userProps, setUserProps] = useState<LDUserProps>();
  const { ldClientId: clientId } = useConfig();
  const token = props.token;

  useEffect(() => {
    if (token) {
      const user = token.getUserInfo();
      console.log(user.id.toUpperCase());
      const newUserProps = {
        key: user.id.toUpperCase() as string,
        name: user.email?.id.toUpperCase() as string,
      };
      setUserProps(newUserProps);
    }
  }, [token]);

  return clientId && userProps ? (
    <LDProvider clientSideID={clientId} user={userProps}>
      {props.children}
    </LDProvider>
  ) : (
    props.children
  );
};
