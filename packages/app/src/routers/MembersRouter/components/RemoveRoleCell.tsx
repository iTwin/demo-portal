/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { SvgRemove } from "@itwin/itwinui-icons-react";
import { IconButton } from "@itwin/itwinui-react";
import React from "react";

import { useApiPrefix } from "../../../api/useApiPrefix";
import { DeleteRole, DeleteRoleProps } from "./delete-role/DeleteRole";

type RemoveRoleCellProps = Required<
  Pick<DeleteRoleProps, "accessToken" | "role" | "onSuccess">
>;

export const RemoveRoleCell = ({
  role,
  accessToken,
  onSuccess,
}: RemoveRoleCellProps) => {
  const [showDialog, setShowDialog] = React.useState(false);
  const urlPrefix = useApiPrefix();
  const apiOverrides: DeleteRoleProps["apiOverrides"] = React.useMemo(
    () => ({ serverEnvironmentPrefix: urlPrefix }),
    [urlPrefix]
  );
  const showDeleteUserDialog = async () => {
    if (!role.projectId || !role.id) {
      return;
    }
    setShowDialog(true);
  };

  const close = async () => {
    setShowDialog(false);
  };

  return (
    <>
      <IconButton
        styleType="borderless"
        title="Remove member"
        onClick={showDeleteUserDialog}
      >
        <SvgRemove />
      </IconButton>
      {showDialog && (
        <DeleteRole
          apiOverrides={apiOverrides}
          accessToken={accessToken}
          role={role}
          onClose={close}
          onError={close}
          onSuccess={() => {
            setShowDialog(false);
            onSuccess();
          }}
        />
      )}
    </>
  );
};
