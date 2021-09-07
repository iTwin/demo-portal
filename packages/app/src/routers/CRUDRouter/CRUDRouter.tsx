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
import { ITwinCreate } from "./ITwinCreate";
import { ITwinEdit } from "./ITwinEdit";

interface CRUDRouterProps extends RouteComponentProps {
  accessToken: string;
}

export const CRUDRouter = ({ accessToken }: CRUDRouterProps) => {
  return (
    <Router className={"full-height-container"}>
      <ITwinCreate accessToken={accessToken} path="create-itwin" />
      <ITwinEdit accessToken={accessToken} path="itwin/:iTwinId/edit-itwin" />
      <IModelCreate
        accessToken={accessToken}
        path="itwin/:iTwinId/create-imodel"
      />
      <IModelEdit
        accessToken={accessToken}
        path="itwin/:iTwinId/imodel/:iModelId/edit-imodel"
      />
    </Router>
  );
};
