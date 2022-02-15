import { Title } from "@itwin/itwinui-react";
import { RouteComponentProps } from "@reach/router";
import React from "react";

import { GroupSavedviewsAPI } from "../../api/savedviews/generated";
import { GroupCreatePanel } from "./components/GroupsPanel";
import { GroupsTable } from "./components/GroupsTable";
import { skeletonRows } from "./components/SkeletonCell";
import { SubNav } from "./components/SubNav";
import { useGroupsInfo } from "./useGroupsInfo";

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
export interface GroupsProps extends RouteComponentProps {
  projectId?: string;
  iModelId?: string;
  accessToken: string;
}
export const Groups = ({
  iModelId = "",
  projectId = "",
  accessToken,
  navigate,
  path,
}: GroupsProps) => {
  const {
    groups,
    fetchGroups,
    createGroup,
    deleteGroup,
    updateGroup,
  } = useGroupsInfo(projectId, iModelId, accessToken);

  const displayGroups = React.useMemo(
    () => [...(groups ? groups : skeletonRows)],
    [groups]
  );

  const [activeGroup, setActiveGroup] = React.useState<GroupSavedviewsAPI>();

  React.useEffect(() => setActiveGroup(undefined), [groups]);
  React.useEffect(() => void fetchGroups(), [fetchGroups]);

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
        <GroupCreatePanel
          group={activeGroup}
          createFn={createGroup}
          updateFn={updateGroup}
        />
      </div>
      <div className="idp-scrolling-content idp-content-margins">
        <hr />
        <GroupsTable
          selected={activeGroup?.id}
          groups={displayGroups}
          deleteGroup={deleteGroup}
          selectFn={(group: GroupSavedviewsAPI) => {
            setActiveGroup((current) => {
              if (group.id === current?.id) {
                return undefined;
              }
              return group;
            });
          }}
        />
      </div>
    </div>
  );
};
