/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { CreateIModel } from "@itwin/create-imodel";
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
    <div>
      <CreateIModel
        accessToken={accessToken}
        projectId={projectId}
        onClose={goBack}
        onSuccess={goBack}
        apiOverrides={{ serverEnvironmentPrefix }}
      />
    </div>
  );
};
