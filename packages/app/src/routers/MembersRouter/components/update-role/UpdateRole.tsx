/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { toaster } from "@itwin/itwinui-react";
import React from "react";

import { RoleProjectsAPI } from "../../../../api/projects/generated";
import { ProjectsClient } from "../../../../api/projects/projectsClient";
import {
  BaseRole,
  BaseRolePage,
  PermissionOption,
} from "../base-role/BaseRole";

export type UpdateRoleProps = {
  /** Bearer access token with scope `projects:modify`. */
  accessToken: string;
  /** Object that configures different overrides for the API. */
  apiOverrides?: { serverEnvironmentPrefix?: "dev" | "qa" | "" };
  /** Callback on canceled action. */
  onClose?: () => void;
  /** Callback on failed update. */
  onError?: (
    error: { error: { code?: string; message?: string } } | any
  ) => void;
  /** Callback on successful update. */
  onSuccess?: (updatedRole: { role?: RoleProjectsAPI }) => void;
  /** Object of string overrides. */
  stringsOverrides?: {
    /** Displayed after successful update. */
    successMessage?: string;
    /** Displayed after failed update. */
    errorMessage?: string;
    /** Displayed after failed create because of the duplicate name. */
    errorMessageRoleExists?: string;
    /** The title of the page. */
    titleString?: string;
    /** Role name property. */
    displayNameString?: string;
    /** Role description property. */
    descriptionString?: string;
    /** Confirm button string. */
    confirmButton?: string;
    /** Cancel button string. */
    cancelButton?: string;
    /** Error message when name is too long. */
    displayNameTooLong?: string;
    /** Error message when description is too long. */
    descriptionTooLong?: string;
  };
  /** Role id to update. */
  roleId: string;
  /** Project id to update. */
  projectId: string;
  /** Initial iModel data. */
  initialRole: BaseRole;
  /** Permission options to display */
  permissionsOptions?: PermissionOption[];
};

export function UpdateRole(props: UpdateRoleProps) {
  const {
    accessToken,
    apiOverrides = { serverEnvironmentPrefix: "" },
    onClose,
    onError,
    onSuccess,
    stringsOverrides,
    roleId,
    projectId,
    initialRole,
    permissionsOptions,
  } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const updatedStrings = {
    successMessage: "Role updated successfully.",
    errorMessage: "Could not update a role. Please try again later.",
    errorMessageRoleExists: "Role with the same name already exists.",
    titleString: "Update a role",
    confirmButton: "Update",
    ...stringsOverrides,
  };

  const updateRole = async (role: {
    displayName: string;
    description: string;
    permissions: string[];
  }) => {
    setIsLoading(true);
    try {
      const client = new ProjectsClient(
        apiOverrides?.serverEnvironmentPrefix ?? "",
        accessToken
      );
      const updatedRole = await client.updateProjectRole(
        projectId,
        roleId,
        role
      );

      setIsLoading(false);
      toaster.positive(updatedStrings.successMessage, {
        hasCloseButton: true,
      });
      onSuccess?.(updatedRole);
    } catch (err) {
      const responseError = err as Response;
      let error = new Error();
      if (responseError?.json) {
        const responseBody = await responseError.json();
        error = { ...error, ...responseBody };
      } else {
        error = { ...error, ...responseError };
      }
      handleError(error);
    }
  };

  const handleError = (
    error: { error: { code?: string; message?: string } } | any
  ) => {
    setIsLoading(false);
    const errorString =
      error?.error?.code === "RoleExists"
        ? updatedStrings.errorMessageRoleExists
        : updatedStrings.errorMessage;

    toaster.negative(errorString, { hasCloseButton: true });
    onError?.(error);
  };

  return (
    <>
      <BaseRolePage
        stringsOverrides={updatedStrings}
        isLoading={isLoading}
        onActionClick={updateRole}
        onClose={onClose}
        initialRole={initialRole}
        permissionsOptions={permissionsOptions}
      />
    </>
  );
}
