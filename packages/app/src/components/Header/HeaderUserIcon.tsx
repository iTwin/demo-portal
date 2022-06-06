/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import {
  Body,
  DropdownMenu,
  getUserColor,
  IconButton,
  MenuItem,
  Small,
  UserIcon,
  UserIconProps,
} from "@itwin/itwinui-react";
import React from "react";

import { getClaimsFromToken } from "../../services/auth/authUtil";
import "./HeaderUserIcon.scss";

interface HeaderUserIconProps {
  accessToken?: string;
  handleLogout?: () => void;
}

export const HeaderUserIcon = ({
  accessToken,
  handleLogout,
}: HeaderUserIconProps) => {
  const [userIconProps, setUserIconProps] = React.useState<
    Partial<UserIconProps>
  >({});
  const [claims, setClaims] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    setClaims(getClaimsFromToken(accessToken ?? "") ?? {});
  }, [accessToken]);
  React.useEffect(() => {
    setUserIconProps({
      abbreviation:
        (claims?.given_name?.toLocaleUpperCase()?.[0] ?? "") +
        (claims?.family_name?.toLocaleUpperCase()?.[0] ?? ""),
      backgroundColor: getUserColor(claims?.email ?? "Unknown"),
    });
  }, [claims]);

  return (
    <DropdownMenu
      menuItems={(close) => [
        <div key={"description"} className={"user-panel"}>
          <Body style={{ marginBottom: 5 }}>
            {claims.given_name ?? ""} {claims.family_name ?? ""}
          </Body>
          <Small>
            {claims.email ?? ""}
            {claims.org_name && <br />}
            {claims.org_name ?? ""}
          </Small>
        </div>,
        <MenuItem
          key={"logout"}
          onClick={() => {
            close();
            handleLogout?.();
          }}
        >
          Sign out
        </MenuItem>,
      ]}
    >
      <IconButton styleType={"borderless"}>
        <UserIcon
          size={"medium"}
          className={"user-icon-code-order-fix"}
          {...userIconProps}
        />
      </IconButton>
    </DropdownMenu>
  );
};
