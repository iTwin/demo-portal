/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { SvgCaretDownSmall, SvgSave } from "@itwin/itwinui-icons-react";
import {
  Checkbox,
  DropdownMenu,
  MenuItem,
  ProgressRadial,
} from "@itwin/itwinui-react";
import React from "react";

import { RoleProjectsAPI } from "../../../api/projects/generated";
import { ProjectsClient } from "../../../api/projects/projectsClient";
import { useApiPrefix } from "../../../api/useApiPrefix";
import {
  SkeletonCell,
  SkeletonCellProps,
} from "../../SynchronizationRouter/components/SkeletonCell";
import "./EditMemberRoleCell.scss";

export interface EditMemberRoleCellProps extends SkeletonCellProps {
  roles: RoleProjectsAPI[];
  projectId: string;
  accessToken: string;
  onDataUpdated(): Promise<void>;
  onError(errorString: string): void;
}

export const EditMemberRoleCell = (props: EditMemberRoleCellProps) => {
  const {
    value,
    row,
    roles,
    projectId,
    accessToken,
    onError,
    onDataUpdated,
  } = props;
  const urlPrefix = useApiPrefix();
  const propRoles = value as string[];
  const userId = row?.original?.userId;
  const [userRoles, setUserRoles] = React.useState<{
    [role: string]: boolean;
  }>({});
  const resetMenu = React.useCallback(() => {
    if (!propRoles) {
      setUserRoles((roles) => {
        if (Object.keys(roles).length > 0) {
          return {};
        }
        return roles;
      });
      return;
    }
    const currentRoles: { [role: string]: boolean } = {};
    for (const role of propRoles) {
      const projectRole = roles.find((r) => r.displayName === role);
      if (projectRole?.id) {
        currentRoles[projectRole.id] = true;
      } else {
        currentRoles[role] = true;
      }
    }
    setUserRoles(currentRoles);
  }, [propRoles, roles]);
  React.useEffect(() => resetMenu(), [resetMenu]);

  const [working, setWorking] = React.useState(false);
  const buildCheckbox = React.useCallback(
    (role: RoleProjectsAPI, key: string | number) => (
      <CheckBoxMenuItem
        key={key}
        onChange={(event) => {
          const {
            target: { checked, value },
          } = event;
          setUserRoles((roles) => ({
            ...roles,
            [value]: checked,
          }));
        }}
        value={role.id}
        disabled={working || role.id === "Team Member"}
        label={role.displayName}
        defaultChecked={userRoles[role?.id ?? ""]}
      />
    ),
    [userRoles, working]
  );
  const saveRoles = React.useCallback(
    async (close: () => void) => {
      if (!projectId) {
        close();
        return;
      }
      setWorking(true);
      const client = new ProjectsClient(urlPrefix, accessToken);
      try {
        const roleIds = [];
        for (const role in userRoles) {
          if (Object.prototype.hasOwnProperty.call(userRoles, role)) {
            const enabled = userRoles[role] && role !== "Team Member";
            if (enabled) {
              roleIds.push(role);
            }
          }
        }
        await client.updateProjectMemberRoles(projectId, userId, roleIds);
      } catch (error) {
        const errorResponse = error as Response;
        onError(await client.extractAPIErrorMessage(errorResponse));
      }
      setWorking(false);
      close();
      await onDataUpdated();
    },
    [
      accessToken,
      onDataUpdated,
      onError,
      projectId,
      urlPrefix,
      userId,
      userRoles,
    ]
  );

  return (
    <SkeletonCell {...props}>
      <DropdownMenu
        onHidden={resetMenu}
        menuItems={React.useCallback(
          (close) => [
            buildCheckbox(
              {
                id: "Team Member",
                displayName: "Team Member",
              },
              "Team Member"
            ),
            ...roles.map(buildCheckbox),
            <MenuItem
              key={"saveRoles"}
              //isSelected={true}
              icon={
                working ? (
                  <ProgressRadial size={"small"} indeterminate={true} />
                ) : (
                  <SvgSave />
                )
              }
              disabled={working}
              onClick={() => saveRoles(close)}
            >
              Apply roles changes
            </MenuItem>,
          ],
          [buildCheckbox, roles, saveRoles, working]
        )}
      >
        <div className={"edit-member-role-cell"}>
          <span title={(value ?? ([] as string[])).join("\n")}>
            {(value ?? []).join(", ")}
          </span>
          <SvgCaretDownSmall />
        </div>
      </DropdownMenu>
    </SkeletonCell>
  );
};

const CheckBoxMenuItem = ({
  key,
  disabled,
  onChange,
  value,
  label,
  defaultChecked,
}: {
  key: string | number;
  disabled: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string | undefined;
  label: string | undefined;
  defaultChecked: boolean;
}) => {
  const ref = React.useRef<HTMLInputElement>(null);
  return (
    <MenuItem
      onClick={() => ref.current?.click()}
      key={key}
      disabled={disabled}
    >
      <Checkbox
        ref={ref}
        style={{ pointerEvents: "none" }}
        onChange={onChange}
        value={value}
        disabled={disabled}
        label={label}
        defaultChecked={defaultChecked}
      />
    </MenuItem>
  );
};
