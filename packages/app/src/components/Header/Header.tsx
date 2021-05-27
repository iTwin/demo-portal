/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
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

import { useCommonPathPattern } from "../MainLayout/useCommonPathPattern";
import { HeaderUserIcon } from "./HeaderUserIcon";
import { IModelHeaderButton } from "./IModelHeaderButton";
import { ProjectHeaderButton } from "./ProjectHeaderButton";

interface HeaderProps {
  handleLogin: () => void;
  handleLogout: () => void;
  loggedIn: boolean;
  accessTokenObject?: AccessToken;
}

export const Header = (props: HeaderProps) => (
  <Router>
    <RoutedHeader {...props} default={true} />
  </Router>
);

type Falsy = false | 0 | "" | null | undefined;
/**
 * Spread the result to add `addIfTrue` to an array based on input "Truthiness",
 * will not create empty element in the array if `addIfTrue` is falsy.
 * @example [...spreadIf(shouldAdd && {thingTo: 'add'})]
 * @param addIfTrue Should be a shorthand that returns Falsy or something.
 * @returns Array with object in it if "Truthy", an empty array otherwise
 */
const spreadIf: <T>(addIfTrue: T | Falsy) => [T] | [] = (addIfTrue) =>
  addIfTrue ? [addIfTrue] : [];

const RoutedHeader = ({
  loggedIn,
  handleLogin,
  handleLogout,
  accessTokenObject,
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
      appLogo={<HeaderLogo logo={<SvgImodelHollow />}>iTwin Demo</HeaderLogo>}
      isSlim={!!slimMatch}
      breadcrumbs={
        <HeaderBreadcrumbs
          items={[
            ...spreadIf(
              projectId && (
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
              iModelId && (
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
        <HeaderUserIcon
          accessTokenObject={accessTokenObject}
          handleLogout={handleLogout}
        />
      }
    >
      {!loggedIn && (
        <Button onClick={handleLogin} styleType={"cta"} disabled={loggedIn}>
          {"Sign In"}
        </Button>
      )}
    </IuiHeader>
  );
};
