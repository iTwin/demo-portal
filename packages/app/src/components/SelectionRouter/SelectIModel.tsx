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
import { useSynchronizeIModelAction } from "../SynchronizationRouter/useSynchronizeIModelAction";
import { useViewIModelAction } from "../ViewRouter/useViewIModelAction";
import "./SelectIModel.scss";

interface GetProjectResult {
  project?: ProjectFull;
}

type IModelRouteProps = RouteComponentProps<
  IModelGridProps & {
    hideActions?: ("view" | "synchronize" | "edit" | "delete")[];
  }
>;
export const SelectIModel = ({
  accessToken = "",
  projectId,
  navigate,
  hideActions,
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
  const { synchronizeAction } = useSynchronizeIModelAction();
  const { editAction } = useEditIModelAction({ navigate });
  const { viewAction } = useViewIModelAction();
  return (
    <div className="scrolling-tab-container">
      <div className={"title-section"}>
        <Title>
          {results?.project
            ? `iModels for ${results?.project?.displayName}`
            : "\u00a0"}
        </Title>
        <ButtonGroup>{createIconButton}</ButtonGroup>
      </div>
      <div className="scrolling-tab-content">
        <IModelGrid
          key={refreshKey}
          accessToken={accessToken}
          projectId={projectId}
          onThumbnailClick={(imodel) => navigate?.(`imodel/${imodel.id}`)}
          iModelActions={[
            viewAction,
            editAction,
            synchronizeAction,
            deleteAction,
          ].filter((action) => !hideActions?.includes(action.key as any))}
          {...rest}
        />
        {deleteDialog}
      </div>
    </div>
  );
};
