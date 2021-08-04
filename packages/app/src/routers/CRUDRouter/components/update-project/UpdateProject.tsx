/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { ProjectFull } from "@itwin/imodel-browser-react";
import { toaster } from "@itwin/itwinui-react";
import React from "react";

import { BaseProject, BaseProjectPage } from "../base-project/BaseProject";

export type UpdateProjectProps = {
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
  onSuccess?: (updatedProjet: { project: ProjectFull }) => void;
  /** Object of string overrides. */
  stringsOverrides?: {
    /** Displayed after successful update. */
    successMessage?: string;
    /** Displayed after failed update. */
    errorMessage?: string;
    /** Displayed after failed create because of the duplicate name or number. */
    errorMessageProjectExists?: string;
    /** The title of the page. */
    titleString?: string;
    /** iModel name property. */
    displayNameString?: string;
    /** iModel description property. */
    projectNumberString?: string;
    /** Confirm button string. */
    confirmButton?: string;
    /** Cancel button string. */
    cancelButton?: string;
    /** Error message when name is too long. */
    displayNameTooLong?: string;
    /** Error message when description is too long. */
    projectNumberTooLong?: string;
  };
  /** iModel id to update. */
  projectId: string;
  /** Initial iModel data. */
  initialProject: BaseProject;
};

export function UpdateProject(props: UpdateProjectProps) {
  const {
    accessToken,
    apiOverrides = { serverEnvironmentPrefix: "" },
    onClose,
    onError,
    onSuccess,
    stringsOverrides,
    projectId,
    initialProject,
  } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const updatedStrings = {
    successMessage: "Project updated successfully.",
    errorMessage: "Could not update a project. Please try again later.",
    errorMessageProjectExists:
      "Project with the same name or number already exists.",
    titleString: "Update a project",
    confirmButton: "Update",
    ...stringsOverrides,
  };

  const updateProject = async (project: {
    displayName: string;
    projectNumber: string;
  }) => {
    setIsLoading(true);
    try {
      const projectUrl = `https://${apiOverrides?.serverEnvironmentPrefix &&
        `${apiOverrides.serverEnvironmentPrefix}-`}api.bentley.com/projects/${projectId}`;
      const response = await fetch(projectUrl, {
        method: "PATCH",
        headers: {
          Authorization: `${accessToken}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          displayName: project.displayName,
          projectNumber: project.projectNumber,
        }),
      });
      if (!response.ok) {
        let error = new Error();
        const responseBody = await response.json();
        error = { ...error, ...responseBody };
        throw error;
      } else {
        const updatedProject = await response.json();
        setIsLoading(false);
        toaster.positive(updatedStrings.successMessage, {
          hasCloseButton: true,
        });
        onSuccess?.(updatedProject);
      }
    } catch (err) {
      error(err);
    }
  };

  const error = (
    error: { error: { code?: string; message?: string } } | any
  ) => {
    setIsLoading(false);
    const errorString =
      error?.error?.code === "ProjectExists"
        ? updatedStrings.errorMessageProjectExists
        : updatedStrings.errorMessage;

    toaster.negative(errorString, { hasCloseButton: true });
    onError?.(error);
  };

  return (
    <>
      <BaseProjectPage
        stringsOverrides={updatedStrings}
        isLoading={isLoading}
        onActionClick={updateProject}
        onClose={onClose}
        initialProject={initialProject}
      />
    </>
  );
}
