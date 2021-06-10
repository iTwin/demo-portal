/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import { usePrefixedUrl } from "./useApiPrefix";

interface ApiDataHookOptions {
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

/**
 * Generic hook to get json data results, expects request to http://developer.bentley.com/...
 */
export const useApiData: <T>(options: ApiDataHookOptions) => { results: T } = ({
  accessToken,
  url,
  headers,
}) => {
  const [results, setResults] = React.useState<any>({});
  const prefixedUrl = usePrefixedUrl(url);

  React.useEffect(() => {
    if (!accessToken || !prefixedUrl) {
      setResults({});
      return;
    }
    const abortController = new AbortController();
    const options: RequestInit = {
      signal: abortController.signal,
      headers: {
        Authorization: accessToken,
        Prefer: "return=representation",
        ...headers,
      },
    };
    fetch(prefixedUrl, options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.text().then((errorText) => {
            throw new Error(errorText);
          });
        }
      })
      .then((result) => {
        setResults(result);
      })
      .catch((e) => {
        if (e.name === "AbortError") {
          // Aborting because unmounting is not an error, swallow.
          return;
        }
        setResults({});
        console.error(e);
      });
    return () => {
      abortController.abort();
    };
  }, [accessToken, headers, prefixedUrl]);
  return { results };
};
