import { UserInfo } from "@bentley/itwin-client";

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
interface DemoPortalAuthConfig {
  authority: string;
  apimAuthority: string;
  clientId: string;
}

interface DemoPortalBuddiConfig {
  region: string;
}

export interface DemoPortalConfig {
  auth?: DemoPortalAuthConfig;
  buddi?: DemoPortalBuddiConfig;
  userInfo?: UserInfo;
}

interface EnvConfig {
  envConfig: DemoPortalConfig;
}

export const getConfig = async (): Promise<DemoPortalConfig> => {
  const fetchedConfig = (await (
    await fetch(`${process.env.PUBLIC_URL}/env-config.json`)
  ).json()) as EnvConfig;
  return {
    buddi: {
      region:
        fetchedConfig?.envConfig?.buddi?.region ??
        process.env.IMJS_BUDDI_REGION ??
        "",
    },
    auth: {
      authority:
        fetchedConfig?.envConfig?.auth?.authority ??
        process.env.IMJS_AUTH_CLIENT_AUTHORITY ??
        "https://imsoidc.bentley.com",
      apimAuthority:
        fetchedConfig?.envConfig?.auth?.apimAuthority ??
        process.env.IMJS_AUTH_CLIENT_APIM_AUTHORITY ??
        "https://ims.bentley.com",
      clientId:
        fetchedConfig?.envConfig?.auth?.clientId ??
        process.env.IMJS_AUTH_CLIENT_CLIENT_ID ??
        "",
    },
  };
};
