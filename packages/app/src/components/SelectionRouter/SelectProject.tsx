/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ProjectGrid, ProjectGridProps } from "@itwin/imodel-browser";
import {
  SvgCalendar,
  SvgList,
  SvgStarHollow,
} from "@itwin/itwinui-icons-react";
import { HorizontalTabs } from "@itwin/itwinui-react";
import { RouteComponentProps, useLocation } from "@reach/router";
import React, { useState } from "react";

import { useCreateIModelAction } from "../IModelCRUDRouter/useCreateIModelAction";
import "./SelectProject.scss";

export interface SelectProjectProps
  extends RouteComponentProps<ProjectGridProps> {
  accessToken: string;
}

const PROJECT_TYPE_MAP = ["", "?recents", "?myprojects"];
export const SelectProject = ({
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

  return (
    <div className="scrolling-tab-container">
      <HorizontalTabs
        labels={[
          <span className={"tab-with-icon"} key="favorite">
            <SvgStarHollow />
            <p>Favorite projects</p>
          </span>,
          <span className={"tab-with-icon"} key={"recents"}>
            <SvgCalendar />
            <p>Recent projects</p>
          </span>,
          <span className={"tab-with-icon"} key={"all"}>
            <SvgList />
            <p>My projects</p>
          </span>,
        ]}
        onTabSelected={setProjectType}
        activeIndex={projectType}
        type={"borderless"}
        contentClassName="scrolling-tab-content grid-holding-tab"
        tabsClassName="grid-holding-tabs"
      >
        <ProjectGrid
          accessToken={accessToken}
          requestType={
            projectType === 0 ? "favorites" : projectType === 1 ? "recents" : ""
          }
          onThumbnailClick={(project) => navigate?.(`project/${project.id}`)}
          projectActions={[createAction]}
          {...gridProps}
        />
      </HorizontalTabs>
    </div>
  );
};
