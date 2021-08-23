/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { ProjectFull } from "@itwin/imodel-browser-react";
import React from "react";

import { usePrefixedUrl } from "./useApiPrefix";

export type ApiLink = {
  href: string;
};

export type ApiLinks = {
  self: ApiLink;
  next: ApiLink;
  prev: ApiLink;
};

export interface ProjectWithLinks extends ProjectFull {
  _links: {
    asset: ApiLink;
    storage: ApiLink;
    imodels: ApiLink;
    clashDetectionTests: ApiLink;
    clashDetectionRuns: ApiLink;
    propertyValueTests: ApiLink;
    propertyValueRuns: ApiLink;
  };
}
interface ApiDataHookOptions {
  /**
   * Do not automatically fetch data on initial run, wait for "refreshData" to be run.
   */
  noAutoFetch?: boolean;
  /**
   * The access token will be put as Authorization header value
   */
  accessToken?: string | undefined;
  /**
   * The url to query, the result will be returned as a json object in results
   */
  url?: string;
  /**
   * Additional headers to pass into the request.
   */
  headers?: { [key: string]: string };
}

const localCache: {
  [request: string]: { exp?: number; data?: any; fetch?: Promise<any> };
} = {};

/**
 * Generic hook to get json data results, expects request to http://api.bentley.com/...
 */
export const useApiData: <T>(
  options: ApiDataHookOptions
) => {
  results: T;
  refreshData(): (() => void) | undefined;
  state: undefined | Error | "done";
} = ({ noAutoFetch, accessToken, url, headers }) => {
  const [results, setResults] = React.useState<any>({});
  const [state, setState] = React.useState<undefined | Error | "done">();
  const prefixedUrl = usePrefixedUrl(url);
  const refreshData = React.useCallback(() => {
    setState(undefined);
    if (!accessToken || !prefixedUrl) {
      setResults({});
      return;
    }
    const abortController = new AbortController();

    if (!localCache[prefixedUrl]?.fetch) {
      const options: RequestInit = {
        headers: {
          Authorization: accessToken,
          Prefer: "return=representation",
          ...headers,
        },
      };
      localCache[prefixedUrl] = {
        fetch: fetch(prefixedUrl, options)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              localCache[prefixedUrl] = {};
              return response.text().then((errorText) => {
                throw new Error(errorText);
              });
            }
          })
          .then((result) => {
            if (prefixedUrl) {
              const FIVE_MIN_IN_MILLISECONDS = 5 * 60 * 1000;
              localCache[prefixedUrl] = {
                exp: Date.now() + FIVE_MIN_IN_MILLISECONDS,
                data: result,
              };
            }
            return result;
          }),
      };
    }
    if (localCache[prefixedUrl]?.fetch) {
      localCache[prefixedUrl]?.fetch
        ?.then((result) => {
          if (!abortController.signal.aborted) {
            setResults(result);
            setState("done");
          }
        })
        .catch((e) => {
          if (e.name === "AbortError") {
            // Aborting because unmounting is not an error, swallow.
            return;
          }
          setResults({});
          setState(e);
          console.error(e);
        });
    } else {
      setResults(localCache[prefixedUrl]?.data);
      setState("done");
    }
    return () => {
      abortController.abort();
    };
  }, [accessToken, headers, prefixedUrl]);
  React.useEffect(() => {
    if (!noAutoFetch) {
      const cache = localCache[prefixedUrl ?? ""];
      if (cache?.exp && cache?.exp > Date.now()) {
        setResults(cache.data);
        setState("done");
        return;
      }
      return refreshData();
    }
  }, [noAutoFetch, refreshData, prefixedUrl]);
  return { results, refreshData, state };
};
