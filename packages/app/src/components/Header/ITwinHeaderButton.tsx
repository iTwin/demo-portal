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
import "./ITwinHeaderButton.scss";

interface ITwinHeaderButtonProps {
  accessToken?: string;
  isActive?: boolean;
  iTwinId?: string;
  section?: string;
}
export const ITwinHeaderButton = ({
  iTwinId,
  isActive,
  section,
  accessToken,
}: ITwinHeaderButtonProps) => {
  const navigate = useNavigate();
  const {
    results: { project: iTwin },
  } = useApiData<{ project: ProjectFull }>({
    accessToken,
    url: `https://api.bentley.com/projects/${iTwinId}`,
  });
  const {
    results: { projects: iTwins },
  } = useApiData<{ projects: ProjectFull[] }>({
    accessToken,
    url: `https://api.bentley.com/projects/recents?$top=5`,
  });
  const menuItemsObject = !!iTwin?.displayName
    ? {
        menuItems: (close: () => void) => [
          ...(iTwins?.map((iTwin) => (
            <MenuItem
              key={iTwin.id}
              onClick={() => {
                close();
                void navigate(`/${section}/itwin/${iTwin.id}`);
              }}
            >
              {iTwin.displayName}
            </MenuItem>
          )) ?? []),
          <MenuItem
            key={"favorites"}
            onClick={() => {
              close();
              void navigate(`/${section}`);
            }}
            className={"select-other-itwin"}
          >
            All favorite iTwins...
          </MenuItem>,
          <MenuItem
            key={"recents"}
            onClick={() => {
              close();
              void navigate(`/${section}?recents`);
            }}
          >
            All recent iTwins...
          </MenuItem>,
          <MenuItem
            key={"others"}
            onClick={() => {
              close();
              void navigate(`/${section}?myitwins`);
            }}
          >
            All my iTwins...
          </MenuItem>,
        ],
      }
    : {};
  return (
    <HeaderButton
      key="itwin"
      name={iTwin ? iTwin?.displayName : "Fetching iTwins..."}
      description={iTwin?.projectNumber}
      className={classNames(!iTwin && "iui-skeleton")}
      isActive={!!iTwin?.displayName && isActive}
      {...menuItemsObject}
    />
  );
};
