/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { ManageVersions as ACRManageVersions } from "@itwin/manage-versions-react";
import { RouteComponentProps } from "@reach/router";
import React from "react";

import { useApiPrefix } from "../../api/useApiPrefix";
import "./ManageVersions.scss";

export interface VersionsProps extends RouteComponentProps {
  iModelId?: string;
  accessToken: string;
}
export const ManageVersions = ({
  iModelId = "",
  accessToken,
}: VersionsProps) => {
  const serverEnvironmentPrefix = useApiPrefix();

  return (
    <div className="manage-versions-with-side-and-splitter">
      <ACRManageVersions
        accessToken={accessToken}
        imodelId={iModelId}
        apiOverrides={{ serverEnvironmentPrefix }}
      />
    </div>
  );
};
