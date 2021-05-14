/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { DeleteIModel } from "@itwin/delete-imodel";
import { IModelFull } from "@itwin/imodel-browser";
import { SvgDelete } from "@itwin/itwinui-icons-react";
import React from "react";

export type Options = {
  accessToken: string;
  onSuccess: () => void;
};
export const useDeleteImodelOption = ({ accessToken, onSuccess }: Options) => {
  const [iModelToDelete, setIModelToDelete] = React.useState<
    IModelFull | undefined
  >();
  const clearIModelToDelete = () => setIModelToDelete(undefined);
  const clearIModelToDeleteAndCallback = React.useCallback(() => {
    clearIModelToDelete();
    onSuccess?.();
  }, [onSuccess]);

  return {
    deleteOption: React.useMemo(
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
  };
};
