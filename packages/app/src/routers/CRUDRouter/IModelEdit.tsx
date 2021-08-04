/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { IModelFull, UpdateIModel } from "@itwin/create-imodel-react";
import { RouteComponentProps, useNavigate } from "@reach/router";
import React from "react";

import { useApiData } from "../../api/useApiData";
import { useApiPrefix } from "../../api/useApiPrefix";

interface GetIModelResult {
  iModel?: IModelFull;
}

interface EditProps extends RouteComponentProps {
  accessToken: string;
  projectId?: string;
  iModelId?: string;
}

// Not safe, but works for now.
const useUpdateIModelLoadingStyler = (loading: boolean) => {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    ref.current
      ?.querySelectorAll(
        ".iui-input[name=name], .iui-textarea[name=description]"
      )
      .forEach((element) =>
        element.classList[loading ? "add" : "remove"]("iui-skeleton")
      );
  }, [loading]);
  return { ref };
};

export const IModelEdit = ({ accessToken, iModelId = "" }: EditProps) => {
  const {
    results: { iModel },
    refreshData,
  } = useApiData<GetIModelResult>({
    noAutoFetch: true,
    accessToken,
    url: `https://api.bentley.com/imodels/${iModelId}`,
  });
  React.useEffect(() => {
    // Always get up to date data;
    refreshData();
  }, [refreshData]);
  const navigate = useNavigate();
  const goBack = () => navigate?.(-1);
  const { ref } = useUpdateIModelLoadingStyler(!iModel);
  const serverEnvironmentPrefix = useApiPrefix();
  return (
    <div ref={ref}>
      <UpdateIModel
        key={iModel?.id}
        accessToken={accessToken}
        imodelId={iModelId}
        initialIModel={{
          name: iModel?.displayName ?? "",
          description: iModel?.description ?? "",
        }}
        onClose={goBack}
        onSuccess={goBack}
        apiOverrides={{ serverEnvironmentPrefix }}
      />
    </div>
  );
};
