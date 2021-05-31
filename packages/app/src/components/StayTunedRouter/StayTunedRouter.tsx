/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ErrorPage } from "@itwin/itwinui-react";
import { RouteComponentProps } from "@reach/router";
import React from "react";

/**
 * Only created to have more than one item on the sidebar...
 */
export const StayTunedRouter = ({
  featureName,
}: RouteComponentProps<{
  featureName: string;
}>) => {
  return (
    <ErrorPage
      errorName={`Stay Tuned for ${featureName}!`}
      errorMessage={`${featureName} is not available yet, but we hope to get it to you soon!`}
      errorType={"generic"}
    />
  );
};
