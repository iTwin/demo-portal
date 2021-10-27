/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { RouteComponentProps, Router } from "@reach/router";
import React from "react";

import { SelectionRouter } from "../SelectionRouter/SelectionRouter";
import { Members } from "./Members";
import { RolesRouter } from "./RolesRouter";

interface MembersRouterProps extends RouteComponentProps {
  accessToken: string;
}

export const MembersRouter = ({ accessToken }: MembersRouterProps) => {
  return (
    <Router className="full-height-container">
      <SelectionRouter accessToken={accessToken} path="*" />
      <Members accessToken={accessToken} path="/itwin/:iTwinId/*" />
      <RolesRouter accessToken={accessToken} path="/itwin/:iTwinId/roles/*" />
    </Router>
  );
};
