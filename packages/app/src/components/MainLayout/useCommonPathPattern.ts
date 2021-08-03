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
   * `/:section/project/:projectId/imodel/:iModelId` will return null if used with url
   * "/view/project/123", for example.
   */
  const sectionMatch = useMatch("/:section/*");
  const projectMatch = useMatch("/:section/project/:projectId/*");
  const iModelMatch = useMatch(
    "/:section/project/:projectId/imodel/:iModelId/*"
  );
  return {
    section: sectionMatch?.section,
    projectId: projectMatch?.projectId,
    iModelId: iModelMatch?.iModelId,
  };
};
