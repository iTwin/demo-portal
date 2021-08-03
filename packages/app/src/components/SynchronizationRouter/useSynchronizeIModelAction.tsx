/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { IModelFull } from "@itwin/create-imodel-react";
import { SvgSync } from "@itwin/itwinui-icons-react";
import { useNavigate } from "@reach/router";
import React from "react";

export const useSynchronizeIModelAction = () => {
  const navigate = useNavigate();
  return {
    synchronizeAction: React.useMemo(
      () => ({
        key: "synchronize",
        icon: <SvgSync />,
        onClick: (iModel: IModelFull) =>
          void navigate(
            `/synchronize/project/${iModel.projectId}/imodel/${iModel.id}`
          ),
        children: "Synchronize",
      }),
      [navigate]
    ),
  };
};
