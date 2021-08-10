/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@bentley/itwin-client";
import { SvgImodelHollow, SvgMoon, SvgSun } from "@itwin/itwinui-icons-react";
import {
  Header as IuiHeader,
  HeaderBreadcrumbs,
  HeaderLogo,
  IconButton,
  ThemeType,
  useTheme,
} from "@itwin/itwinui-react";
import { RouteComponentProps, Router, useMatch } from "@reach/router";
import React from "react";

import { spreadIf } from "../../utils";
import { useCommonPathPattern } from "../MainLayout/useCommonPathPattern";
import { HeaderUserIcon } from "./HeaderUserIcon";
import { IModelHeaderButton } from "./IModelHeaderButton";
import { ProjectHeaderButton } from "./ProjectHeaderButton";
import { VersionHeaderButton } from "./VersionHeaderButton";

interface HeaderProps {
  isAuthenticated: boolean;
  accessToken?: AccessToken;
  handleLogout: () => void;
}

export const Header = (props: HeaderProps) => (
  <Router>
    <RoutedHeader {...props} default={true} />
  </Router>
);

const RoutedHeader = ({
  isAuthenticated,
  accessToken,
  handleLogout,
  navigate,
}: RouteComponentProps<HeaderProps>) => {
  const [theme, setTheme] = React.useState<ThemeType>(
    (localStorage.getItem("THEME") as ThemeType) ?? "light"
  );
  useTheme(theme);
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("THEME", theme);
  }, [theme]);

  const { section, projectId, iModelId } = useCommonPathPattern();
  const versionMatch = useMatch(
    "/:section/project/:projectId/imodel/:iModelId/version/:versionId"
  );

  const slimMatch = [
    !!useMatch("/view/project/:projectId/imodel/:iModelId"),
    !!useMatch("/view/project/:projectId/imodel/:iModelId/version/:versionId"),
  ].includes(true);

  return (
    <IuiHeader
      appLogo={
        <HeaderLogo logo={<SvgImodelHollow />} onClick={() => navigate?.("/")}>
          iTwin Demo
        </HeaderLogo>
      }
      isSlim={!!slimMatch}
      breadcrumbs={
        <HeaderBreadcrumbs
          items={[
            ...spreadIf(
              isAuthenticated && projectId && (
                <ProjectHeaderButton
                  key="project"
                  projectId={projectId}
                  section={section}
                  accessToken={accessToken?.toTokenString()}
                  isActive={!iModelId}
                />
              )
            ),
            ...spreadIf(
              isAuthenticated && iModelId && (
                <IModelHeaderButton
                  key="iModel"
                  iModelId={iModelId}
                  projectId={projectId}
                  accessToken={accessToken?.toTokenString()}
                  section={section}
                />
              )
            ),
            ...spreadIf(
              isAuthenticated && iModelId && section === "view" && (
                <VersionHeaderButton
                  key="version"
                  iModelId={iModelId}
                  projectId={projectId}
                  versionId={versionMatch?.versionId}
                  accessToken={accessToken?.toTokenString()}
                  section={section}
                />
              )
            ),
          ]}
        />
      }
      actions={[
        <IconButton
          key="theme"
          styleType="borderless"
          onClick={() =>
            setTheme((theme) => (theme === "light" ? "dark" : "light"))
          }
        >
          {theme === "light" ? <SvgMoon /> : <SvgSun />}
        </IconButton>,
      ]}
      userIcon={
        isAuthenticated && (
          <HeaderUserIcon
            accessTokenObject={accessToken}
            handleLogout={handleLogout}
          />
        )
      }
    />
  );
};
