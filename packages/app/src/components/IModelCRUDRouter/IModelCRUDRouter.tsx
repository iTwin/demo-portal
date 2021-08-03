/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { RouteComponentProps, Router } from "@reach/router";
import React from "react";

import { IModelCreate } from "./IModelCreate";
import { IModelEdit } from "./IModelEdit";

interface IModelCRUDRouterProps extends RouteComponentProps {
  accessToken: string;
}

export const IModelCRUDRouter = ({ accessToken }: IModelCRUDRouterProps) => {
  return (
    <Router className={"full-height-container"}>
      <IModelCreate
        accessToken={accessToken}
        path="project/:projectId/create-imodel"
      />
      <IModelEdit
        accessToken={accessToken}
        path="project/:projectId/imodel/:iModelId/edit-imodel"
      />
    </Router>
  );
};
