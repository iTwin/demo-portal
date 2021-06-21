/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  IModelGrid,
  IModelGridProps,
  ProjectFull,
} from "@itwin/imodel-browser-react";
import { ButtonGroup, Title } from "@itwin/itwinui-react";
import { RouteComponentProps } from "@reach/router";
import React from "react";

import { useApiData } from "../../api/useApiData";
import { useApiPrefix } from "../../api/useApiPrefix";
import { useCreateIModelAction } from "../IModelCRUDRouter/useCreateIModelAction";
import { useDeleteIModelAction } from "../IModelCRUDRouter/useDeleteIModelAction";
import { useEditIModelAction } from "../IModelCRUDRouter/useEditIModelAction";
import {
  SynchronizationCardContext,
  useSynchronizationCards,
} from "../SynchronizationRouter/useSynchronizationCards";
import { useSynchronizeIModelAction } from "../SynchronizationRouter/useSynchronizeIModelAction";
import { useViewIModelAction } from "../ViewRouter/useViewIModelAction";
import "./SelectIModel.scss";

interface GetProjectResult {
  project?: ProjectFull;
}

type IModelRouteProps = RouteComponentProps<
  IModelGridProps & {
    hideActions?: ("view" | "synchronize" | "edit" | "delete")[];
    email?: string;
  }
>;
export const SelectIModel = ({
  accessToken = "",
  projectId,
  navigate,
  hideActions,
  email,
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
  const serverEnvironmentPrefix = useApiPrefix();
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
        <SynchronizationCardContext.Provider value={{ email }}>
          <IModelGrid
            useIndividualState={useSynchronizationCards}
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
            apiOverrides={{ serverEnvironmentPrefix }}
            {...rest}
          />
          {deleteDialog}
        </SynchronizationCardContext.Provider>
      </div>
    </div>
  );
};
