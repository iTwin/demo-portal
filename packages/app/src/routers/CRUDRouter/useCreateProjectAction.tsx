/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { SvgAdd } from "@itwin/itwinui-icons-react";
import { Button } from "@itwin/itwinui-react";
import { NavigateFn } from "@reach/router";
import React from "react";

export type CreateProjectActionOptions = {
  /**
   * Must be the "relative" navigate function, coming from route props.
   */
  navigate: NavigateFn | undefined;
};

export const useCreateProjectAction = ({
  navigate,
}: CreateProjectActionOptions) => {
  return {
    createIconButton: (
      <Button
        onClick={() => void navigate?.(`create-project`)}
        startIcon={<SvgAdd />}
      >
        New project
      </Button>
    ),
  };
};
