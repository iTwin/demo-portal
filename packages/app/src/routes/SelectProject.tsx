/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { ProjectGrid } from "@itwin/imodel-browser";
import { HorizontalTabs } from "@itwin/itwinui-react";
import { RouteComponentProps } from "@reach/router";
import React, { useState } from "react";

import "./SelectProject.scss";

export interface SelectProjectProps extends RouteComponentProps {
  accessToken: string;
}

export const SelectProject = ({
  accessToken,
  navigate,
}: SelectProjectProps) => {
  const [projectType, setProjectType] = useState(0);

  return (
    <div className="scrolling-tab-container">
      <HorizontalTabs
        labels={["Favorite projects", "Recents projects", "My projects"]}
        onTabSelected={setProjectType}
        activeIndex={projectType}
        contentClassName="scrolling-tab-content"
      >
        <ProjectGrid
          accessToken={accessToken}
          requestType={
            projectType === 0 ? "favorites" : projectType === 1 ? "recents" : ""
          }
          onThumbnailClick={(project) => navigate?.(`project/${project.id}`)}
        />
      </HorizontalTabs>
    </div>
  );
};
