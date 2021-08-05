/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import {
  ApiOverrides,
  IModelGrid,
  IModelGridProps,
} from "@itwin/imodel-browser-react";
import { ButtonGroup } from "@itwin/itwinui-react";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import { RouteComponentProps } from "@reach/router";
import React from "react";

import { useApiPrefix } from "../../api/useApiPrefix";
import { useDemoFlags } from "../../components/LaunchDarkly/LaunchDarklyProvider";
import { ai, trackEvent } from "../../services/telemetry";
import { useCreateIModelAction } from "../CRUDRouter/useCreateIModelAction";
import { useDeleteIModelAction } from "../CRUDRouter/useDeleteIModelAction";
import { useEditIModelAction } from "../CRUDRouter/useEditIModelAction";
import { useManageVersionsIModelAction } from "../ManageVersionsRouter/useManageVersionsIModelAction";
import { useSynchronizationCards } from "../SynchronizationRouter/useSynchronizationCards";
import { useSynchronizeIModelAction } from "../SynchronizationRouter/useSynchronizeIModelAction";
import { useViewIModelAction } from "../ViewRouter/useViewIModelAction";
import { SelectIModelTitle } from "./components/SelectIModelTitle";
import "./SelectIModel.scss";

type IModelRouteProps = RouteComponentProps<
  IModelGridProps & {
    hideActions?: (
      | "view"
      | "synchronize"
      | "edit"
      | "delete"
      | "manage-versions"
    )[];
  }
>;

const SelectIModel = ({
  accessToken = "",
  projectId = "",
  navigate,
  hideActions,
  ...rest
}: IModelRouteProps) => {
  const { deleteAction, deleteDialog, refreshKey } = useDeleteIModelAction({
    accessToken,
  });
  const { createIconButton } = useCreateIModelAction({ navigate });
  const { synchronizeAction } = useSynchronizeIModelAction();
  const { manageVersionsAction } = useManageVersionsIModelAction();
  const { editAction } = useEditIModelAction({ navigate });
  const { viewAction } = useViewIModelAction();
  const serverEnvironmentPrefix = useApiPrefix();
  const flags = useDemoFlags();

  const iModelActions = React.useMemo(() => {
    const actions: any[] = [
      viewAction,
      editAction,
      synchronizeAction,
      manageVersionsAction,
    ];

    if (flags["delete-imodel"]) {
      actions.push(deleteAction);
    }
    return actions.filter(
      (action) => !hideActions?.includes(action.key as any)
    );
  }, [
    deleteAction,
    editAction,
    flags,
    hideActions,
    manageVersionsAction,
    synchronizeAction,
    viewAction,
  ]);

  const apiOverrides = React.useMemo<ApiOverrides>(
    () => ({ serverEnvironmentPrefix }),
    [serverEnvironmentPrefix]
  );

  return (
    <div className="idp-scrolling-container select-imodel">
      <div className={"idp-content-margins"}>
        <SelectIModelTitle accessToken={accessToken} projectId={projectId} />
        <ButtonGroup>{createIconButton}</ButtonGroup>
      </div>
      <div className="idp-scrolling-content">
        <IModelGrid
          useIndividualState={useSynchronizationCards}
          key={refreshKey}
          accessToken={accessToken}
          projectId={projectId}
          onThumbnailClick={(imodel) => {
            trackEvent("iModelClicked", { iModel: imodel.id });
            navigate?.(`imodel/${imodel.id}`);
          }}
          iModelActions={iModelActions}
          apiOverrides={apiOverrides}
          {...rest}
        />
        {deleteDialog}
      </div>
    </div>
  );
};

export default withAITracking(
  ai.reactPlugin,
  SelectIModel,
  "SelectIModel",
  "full-height-container"
);
