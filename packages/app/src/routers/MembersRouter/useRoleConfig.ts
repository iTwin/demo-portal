/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import { useApiPrefix } from "../../api/useApiPrefix";
import { BaseRoleProps } from "./components/base-role/BaseRole";
import { CreateRoleProps } from "./components/create-role/CreateRole";

export const useRoleConfig = () => {
  const serverEnvironmentPrefix = useApiPrefix();
  const apiOverrides = React.useMemo<CreateRoleProps["apiOverrides"]>(
    () => ({ serverEnvironmentPrefix }),
    [serverEnvironmentPrefix]
  );
  // Using array of object in case we want to add description to the permissions
  const permissionsOptions = React.useMemo<BaseRoleProps["permissionsOptions"]>(
    () => [
      {
        permission: "administration_invite_member",
      },
      {
        permission: "administration_remove_member",
      },
      {
        permission: "administration_manage_roles",
      },
      {
        permission: "imodels_read",
      },
      {
        permission: "imodels_webview",
      },
      {
        permission: "imodels_manage",
      },
      {
        permission: "imodels_write",
      },
      {
        permission: "imodels_delete",
      },
      {
        permission: "storage_read",
      },
      {
        permission: "storage_write",
      },
      {
        permission: "storage_delete",
      },
    ],
    []
  );
  return {
    apiOverrides,
    permissionsOptions,
  };
};
