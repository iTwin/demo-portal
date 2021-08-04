/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { DeleteIModel } from "@itwin/delete-imodel-react";
import { IModelFull } from "@itwin/imodel-browser-react";
import { SvgDelete } from "@itwin/itwinui-icons-react";
import React from "react";

import { useApiPrefix } from "../../api/useApiPrefix";

export type DeleteIModelActionOptions = {
  accessToken: string;
};

/**
 * Generate delete IModel action and modal rendering.
 */
export const useDeleteIModelAction = ({
  accessToken,
}: DeleteIModelActionOptions) => {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const [iModelToDelete, setIModelToDelete] = React.useState<
    IModelFull | undefined
  >();
  const clearIModelToDelete = () => setIModelToDelete(undefined);
  const clearIModelToDeleteAndCallback = () => {
    clearIModelToDelete();
    setRefreshKey((key) => (key + 1) % 3);
  };
  const serverEnvironmentPrefix = useApiPrefix();
  return {
    deleteAction: React.useMemo(
      () => ({
        key: "delete",
        icon: <SvgDelete />,
        onClick: setIModelToDelete,
        children: "Delete iModel",
      }),
      []
    ),
    deleteDialog: iModelToDelete && (
      <DeleteIModel
        imodel={iModelToDelete}
        accessToken={accessToken ?? ""}
        onClose={clearIModelToDelete}
        onError={clearIModelToDelete}
        onSuccess={clearIModelToDeleteAndCallback}
        apiOverrides={{ serverEnvironmentPrefix }}
      />
    ),
    refreshKey,
  };
};
