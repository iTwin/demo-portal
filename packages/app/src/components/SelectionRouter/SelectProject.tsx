/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  ApiOverrides,
  ProjectGrid,
  ProjectGridProps,
} from "@itwin/imodel-browser-react";
import {
  SvgCalendar,
  SvgList,
  SvgStarHollow,
} from "@itwin/itwinui-icons-react";
import {
  ButtonGroup,
  HorizontalTab,
  HorizontalTabs,
} from "@itwin/itwinui-react";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import { RouteComponentProps, useLocation } from "@reach/router";
import React, { useState } from "react";

import { useApiPrefix } from "../../api/useApiPrefix";
import { ai, trackEvent } from "../../services/telemetry";
import { useCreateIModelAction } from "../CRUDRouter/useCreateIModelAction";
import { useCreateProjectAction } from "../CRUDRouter/useCreateProjectAction";
import { useDeleteProjectAction } from "../CRUDRouter/useDeleteProjectAction";
import { useEditProjectAction } from "../CRUDRouter/useEditProjectAction";
import "./SelectProject.scss";

export interface SelectProjectProps
  extends RouteComponentProps<ProjectGridProps> {
  accessToken: string;
}

const PROJECT_TYPE_MAP = ["", "?recents", "?myprojects"];

const tabsWithIcons = [
  <HorizontalTab
    key="favorite"
    label="Favorite projects"
    startIcon={<SvgStarHollow />}
  />,
  <HorizontalTab
    key="recents"
    label="Recent projects"
    startIcon={<SvgCalendar />}
  />,
  <HorizontalTab key="all" label="My projects" startIcon={<SvgList />} />,
];

const SelectProject = ({
  accessToken,
  navigate,
  ...gridProps
}: SelectProjectProps) => {
  const location = useLocation();

  const [projectType, setProjectType] = useState(() =>
    PROJECT_TYPE_MAP.includes(location.search)
      ? PROJECT_TYPE_MAP.indexOf(location.search)
      : 0
  );
  React.useEffect(() => {
    const search = PROJECT_TYPE_MAP[projectType];
    if (location.search !== search) {
      void navigate?.(`./${search}`, {
        replace: true,
      });
    }
  }, [location.search, navigate, projectType]);
  const { createAction } = useCreateIModelAction({ navigate });
  const { createIconButton } = useCreateProjectAction({ navigate });
  const { editAction } = useEditProjectAction({ navigate });
  const { deleteDialog, deleteAction, refreshKey } = useDeleteProjectAction({
    accessToken,
  });

  const projectActions = React.useMemo(() => {
    return [createAction, editAction, deleteAction];
  }, [createAction, editAction, deleteAction]);

  const serverEnvironmentPrefix = useApiPrefix();
  const apiOverrides = React.useMemo<ApiOverrides>(
    () => ({ serverEnvironmentPrefix }),
    [serverEnvironmentPrefix]
  );
  return (
    <>
      <div className="scrolling-tab-container">
        <HorizontalTabs
          labels={tabsWithIcons}
          onTabSelected={setProjectType}
          activeIndex={projectType}
          type={"borderless"}
          contentClassName=" grid-holding-tab"
          tabsClassName="grid-holding-tabs"
        >
          <div className={"title-section"}>
            <ButtonGroup>{createIconButton}</ButtonGroup>
          </div>
          <div className={"scrolling-tab-content"}>
            <ProjectGrid
              accessToken={accessToken}
              requestType={
                projectType === 0
                  ? "favorites"
                  : projectType === 1
                  ? "recents"
                  : ""
              }
              onThumbnailClick={(project) => {
                trackEvent("ProjectClicked", { project: project.id });
                navigate?.(`project/${project.id}`);
              }}
              projectActions={projectActions}
              apiOverrides={apiOverrides}
              key={refreshKey}
              {...gridProps}
            />
          </div>
        </HorizontalTabs>
      </div>
      {deleteDialog}
    </>
  );
};

export default withAITracking(
  ai.reactPlugin,
  SelectProject,
  "SelectProject",
  "full-height-container"
);
