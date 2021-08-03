/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@bentley/itwin-client";
import { SvgImodelHollow, SvgMoon, SvgSun } from "@itwin/itwinui-icons-react";
import {
  Button,
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

interface HeaderProps {
  handleLogin: () => void;
  handleLogout: () => void;
  loggedIn: boolean;
  isLoggingIn: boolean;
  accessTokenObject?: AccessToken;
}

export const Header = (props: HeaderProps) => (
  <Router>
    <RoutedHeader {...props} default={true} />
  </Router>
);

const RoutedHeader = ({
  isLoggingIn,
  loggedIn,
  handleLogin,
  handleLogout,
  accessTokenObject,
  navigate,
}: RouteComponentProps<HeaderProps>) => {
  const [theme, setTheme] = React.useState<ThemeType>("light");
  useTheme(theme);
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const { section, projectId, iModelId } = useCommonPathPattern();
  const slimMatch = !!useMatch("/view/project/:projectId/imodel/:iModelId");

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
              loggedIn && projectId && (
                <ProjectHeaderButton
                  key="project"
                  projectId={projectId}
                  section={section}
                  accessToken={accessTokenObject?.toTokenString()}
                  isActive={!iModelId}
                />
              )
            ),
            ...spreadIf(
              loggedIn && iModelId && (
                <IModelHeaderButton
                  key="iModel"
                  iModelId={iModelId}
                  projectId={projectId}
                  accessToken={accessTokenObject?.toTokenString()}
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
        loggedIn && (
          <HeaderUserIcon
            accessTokenObject={accessTokenObject}
            handleLogout={handleLogout}
          />
        )
      }
    >
      {!loggedIn && !isLoggingIn && (
        <Button
          onClick={handleLogin}
          styleType={"cta"}
          disabled={loggedIn}
          style={{
            height: 38,
            maxHeight: "calc(100% - 4px)",
          }}
        >
          {"Sign In"}
        </Button>
      )}
    </IuiHeader>
  );
};
