/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { Title } from "@itwin/itwinui-react";
import { RouteComponentProps } from "@reach/router";
import React from "react";

import { TagSavedviewsAPI } from "../../api/savedviews/generated";
import { skeletonRows } from "./components/SkeletonCell";
import { SubNav } from "./components/SubNav";
import { TagPanel } from "./components/TagsPanel";
import { TagsTable } from "./components/TagsTable";
import { useTagsInfo } from "./useTagsInfo";

export interface TagsProps extends RouteComponentProps {
  projectId?: string;
  iModelId?: string;
  accessToken: string;
}
export const Tags = ({
  iModelId = "",
  projectId = "",
  accessToken,
  navigate,
  path,
}: TagsProps) => {
  const { tags, fetchTags, createTag, deleteTag, updateTag } = useTagsInfo(
    projectId,
    iModelId,
    accessToken
  );

  const displayTags = React.useMemo(() => [...(tags ? tags : skeletonRows)], [
    tags,
  ]);

  const [activeTag, setActiveTag] = React.useState<TagSavedviewsAPI>();

  React.useEffect(() => setActiveTag(undefined), [tags]);
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
        <TagPanel createFn={createTag} tag={activeTag} updateFn={updateTag} />
      </div>
      <div className="idp-scrolling-content idp-content-margins">
        <hr />
        <TagsTable
          selected={activeTag?.id}
          tags={displayTags}
          deleteFn={deleteTag}
          selectFn={(tag: TagSavedviewsAPI) => {
            setActiveTag((current) => {
              if (tag.id === current?.id) {
                return undefined;
              }
              return tag;
            });
          }}
        />
      </div>
    </div>
  );
};
