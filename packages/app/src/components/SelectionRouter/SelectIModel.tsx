/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  IModelGrid,
  IModelGridProps,
  ProjectFull,
} from "@itwin/imodel-browser";
import { ButtonGroup, Title } from "@itwin/itwinui-react";
import { RouteComponentProps } from "@reach/router";
import React from "react";

import { useApiData } from "../../api/useApiData";
import { useCreateIModelAction } from "../IModelCRUDRouter/useCreateIModelAction";
import { useDeleteIModelAction } from "../IModelCRUDRouter/useDeleteIModelAction";
import { useEditIModelAction } from "../IModelCRUDRouter/useEditIModelAction";
import "./SelectIModel.scss";

interface GetProjectResult {
  project?: ProjectFull;
}

type IModelRouteProps = RouteComponentProps<IModelGridProps>;
export const SelectIModel = ({
  accessToken = "",
  projectId,
  navigate,
  ...rest
}: IModelRouteProps) => {
  const { results } = useApiData<GetProjectResult>({
    accessToken,
    url: `https://api.bentley.com/projects/${projectId}`,
  });
  const { deleteAction, deleteDialog, refreshKey } = useDeleteIModelAction({
    accessToken,
  });
  const { createIconButton } = useCreateIModelAction({ navigate });
  const { editAction } = useEditIModelAction({ navigate });
  return (
    <>
      <div className={"title-section"}>
        <Title>
          {results?.project
            ? `iModels for ${results?.project?.displayName}`
            : "\u00a0"}
        </Title>
        <ButtonGroup>{createIconButton}</ButtonGroup>
      </div>
      <IModelGrid
        key={refreshKey}
        accessToken={accessToken}
        projectId={projectId}
        onThumbnailClick={(imodel) => navigate?.(`imodel/${imodel.id}`)}
        iModelActions={[editAction, deleteAction]}
        {...rest}
      />
      {deleteDialog}
    </>
  );
};
