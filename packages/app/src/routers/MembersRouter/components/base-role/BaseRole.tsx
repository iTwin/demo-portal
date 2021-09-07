/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import {
  Button,
  Checkbox,
  InputGroup,
  LabeledInput,
  ProgressRadial,
  Title,
} from "@itwin/itwinui-react";
import React from "react";

import { RoleCreateProjectsAPI } from "../../../../api/projects/generated";
import { spreadIf } from "../../../../utils";
import "./BaseRole.scss";

export type BaseRole = RoleCreateProjectsAPI & {
  permissions?: string[];
};

export type PermissionOption = {
  /** string value of the permission this options toggles */
  permission: string;
};

export type BaseRoleProps = {
  /** Callback on canceled action. */
  onClose?: () => void;
  /** Callback on action. */
  onActionClick?: (role: {
    displayName: string;
    description: string;
    permissions: string[];
  }) => void;
  /** Object of string overrides. */
  stringsOverrides?: {
    /** The title of the page. */
    titleString?: string;
    /** Role name property. */
    displayNameString?: string;
    /** Role description property. */
    descriptionString?: string;
    /** Role permissions property. */
    permissionsString?: string;
    /** Role unknown permissions list title */
    unknownPermissionsString?: string;
    /** Confirm button string. */
    confirmButton?: string;
    /** Cancel button string. */
    cancelButton?: string;
    /** Error message when name is too long. */
    displayNameTooLong?: string;
    /** Error message when description is too long. */
    descriptionTooLong?: string;
    /** Warning message when unkown roles are present */
    unknownPermissionsWarning?: string;
  };
  /** If action is loading. */
  isLoading?: boolean;
  /** Initial role state used for update. */
  initialRole?: BaseRole;
  /** Permission options to display */
  permissionsOptions?: PermissionOption[];
};

const MAX_LENGTH = 255;

export function BaseRolePage(props: BaseRoleProps) {
  const {
    onClose,
    onActionClick,
    initialRole,
    isLoading = false,
    stringsOverrides,
    permissionsOptions = [],
  } = props;
  const [role, setRole] = React.useState<Required<BaseRole>>({
    displayName: initialRole?.displayName ?? "",
    description: initialRole?.description ?? "",
    permissions: initialRole?.permissions ?? [],
  });

  const initialPermissions = initialRole?.permissions;

  const updatedStrings = {
    titleString: "Create a role",
    displayNameString: "Name",
    descriptionString: "Description",
    confirmButton: "Create",
    cancelButton: "Cancel",
    displayNameTooLong: `The value exceeds allowed ${MAX_LENGTH} characters.`,
    descriptionTooLong: `The value exceeds allowed ${MAX_LENGTH} characters.`,
    permissionsString: "Permissions",
    unknownPermissionsString: "Unmanaged permissions",
    unknownPermissionsWarning:
      "This role contains permissions that are not managed by this demo portal, update to this role is not available.",
    ...stringsOverrides,
  };

  const onPropChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    setRole((prevState) => ({
      ...prevState,
      [name]: value ?? "",
    }));
  };
  const onCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value, checked },
    } = event;
    setRole((prevState) => ({
      ...prevState,
      permissions: [
        ...prevState.permissions.filter((permission) => permission !== value),
        ...spreadIf(checked && value),
      ],
    }));
  };

  const isPropertyInvalid = (value: string) => {
    return value.length > MAX_LENGTH;
  };

  const isDataValid = () => {
    return (
      !!role.displayName.length &&
      !isPropertyInvalid(role.displayName) &&
      !isPropertyInvalid(role.description)
    );
  };

  const isDataChanged = () => {
    return (
      role.displayName !== initialRole?.displayName ||
      role.description !== initialRole?.description ||
      role.permissions.length !== initialRole?.permissions?.length ||
      !role.permissions.every((permission) =>
        initialRole.permissions?.includes(permission)
      )
    );
  };

  const unknownPermissions = React.useMemo(
    () =>
      initialPermissions?.filter(
        (permission) =>
          !permissionsOptions.some((option) => option.permission === permission)
      ) ?? [],
    [initialPermissions, permissionsOptions]
  );
  const uiDisabled = unknownPermissions.length > 0;
  return (
    <div className="idp-role-base">
      <div>
        <Title>{updatedStrings.titleString}</Title>
        <div>
          <div className="inputs-container">
            <LabeledInput
              label={updatedStrings.displayNameString}
              inputClassName={"name-input"}
              name="displayName"
              setFocus={true}
              required={true}
              value={role.displayName}
              onChange={onPropChange}
              disabled={uiDisabled}
              message={
                isPropertyInvalid(role.displayName)
                  ? updatedStrings.displayNameTooLong
                  : undefined
              }
              status={
                isPropertyInvalid(role.displayName) ? "negative" : undefined
              }
              autoComplete="off"
            />
            <LabeledInput
              label={updatedStrings.descriptionString ?? "Description"}
              name="description"
              inputClassName={"description-input"}
              disabled={uiDisabled}
              value={role.description}
              onChange={onPropChange}
              message={
                isPropertyInvalid(role.description)
                  ? updatedStrings.descriptionTooLong
                  : undefined
              }
              status={
                isPropertyInvalid(role.description) ? "negative" : undefined
              }
              autoComplete="off"
            />
            {permissionsOptions.length > 0 && (
              <InputGroup label={updatedStrings.permissionsString}>
                {permissionsOptions.map((option) => (
                  <Checkbox
                    label={option.permission}
                    value={option.permission}
                    onChange={onCheckChange}
                    key={option.permission}
                    checked={role.permissions.includes(option.permission)}
                    disabled={uiDisabled}
                  />
                ))}
              </InputGroup>
            )}
            {unknownPermissions.length > 0 && (
              <InputGroup label={updatedStrings.unknownPermissionsString}>
                {unknownPermissions.map((permission) => (
                  <Checkbox
                    status={"warning"}
                    disabled={true}
                    label={permission}
                    value={permission}
                    key={permission}
                    checked={true}
                  />
                ))}
              </InputGroup>
            )}
          </div>
        </div>
      </div>
      <div className="button-bar">
        {uiDisabled && (
          <LabeledInput
            inputStyle={{ display: "none" }}
            message={updatedStrings.unknownPermissionsWarning}
            status={"warning"}
          />
        )}
        <div>
          <Button
            styleType="cta"
            disabled={
              !isDataChanged() || !isDataValid() || isLoading || uiDisabled
            }
            onClick={() =>
              onActionClick?.({
                ...role,
              })
            }
          >
            {updatedStrings.confirmButton}
          </Button>
          <Button onClick={onClose}>{updatedStrings.cancelButton}</Button>
        </div>
      </div>
      {isLoading && <OverlaySpinner />}
    </div>
  );
}

function OverlaySpinner() {
  return (
    <div className="overlay-container">
      <ProgressRadial indeterminate />
    </div>
  );
}
