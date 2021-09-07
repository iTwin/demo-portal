/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { SvgEdit } from "@itwin/itwinui-icons-react";
import { IconButton, Table, Title } from "@itwin/itwinui-react";
import { RouteComponentProps } from "@reach/router";
import React from "react";

import {
  RoleProjectsAPI,
  TeamMemberProjectsAPI,
} from "../../api/projects/generated";
import { ProjectsClient } from "../../api/projects/projectsClient";
import { useApiPrefix } from "../../api/useApiPrefix";
import { CreateTypeFromInterface } from "../../utils";
import {
  SkeletonCell,
  skeletonRows,
} from "../SynchronizationRouter/components/SkeletonCell";
import { AddMemberInput } from "./components/AddMemberInput";
import { EditMemberRoleCell } from "./components/EditMemberRoleCell";
import { RemoveMemberCell } from "./components/RemoveMemberCell";
import "./Members.scss";

interface MembersProps extends RouteComponentProps {
  accessToken: string;
  projectId?: string;
}
type TeamMember = CreateTypeFromInterface<TeamMemberProjectsAPI>;
export const Members = ({ accessToken, projectId, navigate }: MembersProps) => {
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
      const errorResponse = error as Response;
      setError(await client.extractAPIErrorMessage(errorResponse));
    }
  }, [accessToken, projectId, urlPrefix]);
  React.useEffect(() => void fetchUsers(), [fetchUsers]);

  const [roles, setRoles] = React.useState<RoleProjectsAPI[]>(skeletonRows);
  const fetchRoles = React.useCallback(async () => {
    if (!projectId) {
      return;
    }
    const client = new ProjectsClient(urlPrefix, accessToken);
    try {
      const { roles } = await client.getProjectRoles(projectId);
      setRoles(roles ?? []);
    } catch (error) {
      const errorResponse = error as Response;
      setError(await client.extractAPIErrorMessage(errorResponse));
    }
  }, [accessToken, projectId, urlPrefix]);
  React.useEffect(() => void fetchRoles(), [fetchRoles]);

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
                  {
                    accessor: "roles",
                    Header: (
                      <div>
                        Roles{" "}
                        <IconButton
                          title={"Manage roles"}
                          styleType={"borderless"}
                          onClick={() => navigate?.("roles")}
                        >
                          <SvgEdit />
                        </IconButton>
                      </div>
                    ),
                    Cell: (props) => (
                      <EditMemberRoleCell
                        {...props}
                        projectId={projectId ?? ""}
                        accessToken={accessToken}
                        onDataUpdated={fetchUsers}
                        roles={roles}
                        onError={setError}
                      />
                    ),
                  },
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
            [accessToken, fetchUsers, navigate, projectId, roles]
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
