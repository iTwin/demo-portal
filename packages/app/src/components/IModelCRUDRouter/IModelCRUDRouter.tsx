/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
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
    <Router>
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
