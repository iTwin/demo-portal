/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { IModelGrid, IModelGridProps } from "@itwin/imodel-browser";
import { RouteComponentProps } from "@reach/router";
import React from "react";

import { useDeleteImodelOption } from "./useDeleteImodelOption";

export type IModelRouteProps = RouteComponentProps<IModelGridProps>;
export const SelectIModel = ({
  accessToken = "",
  projectId,
  navigate,
  ...rest
}: IModelRouteProps) => {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const refreshIModelGrid = React.useCallback(() => {
    setRefreshKey((key) => (key + 1) % 3);
  }, []);
  const { deleteOption, deleteDialog } = useDeleteImodelOption({
    accessToken,
    onSuccess: refreshIModelGrid,
  });
  return (
    <>
      <IModelGrid
        key={refreshKey}
        accessToken={accessToken}
        projectId={projectId}
        onThumbnailClick={(imodel) => navigate?.(`imodel/${imodel.id}`)}
        iModelOptions={[deleteOption]}
        {...rest}
      />
      {deleteDialog}
    </>
  );
};
