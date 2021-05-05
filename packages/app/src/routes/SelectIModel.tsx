/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { IModelGrid } from "@itwin/imodel-browser";
import { RouteComponentProps } from "@reach/router";
import React from "react";

export interface IModelRouteProps extends RouteComponentProps {
  projectId?: string;
  accessToken: string;
}
export const SelectIModel = ({
  accessToken,
  projectId,
  navigate,
}: IModelRouteProps) => (
  <IModelGrid
    accessToken={accessToken}
    projectId={projectId}
    onThumbnailClick={(imodel) => navigate?.(`imodel/${imodel.id}`)}
  />
);
