import React from "react";

import {
  GroupSavedviewsAPI,
  GroupUpdateSavedviewsAPI,
} from "../../api/savedviews/generated";
import { SavedviewsClient } from "../../api/savedviews/savedviewsClient";
import { useApiPrefix } from "../../api/useApiPrefix";

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
export const useGroupsInfo = (
  projectId: string,
  iModelId: string | undefined,
  accessToken: string
) => {
  const urlPrefix = useApiPrefix();

  const [groups, setGroups] = React.useState<GroupSavedviewsAPI[]>();

  const fetchGroups = React.useCallback(async () => {
    if (!accessToken || !projectId) {
      console.error("Test", accessToken, projectId);
      return;
    }
    const client = new SavedviewsClient(urlPrefix, accessToken);
    try {
      const { groups: fetchedGroups } = await client.getAllGroups(
        projectId,
        iModelId
      );
      setGroups(fetchedGroups);
    } catch (error) {
      console.error(error);
    }
  }, [accessToken, iModelId, projectId, urlPrefix]);

  const createGroup = React.useCallback(
    async (displayName: string, shared = false) => {
      if (accessToken && projectId) {
        const client = new SavedviewsClient(urlPrefix, accessToken);
        await client.createGroup({ projectId, iModelId, displayName, shared });
        return await fetchGroups();
      }
      console.error("No Token or no group", accessToken, projectId);
    },
    [accessToken, fetchGroups, iModelId, projectId, urlPrefix]
  );

  const deleteGroup = React.useCallback(
    async (id: string) => {
      if (accessToken && id) {
        const client = new SavedviewsClient(urlPrefix, accessToken);
        await client.deleteGroup(id);
        return await fetchGroups();
      }
    },
    [accessToken, fetchGroups, urlPrefix]
  );

  const updateGroup = React.useCallback(
    async (id: string, update: GroupUpdateSavedviewsAPI) => {
      if (accessToken && id) {
        const client = new SavedviewsClient(urlPrefix, accessToken);
        await client.updateGroup(id, update);
        return await fetchGroups();
      }
    },
    [accessToken, fetchGroups, urlPrefix]
  );

  return {
    groups,
    createGroup,
    deleteGroup,
    fetchGroups,
    updateGroup,
  };
};
