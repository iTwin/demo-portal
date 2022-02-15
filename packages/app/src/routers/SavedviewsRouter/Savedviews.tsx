/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { Title } from "@itwin/itwinui-react";
import { RouteComponentProps } from "@reach/router";
import React from "react";

import { SavedViewSavedviewsAPI } from "../../api/savedviews/generated";
import { SavedviewPanel } from "./components/SavedviewsPanel";
import { SavedviewsTable } from "./components/SavedviewsTable";
import { skeletonRows } from "./components/SkeletonCell";
import { SubNav } from "./components/SubNav";
import { useGroupsInfo } from "./useGroupsInfo";
import { useSavedviewsInfo } from "./useSavedviewsInfo";
import { useTagsInfo } from "./useTagsInfo";

export interface SavedviewsProps extends RouteComponentProps {
  projectId?: string;
  iModelId?: string;
  accessToken: string;
}
export const Savedviews = ({
  iModelId = "",
  projectId = "",
  accessToken,
  navigate,
  path,
}: SavedviewsProps) => {
  const {
    savedviews,
    fetchSavedviews,
    createSavedview,
    deleteSavedview,
    updateSavedview,
  } = useSavedviewsInfo(projectId, iModelId, accessToken);
  const { groups, fetchGroups } = useGroupsInfo(
    projectId,
    iModelId,
    accessToken
  );
  const { tags, fetchTags } = useTagsInfo(projectId, iModelId, accessToken);

  const displaySavedviews = React.useMemo(
    () => [...(savedviews ? savedviews : skeletonRows)],
    [savedviews]
  );

  const [activeSavedview, setActiveSavedview] = React.useState<
    SavedViewSavedviewsAPI
  >();

  React.useEffect(() => setActiveSavedview(undefined), [savedviews]);
  React.useEffect(() => void fetchSavedviews(), [fetchSavedviews]);
  React.useEffect(() => void fetchGroups(), [fetchGroups]);
  React.useEffect(() => void fetchTags(), [fetchTags]);

  return (
    <div className="idp-scrolling-container">
      <div className="idp-content-margins">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Title>Saved views</Title>
          <SubNav path={path} navigate={navigate} />
        </div>
        <SavedviewPanel
          tags={tags ?? []}
          groups={groups ?? []}
          savedview={activeSavedview}
          createFn={createSavedview}
          updateFn={updateSavedview}
        />
      </div>
      <div className="idp-scrolling-content idp-content-margins">
        <hr />
        <SavedviewsTable
          selected={activeSavedview?.id}
          groups={groups ?? []}
          savedviews={displaySavedviews}
          deleteFn={deleteSavedview}
          selectFn={(savedview: SavedViewSavedviewsAPI) => {
            setActiveSavedview((current) => {
              if (savedview.id === current?.id) {
                return undefined;
              }
              return savedview;
            });
          }}
        />
      </div>
    </div>
  );
};
