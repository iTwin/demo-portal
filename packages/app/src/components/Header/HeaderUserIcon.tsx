/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@bentley/itwin-client";
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

import "./HeaderUserIcon.scss";

interface HeaderUserIconProps {
  accessTokenObject?: AccessToken;
  handleLogout?: () => void;
}

export const HeaderUserIcon = ({
  accessTokenObject,
  handleLogout,
}: HeaderUserIconProps) => {
  const [userIconProps, setUserIconProps] = React.useState<
    Partial<UserIconProps>
  >({});
  const { email, profile, organization } =
    accessTokenObject?.getUserInfo() ?? {};

  React.useEffect(() => {
    setUserIconProps({
      abbreviation:
        (profile?.firstName.toLocaleUpperCase()?.[0] ?? "") +
        (profile?.lastName.toLocaleUpperCase()?.[0] ?? ""),
      backgroundColor: getUserColor(email?.id ?? "Unknown"),
    });
  }, [profile, email]);

  return (
    <DropdownMenu
      menuItems={(close) => [
        <div key={"description"} className={"user-panel"}>
          <Body style={{ marginBottom: 5 }}>
            {profile?.firstName ?? ""} {profile?.lastName ?? ""}
          </Body>
          <Small>
            {email?.id ?? ""}
            {organization?.name && <br />}
            {organization?.name ?? ""}
          </Small>
        </div>,
        <MenuItem
          key={"token"}
          onClick={() => {
            const token = accessTokenObject?.toTokenString() ?? "";
            navigator.clipboard.writeText(token).catch(() => {
              //Noop
            });
          }}
        >
          Copy token
        </MenuItem>,
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
