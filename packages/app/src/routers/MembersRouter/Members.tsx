/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { Table, Title } from "@itwin/itwinui-react";
import { RouteComponentProps } from "@reach/router";
import React from "react";

import { TeamMemberProjectsAPI } from "../../api/projects/generated";
import { ProjectsClient } from "../../api/projects/projectsClient";
import { useApiPrefix } from "../../api/useApiPrefix";
import { CreateTypeFromInterface } from "../../utils";
import {
  SkeletonCell,
  skeletonRows,
} from "../SynchronizationRouter/components/SkeletonCell";
import { AddMemberInput } from "./components/AddMemberInput";
import { RemoveMemberCell } from "./components/RemoveMemberCell";
import "./Members.scss";

interface MembersProps extends RouteComponentProps {
  accessToken: string;
  projectId?: string;
}
type TeamMember = CreateTypeFromInterface<TeamMemberProjectsAPI>;
export const Members = ({ accessToken, projectId }: MembersProps) => {
  const urlPrefix = useApiPrefix();

  const [users, setUsers] = React.useState<TeamMember[]>(skeletonRows);
  const [error, setError] = React.useState("");
  const fetchUsers = React.useCallback(async () => {
    if (!projectId) {
      return;
    }
    const client = new ProjectsClient(urlPrefix, accessToken);
    try {
      const { members } = await client.getProjectUsers(projectId);
      setUsers(members ?? []);
    } catch (error) {
      setError(await client.extractAPIErrorMessage(error));
    }
  }, [accessToken, projectId, urlPrefix]);
  React.useEffect(() => void fetchUsers(), [fetchUsers]);

  return (
    <div className="idp-scrolling-container members-management">
      <div className="idp-content-margins">
        <Title>Member management</Title>
      </div>
      <div className="idp-content-margins">
        <AddMemberInput
          accessToken={accessToken}
          projectId={projectId}
          onSuccess={fetchUsers}
        />
      </div>
      <div className="idp-content-margins idp-scrolling-content">
        <Table
          isSortable={true}
          expanderCell={() => null}
          data={users}
          columns={React.useMemo(
            () => [
              {
                Header: "Table",
                columns: [
                  { accessor: "email", Cell: SkeletonCell, Header: "Email" },
                  {
                    accessor: "givenName",
                    Cell: SkeletonCell,
                    Header: "Given name",
                  },
                  {
                    accessor: "surname",
                    Cell: SkeletonCell,
                    Header: "Surname",
                  },
                  {
                    accessor: "organization",
                    Cell: SkeletonCell,
                    Header: "Organization",
                  },
                  { accessor: "roles", Cell: SkeletonCell, Header: "Roles" },
                  {
                    id: "actions",
                    accessor: "userId",
                    maxWidth: 75,
                    disableSortBy: true,
                    Cell: (props) => {
                      return (
                        <RemoveMemberCell
                          userId={props.value}
                          projectId={projectId}
                          accessToken={accessToken}
                          onSuccess={fetchUsers}
                        />
                      );
                    },
                  },
                ],
              },
            ],
            [accessToken, fetchUsers, projectId]
          )}
          emptyTableContent={
            error ||
            "No team member, add one above! (Project Creator is never listed, unless added manually)"
          }
        />
      </div>
    </div>
  );
};
