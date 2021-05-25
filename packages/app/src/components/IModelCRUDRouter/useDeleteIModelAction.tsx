/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { DeleteIModel } from "@itwin/delete-imodel";
import { IModelFull } from "@itwin/imodel-browser";
import { SvgDelete } from "@itwin/itwinui-icons-react";
import React from "react";

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
      />
    ),
    refreshKey,
  };
};
