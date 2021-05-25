/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { IModelFull, UpdateIModel } from "@itwin/create-imodel";
import { RouteComponentProps, useNavigate } from "@reach/router";
import React from "react";

import { useApiData } from "../../api/useApiData";

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
  } = useApiData<GetIModelResult>({
    accessToken,
    url: `https://api.bentley.com/imodels/${iModelId}`,
  });
  const navigate = useNavigate();
  const goBack = () => navigate?.(-1);
  const { ref } = useUpdateIModelLoadingStyler(!iModel);
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
      />
    </div>
  );
};
