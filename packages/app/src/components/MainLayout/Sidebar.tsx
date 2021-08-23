/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { Svg3D, SvgFlag, SvgSync, SvgUsers } from "@itwin/itwinui-icons-react";
import { SidenavButton, SideNavigation } from "@itwin/itwinui-react";
import { RouteComponentProps, Router } from "@reach/router";
import React from "react";

import { useCommonPathPattern } from "./useCommonPathPattern";

export const Sidebar = (props: RouteComponentProps) => {
  return (
    <Router>
      <RoutedSidebar {...props} default={true} />
    </Router>
  );
};

export const RoutedSidebar = ({ navigate }: RouteComponentProps) => {
  const { section, projectId, iModelId } = useCommonPathPattern();

  const projectPath = projectId ? `/project/${projectId}` : "";
  const iModelPath = iModelId ? `/imodel/${iModelId}` : "";
  const selectionPath = `${projectPath}${iModelPath}`;

  return (
    <SideNavigation
      expanderPlacement={"bottom"}
      items={[
        <SidenavButton
          key="view"
          startIcon={<Svg3D />}
          onClick={() => navigate?.(`/view${selectionPath}`)}
          isActive={section === "view"}
        >
          View iModel
        </SidenavButton>,
        <SidenavButton
          key="synchronize"
          startIcon={<SvgSync />}
          onClick={() => navigate?.(`/synchronize${selectionPath}`)}
          isActive={section === "synchronize"}
        >
          Synchronize
        </SidenavButton>,
        <SidenavButton
          key="manage-versions"
          startIcon={<SvgFlag />}
          onClick={() => navigate?.(`/manage-versions${selectionPath}`)}
          isActive={section === "manage-versions"}
        >
          Manage versions
        </SidenavButton>,
        <SidenavButton
          key="manage-members"
          startIcon={<SvgUsers />}
          onClick={() => navigate?.(`/members${selectionPath}`)}
          isActive={section === "members"}
        >
          Manage team members
        </SidenavButton>,
      ]}
    />
  );
};
