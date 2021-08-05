/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
interface DemoPortalAuthConfig {
  authority: string;
  clientId: string;
  whitelistedIds: string;
}

interface DemoPortalBuddiConfig {
  region: string;
}

interface DemoPortalLaunchDarklyConfig {
  clientId: string;
}

interface DemoPortalAppInsightsConfig {
  key: string;
}

export interface DemoPortalConfig {
  auth?: DemoPortalAuthConfig;
  buddi?: DemoPortalBuddiConfig;
  launchDarkly?: DemoPortalLaunchDarklyConfig;
  appInsights?: DemoPortalAppInsightsConfig;
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
        "https://ims.bentley.com",
      clientId:
        fetchedConfig?.envConfig?.auth?.clientId ??
        process.env.IMJS_AUTH_CLIENT_CLIENT_ID ??
        "",
      whitelistedIds:
        fetchedConfig?.envConfig?.auth?.whitelistedIds ??
        process.env.IMJS_DEMO_PORTAL_WHITELIST ??
        "",
    },
    launchDarkly: {
      clientId:
        fetchedConfig?.envConfig?.launchDarkly?.clientId ??
        process.env.IMJS_LD_CLIENT_ID ??
        "",
    },
    appInsights: {
      key:
        fetchedConfig?.envConfig?.appInsights?.key ??
        process.env.IMJS_APP_INSIGHTS_KEY ??
        "",
    },
  };
};
