/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { ProjectFull } from "@itwin/imodel-browser-react";
import { Title } from "@itwin/itwinui-react";
import React from "react";

import { useApiData } from "../../../api/useApiData";

interface GetProjectResult {
  project?: ProjectFull;
}

interface SelectIModelTitleProps {
  accessToken: string;
  projectId: string;
}

export const SelectIModelTitle = ({
  accessToken,
  projectId,
}: SelectIModelTitleProps) => {
  const { results } = useApiData<GetProjectResult>({
    accessToken,
    url: `https://api.bentley.com/projects/${projectId}`,
  });

  return (
    <Title>
      {results?.project
        ? `iModels for ${results?.project?.displayName}`
        : "\u00a0"}
    </Title>
  );
};
