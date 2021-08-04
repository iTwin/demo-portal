/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { ProjectFull } from "@itwin/imodel-browser-react";
import { toaster } from "@itwin/itwinui-react";
import React from "react";

import { BaseProjectPage } from "../base-project/BaseProject";

export type CreateProjectProps = {
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
  onSuccess?: (createdProject: { project: ProjectFull }) => void;
  /** Object of string overrides. */
  stringsOverrides?: {
    /** Displayed after successful create. */
    successMessage?: string;
    /** Displayed after failed create. */
    errorMessage?: string;
    /** Displayed after failed create because of the duplicate name or number. */
    errorMessageProjectExists?: string;
    /** The title of the page. */
    titleString?: string;
    /** iModel name property. */
    nameString?: string;
    /** iModel description property. */
    descriptionString?: string;
    /** Confirm button string. */
    confirmButton?: string;
    /** Cancel button string. */
    cancelButton?: string;
    /** Error message when name is too long. */
    displayNameTooLong?: string;
    /** Error message when description is too long. */
    projectNumberTooLong?: string;
  };
};

export function CreateProject(props: CreateProjectProps) {
  const {
    accessToken,
    apiOverrides = { serverEnvironmentPrefix: "" },
    onClose,
    onError,
    onSuccess,
    stringsOverrides,
  } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const updatedStrings = {
    successMessage: "Project created successfully.",
    errorMessage: "Could not create a project. Please try again later.",
    errorMessageProjectExists:
      "Project with the same name or number already exists.",
    ...stringsOverrides,
  };

  const createProject = async (project: {
    displayName: string;
    projectNumber: string;
  }) => {
    setIsLoading(true);
    try {
      const projectsUrl = `https://${apiOverrides?.serverEnvironmentPrefix &&
        `${apiOverrides.serverEnvironmentPrefix}-`}api.bentley.com/projects`;
      const response = await fetch(projectsUrl, {
        method: "POST",
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
        const createdProject: { project: ProjectFull } = await response.json();
        const recentsUrl = `https://${apiOverrides?.serverEnvironmentPrefix &&
          `${apiOverrides.serverEnvironmentPrefix}-`}api.bentley.com/projects/recents/${
          createdProject.project.id
        }`;
        await fetch(recentsUrl, {
          method: "POST",
          headers: {
            Authorization: `${accessToken}`,
          },
        }).catch(() => {
          console.error(
            `Adding ${createdProject.project.displayName} to recent failed`
          );
          //* swallow error if this fails, project was still created and is available. *//
        });

        setIsLoading(false);
        toaster.positive(updatedStrings.successMessage, {
          hasCloseButton: true,
        });
        onSuccess?.(createdProject);
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
        onActionClick={createProject}
        onClose={onClose}
      />
    </>
  );
}
