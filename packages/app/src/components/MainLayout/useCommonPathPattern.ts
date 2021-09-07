/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { useMatch } from "@reach/router";

export const useCommonPathPattern = () => {
  /**
   * These needs to be done separately because match will not detect partial successes
   * `/:section/itwin/:iTwinId/imodel/:iModelId` will return null if used with url
   * "/view/itwin/123", for example.
   */
  const sectionMatch = useMatch("/:section/*");
  const iTwinMatch = useMatch("/:section/itwin/:iTwinId/*");
  const iModelMatch = useMatch("/:section/itwin/:iTwinId/imodel/:iModelId/*");
  return {
    section: sectionMatch?.section,
    iTwinId: iTwinMatch?.iTwinId,
    iModelId: iModelMatch?.iModelId,
  };
};
