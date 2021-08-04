/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { IModelFull } from "@itwin/create-imodel-react";
import { SvgEdit } from "@itwin/itwinui-icons-react";
import { NavigateFn } from "@reach/router";
import React from "react";

type EditIModelActionOptions = {
  /**
   * Must be the "relative" navigate function, coming from route props.
   */
  navigate: NavigateFn | undefined;
};

export const useEditIModelAction = ({ navigate }: EditIModelActionOptions) => {
  return {
    editAction: React.useMemo(
      () => ({
        key: "edit",
        icon: <SvgEdit />,
        onClick: (iModel: IModelFull) =>
          void navigate?.(`imodel/${iModel.id}/edit-imodel`),
        children: "Edit iModel",
      }),
      [navigate]
    ),
  };
};
