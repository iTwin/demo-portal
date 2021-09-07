/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { RouteComponentProps, Router } from "@reach/router";
import React from "react";

import { RoleCreate } from "./RoleCreate";
import { RoleEdit } from "./RoleEdit";
import { Roles } from "./Roles";

interface RolesRouterProps extends RouteComponentProps {
  accessToken: string;
}

export const RolesRouter = ({ accessToken }: RolesRouterProps) => {
  return (
    <Router className="full-height-container">
      <Roles accessToken={accessToken} path="/" />
      <RoleCreate accessToken={accessToken} path="/create" />
      <RoleEdit accessToken={accessToken} path="/:roleId" />
    </Router>
  );
};
