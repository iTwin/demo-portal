/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  Svg3D,
  SvgCloud,
  SvgCompare,
  SvgDatabase,
  SvgReports,
  SvgValidate,
} from "@itwin/itwinui-icons-react";
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
          key="validate"
          startIcon={<SvgValidate />}
          onClick={() => navigate?.(`/validate${selectionPath}`)}
          isActive={section === "validate"}
        >
          Validate iModel Data
        </SidenavButton>,
        <SidenavButton
          key="compare"
          startIcon={<SvgCompare />}
          onClick={() => navigate?.(`/compare${selectionPath}`)}
          isActive={section === "compare"}
        >
          Compare Versions
        </SidenavButton>,
        <SidenavButton
          key="query"
          startIcon={<SvgDatabase />}
          onClick={() => navigate?.(`/query${selectionPath}`)}
          isActive={section === "query"}
        >
          Query iModel
        </SidenavButton>,
        <SidenavButton
          key="report"
          startIcon={<SvgReports />}
          onClick={() => navigate?.(`/report${selectionPath}`)}
          isActive={section === "report"}
        >
          Generate Report
        </SidenavButton>,
        <SidenavButton
          key="aiml"
          startIcon={<SvgCloud />}
          onClick={() => navigate?.(`/ai-ml${selectionPath}`)}
          isActive={section === "ai-ml"}
        >
          Artificial Intelligence - Machine Learning
        </SidenavButton>,
      ]}
    />
  );
};
