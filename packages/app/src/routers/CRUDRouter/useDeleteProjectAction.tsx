/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { ProjectFull } from "@itwin/imodel-browser-react";
import { SvgDelete } from "@itwin/itwinui-icons-react";
import React from "react";

import { useApiPrefix } from "../../api/useApiPrefix";
import { DeleteProject } from "./components/delete-project/DeleteProject";

export type DeleteProjectActionOptions = {
  accessToken: string;
};

/**
 * Generate delete project action and modal rendering.
 */
export const useDeleteProjectAction = ({
  accessToken,
}: DeleteProjectActionOptions) => {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const [projectToDelete, setProjectToDelete] = React.useState<
    ProjectFull | undefined
  >();
  const clearProjectToDelete = () => setProjectToDelete(undefined);
  const clearProjectToDeleteAndCallback = () => {
    clearProjectToDelete();
    setRefreshKey((key) => (key + 1) % 3);
  };
  const serverEnvironmentPrefix = useApiPrefix();
  return {
    deleteAction: React.useMemo(
      () => ({
        key: "delete",
        icon: <SvgDelete />,
        onClick: setProjectToDelete,
        children: "Delete project",
      }),
      []
    ),
    deleteDialog: projectToDelete && (
      <DeleteProject
        project={projectToDelete}
        accessToken={accessToken ?? ""}
        onClose={clearProjectToDelete}
        onError={clearProjectToDelete}
        onSuccess={clearProjectToDeleteAndCallback}
        apiOverrides={{ serverEnvironmentPrefix }}
      />
    ),
    refreshKey,
  };
};
