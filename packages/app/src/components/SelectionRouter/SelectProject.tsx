/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ProjectGrid, ProjectGridProps } from "@itwin/imodel-browser";
import { HorizontalTabs, Title } from "@itwin/itwinui-react";
import { RouteComponentProps, useLocation } from "@reach/router";
import React, { useState } from "react";

import { useApiPrefix } from "../../api/useApiPrefix";
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
  const serverEnvironmentPrefix = useApiPrefix();
  return (
    <div className="scrolling-tab-container">
      <div className={"title-section"}>
        <Title>Projects</Title>
      </div>

      <HorizontalTabs
        labels={["Favorite projects", "Recents projects", "My projects"]}
        onTabSelected={setProjectType}
        activeIndex={projectType}
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
          apiOverrides={{ serverEnvironmentPrefix }}
          {...gridProps}
        />
      </HorizontalTabs>
    </div>
  );
};
