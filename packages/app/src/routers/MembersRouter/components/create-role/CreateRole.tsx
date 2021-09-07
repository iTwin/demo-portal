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
import { BaseRolePage, PermissionOption } from "../base-role/BaseRole";

export type CreateRoleProps = {
  /** Bearer access token with scope `projects:modify`. */
  accessToken: string;
  /** Object that configures different overrides for the API. */
  apiOverrides?: { serverEnvironmentPrefix?: "dev" | "qa" | "" };
  /** Callback on canceled action. */
  onClose?: () => void;
  /** Callback on failed create. */
  onError?: (
    error: { error: { code?: string; message?: string } } | any
  ) => void;
  /** Callback on successful create. */
  onSuccess?: (createdRole: { role?: RoleProjectsAPI }) => void;
  /** Object of string overrides. */
  stringsOverrides?: {
    /** Displayed after successful create. */
    successMessage?: string;
    /** Displayed after failed create. */
    errorMessage?: string;
    /** Displayed after failed create because of the duplicate name or number. */
    errorMessageRoleExists?: string;
    /** The title of the page. */
    titleString?: string;
    /** Role name property. */
    nameString?: string;
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
  /** ProjectId where to create an role. */
  projectId: string;
  /** Permission options to display */
  permissionsOptions?: PermissionOption[];
};

export function CreateRole(props: CreateRoleProps) {
  const {
    accessToken,
    apiOverrides = { serverEnvironmentPrefix: "" },
    onClose,
    onError,
    onSuccess,
    stringsOverrides,
    projectId,
    permissionsOptions,
  } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const updatedStrings = {
    successMessage: "Role created successfully.",
    errorMessage: "Could not create a role. Please try again later.",
    errorMessageRoleExists: "Role with the same name or number already exists.",
    ...stringsOverrides,
  };

  const createRole = async (fullRole: {
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
      const { permissions, ...role } = fullRole;
      const createdRole = await client.createProjectRole(projectId, role);
      if (!createdRole.role?.id) {
        throw new Error("Role creation failed");
      }
      const finalRole = await client.updateProjectRole(
        projectId,
        createdRole.role.id,
        fullRole
      );

      setIsLoading(false);
      toaster.positive(updatedStrings.successMessage, {
        hasCloseButton: true,
      });
      onSuccess?.(finalRole);
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
        onActionClick={createRole}
        onClose={onClose}
        permissionsOptions={permissionsOptions}
      />
    </>
  );
}
