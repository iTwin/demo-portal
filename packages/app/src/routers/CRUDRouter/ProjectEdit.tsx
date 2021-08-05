/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { ProjectFull } from "@itwin/imodel-browser-react";
import { RouteComponentProps, useNavigate } from "@reach/router";
import React from "react";

import { useApiData } from "../../api/useApiData";
import { useApiPrefix } from "../../api/useApiPrefix";
import { UpdateProject } from "./components/update-project/UpdateProject";

interface GetIModelResult {
  project?: ProjectFull;
}

interface EditProps extends RouteComponentProps {
  accessToken: string;
  projectId?: string;
}

// Not safe, but works for now.
const useUpdateProjectLoadingStyler = (loading: boolean) => {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    ref.current
      ?.querySelectorAll(
        ".iui-input[name=displayName], .iui-input[name=projectNumber]"
      )
      .forEach((element) =>
        element.classList[loading ? "add" : "remove"]("iui-skeleton")
      );
  }, [loading]);
  return { ref };
};

export const ProjectEdit = ({ accessToken, projectId = "" }: EditProps) => {
  const {
    results: { project },
    refreshData,
  } = useApiData<GetIModelResult>({
    accessToken,
    url: `https://api.bentley.com/projects/${projectId}`,
  });
  const navigate = useNavigate();
  const goBack = () => navigate?.(-1);
  const refreshAndGoBack = React.useCallback(async () => {
    await refreshData();
    navigate?.(-1);
  }, [refreshData, navigate]);

  const { ref } = useUpdateProjectLoadingStyler(!project);
  const serverEnvironmentPrefix = useApiPrefix();
  return (
    <div ref={ref} className={"idp-scrolling-iac-dialog"}>
      <div className={"idp-content-margins"}>
        <UpdateProject
          key={project?.id}
          accessToken={accessToken}
          projectId={projectId}
          initialProject={{
            displayName: project?.displayName ?? "",
            projectNumber: project?.projectNumber ?? "",
          }}
          onClose={goBack}
          onSuccess={refreshAndGoBack}
          apiOverrides={{ serverEnvironmentPrefix }}
        />
      </div>
    </div>
  );
};
