/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { Modal } from "@itwin/itwinui-react";
import React from "react";

import {
  ImageUpdateSavedviewsAPI,
  ViewSavedviewsAPI,
} from "../../../api/savedviews/generated";
import { useGroupsInfo } from "../useGroupsInfo";
import {
  CreateSavedViewPayload,
  useSavedviewsInfo,
} from "../useSavedviewsInfo";
import { useTagsInfo } from "../useTagsInfo";
import { SavedviewPanel } from "./SavedviewsPanel";

export interface SavedviewsModalProps {
  projectId: string;
  iModelId: string | undefined;
  accessToken: string;
  view?: ViewSavedviewsAPI;
  image?: string;
  complete: () => void;
}

export const SavedViewsModal = ({
  projectId,
  iModelId,
  accessToken,
  view,
  image,
  complete,
}: SavedviewsModalProps) => {
  const { createSavedview } = useSavedviewsInfo(
    projectId,
    iModelId,
    accessToken
  );
  const { groups, fetchGroups } = useGroupsInfo(
    projectId,
    iModelId,
    accessToken
  );
  const { tags, fetchTags } = useTagsInfo(projectId, iModelId, accessToken);
  React.useEffect(() => void fetchGroups(), [fetchGroups]);
  React.useEffect(() => void fetchTags(), [fetchTags]);

  const createFn = React.useCallback(
    async (
      savedview: CreateSavedViewPayload,
      image?: ImageUpdateSavedviewsAPI
    ) => {
      return createSavedview(savedview, image).then(complete);
    },
    [createSavedview, complete]
  );

  return (
    <Modal
      title={"Create saved view"}
      isOpen={!!view}
      onClose={complete}
      style={{
        maxHeight: "90vh",
        overflow: "auto",
        borderRadius: 0, //Otherwise, the overflow flickers ?!?
      }}
    >
      <SavedviewPanel
        createFn={createFn}
        groups={groups ?? []}
        tags={tags ?? []}
        view={view}
        image={image}
        onCancel={complete}
      />
    </Modal>
  );
};
