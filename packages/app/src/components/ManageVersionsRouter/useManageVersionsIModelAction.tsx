/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { IModelFull } from "@itwin/create-imodel-react";
import { SvgFlag } from "@itwin/itwinui-icons-react";
import { useNavigate } from "@reach/router";
import React from "react";

export const useManageVersionsIModelAction = () => {
  const navigate = useNavigate();
  return {
    manageVersionsAction: React.useMemo(
      () => ({
        key: "manage-versions",
        icon: <SvgFlag />,
        onClick: (iModel: IModelFull) =>
          void navigate(
            `/manage-versions/project/${iModel.projectId}/imodel/${iModel.id}`
          ),
        children: "Manage versions",
      }),
      [navigate]
    ),
  };
};
