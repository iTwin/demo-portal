/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { RouteComponentProps, useNavigate } from "@reach/router";
import React from "react";

import { CreateRole } from "./components/create-role/CreateRole";
import "./RoleBase.scss";
import { useRoleConfig } from "./useRoleConfig";

interface CreateProps extends RouteComponentProps {
  accessToken: string;
  projectId?: string;
}
export const RoleCreate = ({ accessToken, projectId = "" }: CreateProps) => {
  const navigate = useNavigate();
  const goBack = () => navigate?.(-1);
  return (
    <div className={"idp-scrolling-role-base"}>
      <div className={"idp-content-margins"}>
        <CreateRole
          accessToken={accessToken}
          projectId={projectId}
          onClose={goBack}
          onSuccess={goBack}
          {...useRoleConfig()}
        />
      </div>
    </div>
  );
};
