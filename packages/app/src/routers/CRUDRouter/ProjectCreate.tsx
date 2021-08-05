/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { RouteComponentProps, useNavigate } from "@reach/router";
import React from "react";

import { useApiPrefix } from "../../api/useApiPrefix";
import { CreateProject } from "./components/create-project/CreateProject";

interface CreateProps extends RouteComponentProps {
  accessToken: string;
}
export const ProjectCreate = ({ accessToken }: CreateProps) => {
  const navigate = useNavigate();
  const goBack = () => navigate?.(-1);
  const serverEnvironmentPrefix = useApiPrefix();
  return (
    <div className={"idp-scrolling-iac-dialog"}>
      <div className={"idp-content-margins"}>
        <CreateProject
          accessToken={accessToken}
          onClose={goBack}
          onSuccess={(project) => {
            void navigate(`project/${project.project.id}`);
          }}
          apiOverrides={{ serverEnvironmentPrefix }}
        />
      </div>
    </div>
  );
};
