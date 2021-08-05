/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { CreateIModel } from "@itwin/create-imodel-react";
import { RouteComponentProps, useNavigate } from "@reach/router";
import React from "react";

import { useApiPrefix } from "../../api/useApiPrefix";

interface CreateProps extends RouteComponentProps {
  accessToken: string;
  projectId?: string;
}
export const IModelCreate = ({ accessToken, projectId = "" }: CreateProps) => {
  const navigate = useNavigate();
  const goBack = () => navigate?.(-1);
  const serverEnvironmentPrefix = useApiPrefix();
  return (
    <div className={"idp-scrolling-iac-dialog"}>
      <div className={"idp-content-margins"}>
        <CreateIModel
          accessToken={accessToken}
          projectId={projectId}
          onClose={goBack}
          onSuccess={goBack}
          apiOverrides={{ serverEnvironmentPrefix }}
        />
      </div>
    </div>
  );
};
