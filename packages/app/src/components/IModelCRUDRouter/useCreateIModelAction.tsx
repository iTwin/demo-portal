/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { ProjectFull } from "@itwin/imodel-browser-react";
import { SvgImodel } from "@itwin/itwinui-icons-react";
import { Button } from "@itwin/itwinui-react";
import { NavigateFn } from "@reach/router";
import React from "react";

export type CreateIModelActionOptions = {
  /**
   * Must be the "relative" navigate function, coming from route props.
   */
  navigate: NavigateFn | undefined;
};

export const useCreateIModelAction = ({
  navigate,
}: CreateIModelActionOptions) => {
  return {
    createAction: React.useMemo(
      () => ({
        key: "create",
        icon: <SvgImodel />,
        onClick: (project: ProjectFull) =>
          void navigate?.(`project/${project.id}/create-imodel`),
        children: "New iModel",
      }),
      [navigate]
    ),
    createIconButton: (
      <Button
        onClick={() => void navigate?.(`create-imodel`)}
        startIcon={<SvgImodel />}
      >
        New iModel
      </Button>
    ),
  };
};
