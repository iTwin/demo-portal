/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import {
  SavedViewCreateSavedviewsAPI,
  SavedViewSavedviewsAPI,
  SavedViewUpdateSavedviewsAPI,
} from "../../api/savedviews/generated";
import { SavedviewsClient } from "../../api/savedviews/savedviewsClient";
import { useApiPrefix } from "../../api/useApiPrefix";

export type CreateSavedViewPayload = Omit<
  SavedViewCreateSavedviewsAPI,
  "projectId" | "iModelId" | "savedViewData"
>;
export const useSavedviewsInfo = (
  projectId: string,
  iModelId: string | undefined,
  accessToken: string
) => {
  const urlPrefix = useApiPrefix();

  const [savedviews, setSavedviews] = React.useState<
    SavedViewSavedviewsAPI[]
  >();

  const fetchSavedviews = React.useCallback(async () => {
    if (!accessToken || !projectId) {
      console.error("Test", accessToken, projectId);
      return;
    }
    const client = new SavedviewsClient(urlPrefix, accessToken);
    try {
      const { savedViews: fetched } = await client.getAllSavedviews(
        projectId,
        iModelId
      );
      setSavedviews(fetched);
    } catch (error) {
      console.error(error);
    }
  }, [accessToken, iModelId, projectId, urlPrefix]);

  const createSavedview = React.useCallback(
    async (savedview: CreateSavedViewPayload) => {
      if (accessToken && projectId && savedview.displayName) {
        const client = new SavedviewsClient(urlPrefix, accessToken);
        await client.createSavedview({
          projectId,
          iModelId,
          savedViewData: {
            itwin3dView: { extents: [0, 0, 0], origin: [0, 0, 0] },
          },
          ...savedview,
        });
        return await fetchSavedviews();
      }
      console.error("Cant created", accessToken, projectId, savedview);
    },
    [accessToken, fetchSavedviews, iModelId, projectId, urlPrefix]
  );

  const deleteSavedview = React.useCallback(
    async (id: string) => {
      if (accessToken && id) {
        const client = new SavedviewsClient(urlPrefix, accessToken);
        await client.deleteSavedview(id);
        return await fetchSavedviews();
      }
    },
    [accessToken, fetchSavedviews, urlPrefix]
  );

  const updateSavedview = React.useCallback(
    async (id: string, update: SavedViewUpdateSavedviewsAPI) => {
      if (accessToken && id) {
        const client = new SavedviewsClient(urlPrefix, accessToken);
        await client.updateSavedview(id, update);
        return await fetchSavedviews();
      }
    },
    [accessToken, fetchSavedviews, urlPrefix]
  );

  return {
    savedviews,
    createSavedview,
    deleteSavedview,
    updateSavedview,
    fetchSavedviews,
  };
};
