/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { ProjectFull } from "@itwin/imodel-browser-react";
import { SvgUsers } from "@itwin/itwinui-icons-react";
import { useNavigate } from "@reach/router";
import React from "react";

export const useMembersProjectAction = () => {
  const navigate = useNavigate();
  return {
    membersAction: React.useMemo(
      () => ({
        key: "members",
        icon: <SvgUsers />,
        onClick: (project: ProjectFull) =>
          void navigate(`/members/project/${project.id}`),
        children: "Manage team members",
      }),
      [navigate]
    ),
  };
};
