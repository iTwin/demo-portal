/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { Redirect, RouteComponentProps, Router } from "@reach/router";
import React, { ComponentPropsWithoutRef } from "react";

import { CRUDRouter } from "../CRUDRouter/CRUDRouter";
import SelectIModel from "./SelectIModel";
import SelectITwin from "./SelectITwin";

interface SelectionRouterProps extends RouteComponentProps {
  accessToken: string;
  hideIModelActions?: ComponentPropsWithoutRef<
    typeof SelectIModel
  >["hideActions"];
}

export const SelectionRouter = ({
  accessToken,
  hideIModelActions,
}: SelectionRouterProps) => {
  return (
    <Router className={"full-height-container"}>
      <SelectITwin accessToken={accessToken} path="/" />
      <Redirect from={"itwin"} to={"../"} noThrow={true} />
      <SelectIModel
        accessToken={accessToken}
        path="itwin/:iTwinId"
        hideActions={hideIModelActions}
      />
      <Redirect
        from={"itwin/:iTwinId/imodel"}
        to={"../../../itwin/:iTwinId/"}
        noThrow={true}
      />
      <CRUDRouter accessToken={accessToken} path="*" />
    </Router>
  );
};
