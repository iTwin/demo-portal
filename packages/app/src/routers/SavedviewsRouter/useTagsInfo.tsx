import React from "react";

import {
  TagSavedviewsAPI,
  TagUpdateSavedviewsAPI,
} from "../../api/savedviews/generated";
import { SavedviewsClient } from "../../api/savedviews/savedviewsClient";
import { useApiPrefix } from "../../api/useApiPrefix";

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
export const useTagsInfo = (
  projectId: string,
  iModelId: string | undefined,
  accessToken: string
) => {
  const urlPrefix = useApiPrefix();

  const [tags, setTags] = React.useState<TagSavedviewsAPI[]>();

  const fetchTags = React.useCallback(async () => {
    if (!accessToken || !projectId) {
      console.error("Test", accessToken, projectId);
      return;
    }
    const client = new SavedviewsClient(urlPrefix, accessToken);
    try {
      const { tags: fetchedTags } = await client.getAllTags(
        projectId,
        iModelId
      );
      setTags(fetchedTags);
    } catch (error) {
      console.error(error);
    }
  }, [accessToken, iModelId, projectId, urlPrefix]);

  const createTag = React.useCallback(
    async (displayName: string) => {
      if (accessToken && projectId) {
        const client = new SavedviewsClient(urlPrefix, accessToken);
        await client.createTag({ projectId, iModelId, displayName });
        return await fetchTags();
      }
      console.error("No Token or no tag", accessToken, projectId);
    },
    [accessToken, fetchTags, iModelId, projectId, urlPrefix]
  );

  const deleteTag = React.useCallback(
    async (id: string) => {
      if (accessToken && id) {
        const client = new SavedviewsClient(urlPrefix, accessToken);
        await client.deleteTag(id);
        return await fetchTags();
      }
    },
    [accessToken, fetchTags, urlPrefix]
  );

  const updateTag = React.useCallback(
    async (id: string, update: TagUpdateSavedviewsAPI) => {
      if (accessToken && id) {
        const client = new SavedviewsClient(urlPrefix, accessToken);
        await client.updateTag(id, update);
        return await fetchTags();
      }
    },
    [accessToken, fetchTags, urlPrefix]
  );

  return {
    tags,
    createTag,
    updateTag,
    deleteTag,
    fetchTags,
  };
};
