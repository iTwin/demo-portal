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
import {
  DeleteProject,
  DeleteProjectProps,
} from "./components/delete-project/DeleteProject";

export type DeleteITwinActionOptions = {
  accessToken: string;
};

/**
 * Generate delete project action and modal rendering.
 */
export const useDeleteITwinAction = ({
  accessToken,
}: DeleteITwinActionOptions) => {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const [iTwinToDelete, setiTwinToDelete] = React.useState<
    ProjectFull | undefined
  >();
  const cleariTwinToDelete = () => setiTwinToDelete(undefined);
  const cleariTwinToDeleteAndCallback = () => {
    cleariTwinToDelete();
    setRefreshKey((key) => (key + 1) % 3);
  };
  const serverEnvironmentPrefix = useApiPrefix();
  const apiOverrides = React.useMemo(() => ({ serverEnvironmentPrefix }), [
    serverEnvironmentPrefix,
  ]) as DeleteProjectProps["apiOverrides"];
  const displayName = iTwinToDelete?.displayName;
  const stringsOverrides = React.useMemo(
    () => ({
      bodyMessage:
        "Deleting this iTwin will remove access for all users and all data will no longer be available. Are you sure you want to delete this iTwin?",
      errorMessage: "Could not delete an iTwin. Please try again later.",
      successMessage: "iTwin deleted successfully.",
      title: `Delete iTwin ${displayName && `'${displayName}'`}`,
    }),
    [displayName]
  );
  return {
    deleteAction: React.useMemo(
      () => ({
        key: "delete",
        icon: <SvgDelete />,
        onClick: setiTwinToDelete,
        children: "Delete iTwin",
      }),
      []
    ),
    deleteDialog: iTwinToDelete && (
      <DeleteProject
        project={iTwinToDelete}
        accessToken={accessToken ?? ""}
        onClose={cleariTwinToDelete}
        onError={cleariTwinToDelete}
        onSuccess={cleariTwinToDeleteAndCallback}
        apiOverrides={apiOverrides}
        stringsOverrides={stringsOverrides}
      />
    ),
    refreshKey,
  };
};
