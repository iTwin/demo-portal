/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { SvgAdd, SvgChevronLeft, SvgEdit } from "@itwin/itwinui-icons-react";
import {
  Button,
  ButtonGroup,
  IconButton,
  Table,
  Title,
} from "@itwin/itwinui-react";
import { RouteComponentProps } from "@reach/router";
import React from "react";

import { RoleProjectsAPI } from "../../api/projects/generated";
import { ProjectsClient } from "../../api/projects/projectsClient";
import { useApiPrefix } from "../../api/useApiPrefix";
import { CreateTypeFromInterface } from "../../utils";
import {
  SkeletonCell,
  skeletonRows,
} from "../SynchronizationRouter/components/SkeletonCell";
import { RemoveRoleCell } from "./components/RemoveRoleCell";
import "./Members.scss";

interface RolesProps extends RouteComponentProps {
  accessToken: string;
  iTwinId?: string;
}
type Role = CreateTypeFromInterface<RoleProjectsAPI>;
export const Roles = ({ accessToken, iTwinId, navigate }: RolesProps) => {
  const urlPrefix = useApiPrefix();

  const [roles, setRoles] = React.useState<Role[]>(skeletonRows);
  const [error, setError] = React.useState("");
  const fetchRoles = React.useCallback(async () => {
    if (!iTwinId) {
      return;
    }
    const client = new ProjectsClient(urlPrefix, accessToken);
    try {
      const { roles } = await client.getProjectRoles(iTwinId);
      setRoles(roles ?? []);
    } catch (error) {
      const errorResponse = error as Response;
      setError(await client.extractAPIErrorMessage(errorResponse));
    }
  }, [accessToken, iTwinId, urlPrefix]);
  React.useEffect(() => void fetchRoles(), [fetchRoles]);

  return (
    <div className="idp-scrolling-container members-management">
      <div className="idp-content-margins">
        <Title>
          <IconButton styleType={"borderless"} onClick={() => navigate?.("..")}>
            <SvgChevronLeft />
          </IconButton>
          iTwin roles management
        </Title>
      </div>
      <div className="idp-content-margins">
        <Button startIcon={<SvgAdd />} onClick={() => navigate?.("create")}>
          Create iTwin role
        </Button>
      </div>
      <div className="idp-content-margins idp-scrolling-content">
        <Table<Role>
          isSortable={true}
          expanderCell={() => null}
          data={roles}
          columns={React.useMemo(
            () => [
              {
                Header: "Table",
                columns: [
                  {
                    accessor: "displayName",
                    Cell: SkeletonCell,
                    Header: "Role",
                  },
                  {
                    accessor: "description",
                    Cell: SkeletonCell,
                    Header: "Description",
                  },
                  {
                    accessor: "permissions",
                    Cell: (props) => (
                      <SkeletonCell {...props}>
                        <span
                          title={(props.value ?? ([] as string[])).join("\n")}
                        >
                          {(props.value ?? []).join(", ")}
                        </span>
                      </SkeletonCell>
                    ),
                    Header: "Permissions",
                  },
                  {
                    id: "actions",
                    accessor: "id",
                    maxWidth: 125,
                    disableSortBy: true,
                    Cell: (props) => {
                      const role = React.useMemo(
                        () => ({
                          id: props.row.original?.id ?? "",
                          projectId: iTwinId ?? "",
                          displayName: props.row.original.displayName,
                        }),
                        [props.row.original.displayName, props.row.original.id]
                      );
                      return (
                        <ButtonGroup>
                          <IconButton
                            styleType={"borderless"}
                            onClick={() => navigate?.(props.value ?? "")}
                          >
                            <SvgEdit />
                          </IconButton>
                          <RemoveRoleCell
                            role={role}
                            accessToken={accessToken}
                            onSuccess={fetchRoles}
                          />
                        </ButtonGroup>
                      );
                    },
                  },
                ],
              },
            ],
            [accessToken, fetchRoles, navigate, iTwinId]
          )}
          emptyTableContent={error || "No iTwin role, add one above!"}
        />
      </div>
    </div>
  );
};
