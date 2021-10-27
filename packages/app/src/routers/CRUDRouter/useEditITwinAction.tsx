/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { ProjectFull } from "@itwin/imodel-browser-react";
import { SvgEdit } from "@itwin/itwinui-icons-react";
import { NavigateFn } from "@reach/router";
import React from "react";

type EditITwinActionOptions = {
  /**
   * Must be the "relative" navigate function, coming from route props.
   */
  navigate: NavigateFn | undefined;
};

export const useEditITwinAction = ({ navigate }: EditITwinActionOptions) => {
  return {
    editAction: React.useMemo(
      () => ({
        key: "edit",
        icon: <SvgEdit />,
        onClick: (iTwin: ProjectFull) =>
          void navigate?.(`itwin/${iTwin.id}/edit-itwin`),
        children: "Edit iTwin",
      }),
      [navigate]
    ),
  };
};
