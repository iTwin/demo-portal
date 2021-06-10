/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useConfig } from "../config/ConfigProvider";

/**
 * Obtain the api prefix from BUDDI configuration
 * @returns prefix as string
 */
export const useApiPrefix = () => {
  const buddiRegion = useConfig().buddi?.region;
  switch (buddiRegion) {
    case "101":
    case "103":
      return "dev";
    case "102":
      return "qa";
    default:
      return "";
  }
};

/**
 *
 * @param baseUrl
 * @returns Url with proper prefix based on BUDDI environment configuration
 */
export const usePrefixedUrl = (baseUrl?: string) => {
  const prefix = useApiPrefix();
  if (prefix && baseUrl) {
    return baseUrl.replace("api.bentley.com", `${prefix}-api.bentley.com`);
  }
  return baseUrl;
};
