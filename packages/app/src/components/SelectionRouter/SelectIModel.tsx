/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { IModelGrid, IModelGridProps } from "@itwin/imodel-browser-react";
import { ButtonGroup } from "@itwin/itwinui-react";
import { RouteComponentProps } from "@reach/router";
import React from "react";

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
import { SelectIModelTitle } from "./SelectIModelTitle";

type IModelRouteProps = RouteComponentProps<
  IModelGridProps & {
    hideActions?: ("view" | "synchronize" | "edit" | "delete")[];
    email?: string;
  }
>;
export const SelectIModel = ({
  accessToken = "",
  projectId = "",
  navigate,
  hideActions,
  email,
  ...rest
}: IModelRouteProps) => {
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
        <SelectIModelTitle accessToken={accessToken} projectId={projectId} />
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
