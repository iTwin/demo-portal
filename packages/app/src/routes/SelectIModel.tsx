/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { DeleteIModel } from "@itwin/delete-imodel";
import { IModelFull, IModelGrid } from "@itwin/imodel-browser";
import { SvgDelete } from "@itwin/itwinui-icons-react";
import { RouteComponentProps } from "@reach/router";
import React from "react";

export interface IModelRouteProps extends RouteComponentProps {
  projectId?: string;
  accessToken: string;
}
export const SelectIModel = ({
  accessToken,
  projectId,
  navigate,
}: IModelRouteProps) => {
  const [iModelToDelete, setIModelToDelete] = React.useState<
    IModelFull | undefined
  >();
  const [refreshKey, setRefreshKey] = React.useState(0);
  const clearIModelToDelete = () => setIModelToDelete(undefined);
  const clearIModelToDeleteAndRefreshIModelGrid = () => {
    clearIModelToDelete();
    setRefreshKey((key) => (key + 1) % 3);
  };
  return (
    <>
      <IModelGrid
        key={refreshKey}
        accessToken={accessToken}
        projectId={projectId}
        onThumbnailClick={(imodel) => navigate?.(`imodel/${imodel.id}`)}
        iModelOptions={[
          {
            key: "delete",
            icon: <SvgDelete />,
            onClick: setIModelToDelete,
            children: "Delete iModel",
          },
        ]}
      />
      {iModelToDelete && (
        <DeleteIModel
          imodel={iModelToDelete}
          accessToken={accessToken}
          onClose={clearIModelToDelete}
          onError={clearIModelToDelete}
          onSuccess={clearIModelToDeleteAndRefreshIModelGrid}
        />
      )}
    </>
  );
};
