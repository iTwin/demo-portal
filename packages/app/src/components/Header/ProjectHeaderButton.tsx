/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { ProjectFull } from "@itwin/imodel-browser-react";
import { HeaderButton, MenuItem } from "@itwin/itwinui-react";
import { useNavigate } from "@reach/router";
import classNames from "classnames";
import React from "react";

import { useApiData } from "../../api/useApiData";
import "./ProjectHeaderButton.scss";

interface ProjectHeaderButtonProps {
  accessToken?: string;
  isActive?: boolean;
  projectId?: string;
  section?: string;
}
export const ProjectHeaderButton = ({
  projectId,
  isActive,
  section,
  accessToken,
}: ProjectHeaderButtonProps) => {
  const navigate = useNavigate();
  const {
    results: { project },
  } = useApiData<{ project: ProjectFull }>({
    accessToken,
    url: `https://api.bentley.com/projects/${projectId}`,
  });
  const {
    results: { projects },
  } = useApiData<{ projects: ProjectFull[] }>({
    accessToken,
    url: `https://api.bentley.com/projects/recents?$top=5`,
  });
  const menuItemsObject = !!project?.displayName
    ? {
        menuItems: (close: () => void) => [
          ...(projects?.map((project) => (
            <MenuItem
              key={project.id}
              onClick={() => {
                close();
                void navigate(`/${section}/project/${project.id}`);
              }}
            >
              {project.displayName}
            </MenuItem>
          )) ?? []),
          <MenuItem
            key={"favorites"}
            onClick={() => {
              close();
              void navigate(`/${section}`);
            }}
            className={"select-other-project"}
          >
            All favorite projects...
          </MenuItem>,
          <MenuItem
            key={"recents"}
            onClick={() => {
              close();
              void navigate(`/${section}?recents`);
            }}
          >
            All recent projects...
          </MenuItem>,
          <MenuItem
            key={"others"}
            onClick={() => {
              close();
              void navigate(`/${section}?myprojects`);
            }}
          >
            All my projects...
          </MenuItem>,
        ],
      }
    : {};
  return (
    <HeaderButton
      key="project"
      name={project ? project?.displayName : "Fetching projects"}
      description={project?.projectNumber}
      className={classNames(!project && "iui-skeleton")}
      isActive={!!project?.displayName && isActive}
      {...menuItemsObject}
    />
  );
};
