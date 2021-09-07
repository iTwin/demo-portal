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
import { ITwinHeaderButton } from "./ITwinHeaderButton";
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

  const { section, iTwinId, iModelId } = useCommonPathPattern();
  const versionMatch = useMatch(
    "/:section/itwin/:iTwinId/imodel/:iModelId/version/:versionId"
  );

  const slimMatch = [
    !!useMatch("/view/itwin/:iTwinId/imodel/:iModelId"),
    !!useMatch("/view/itwin/:iTwinId/imodel/:iModelId/version/:versionId"),
  ].includes(true);

  const showITwinButton = isAuthenticated && iTwinId;
  const showIModelButton = isAuthenticated && iModelId && section !== "members";
  const showVersionButton = isAuthenticated && iModelId && section === "view";

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
              showITwinButton && (
                <ITwinHeaderButton
                  key="itwin"
                  iTwinId={iTwinId}
                  section={section}
                  accessToken={accessToken?.toTokenString()}
                  isActive={!iModelId || section === "members"}
                />
              )
            ),
            ...spreadIf(
              showIModelButton && (
                <IModelHeaderButton
                  key="iModel"
                  iModelId={iModelId}
                  iTwinId={iTwinId}
                  accessToken={accessToken?.toTokenString()}
                  section={section}
                />
              )
            ),
            ...spreadIf(
              showVersionButton && (
                <VersionHeaderButton
                  key="version"
                  iModelId={iModelId}
                  iTwinId={iTwinId}
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
