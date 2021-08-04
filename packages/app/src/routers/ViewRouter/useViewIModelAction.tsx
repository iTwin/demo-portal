/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { IModelFull } from "@itwin/create-imodel-react";
import { Svg3D } from "@itwin/itwinui-icons-react";
import { useNavigate } from "@reach/router";
import React from "react";

export const useViewIModelAction = () => {
  const navigate = useNavigate();
  return {
    viewAction: React.useMemo(
      () => ({
        key: "view",
        icon: <Svg3D />,
        onClick: (iModel: IModelFull) =>
          void navigate(
            `/view/project/${iModel.projectId}/imodel/${iModel.id}`
          ),
        children: "View",
      }),
      [navigate]
    ),
  };
};
