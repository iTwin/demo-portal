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

interface GetProjectResult {
  project?: ProjectFull;
}

interface EditProps extends RouteComponentProps {
  accessToken: string;
  iTwinId?: string;
}

// Not safe, but works for now.
const useUpdateITwinLoadingStyler = (loading: boolean) => {
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

export const ITwinEdit = ({ accessToken, iTwinId = "" }: EditProps) => {
  const {
    results: { project: iTwin },
    refreshData,
  } = useApiData<GetProjectResult>({
    accessToken,
    url: `https://api.bentley.com/projects/${iTwinId}`,
  });
  const navigate = useNavigate();
  const goBack = () => navigate?.(-1);
  const refreshAndGoBack = React.useCallback(async () => {
    await refreshData();
    navigate?.(-1);
  }, [refreshData, navigate]);

  const { ref } = useUpdateITwinLoadingStyler(!iTwin);
  const serverEnvironmentPrefix = useApiPrefix();
  const stringsOverrides = React.useMemo(
    () => ({
      titleString: "Edit an iTwin",
      projectNumberString: "Number",
      successMessage: "iTwin updated successfully.",
      errorMessage: "Could not update an iTwin. Please try again later.",
      errorMessageProjectExists:
        "iTwin with the same name or number already exists.",
    }),
    []
  );

  return (
    <div ref={ref} className={"idp-scrolling-iac-dialog"}>
      <div className={"idp-content-margins"}>
        <UpdateProject
          key={iTwin?.id}
          accessToken={accessToken}
          projectId={iTwinId}
          initialProject={{
            displayName: iTwin?.displayName ?? "",
            projectNumber: iTwin?.projectNumber ?? "",
          }}
          onClose={goBack}
          onSuccess={refreshAndGoBack}
          apiOverrides={{ serverEnvironmentPrefix }}
          stringsOverrides={stringsOverrides}
        />
      </div>
    </div>
  );
};
