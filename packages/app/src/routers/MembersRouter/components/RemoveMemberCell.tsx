/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { SvgRemove } from "@itwin/itwinui-icons-react";
import { IconButton, toaster } from "@itwin/itwinui-react";
import React from "react";

import { ProjectsClient } from "../../../api/projects/projectsClient";
import { useApiPrefix } from "../../../api/useApiPrefix";

interface RemoveMemberCellProps {
  userId: string;
  projectId: string | undefined;
  accessToken: string;
  onSuccess(): Promise<void>;
}

export const RemoveMemberCell = ({
  userId,
  projectId,
  accessToken,
  onSuccess,
}: RemoveMemberCellProps) => {
  const urlPrefix = useApiPrefix();
  const [working, setWorking] = React.useState(false);
  const removeUser = React.useCallback(async () => {
    if (!projectId) {
      return;
    }
    setWorking(true);
    const client = new ProjectsClient(urlPrefix, accessToken);
    try {
      await client.removeProjectMember(projectId, userId);
      await onSuccess();
    } catch (error) {
      toaster.negative(await client.extractAPIErrorMessage(error), {
        hasCloseButton: true,
      });
    }
    setWorking(false);
  }, [projectId, urlPrefix, accessToken, onSuccess, userId]);
  return (
    <IconButton
      styleType="borderless"
      title="Remove member"
      disabled={working}
      onClick={removeUser}
    >
      <SvgRemove />
    </IconButton>
  );
};
