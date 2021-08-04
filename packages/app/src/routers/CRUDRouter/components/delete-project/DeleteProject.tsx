/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import SvgWarning from "@itwin/itwinui-icons-react/cjs/icons/StatusWarning";
import {
  Button,
  Modal,
  ModalButtonBar,
  ProgressRadial,
  toaster,
} from "@itwin/itwinui-react";
import React from "react";

import "./DeleteProject.scss";

export type DeleteProjectProps = {
  /** Project object to delete. */
  project: { displayName?: string; id: string };
  /** Bearer access token with scope `projects:modify`. */
  accessToken: string;
  /** Object that configures different overrides for the API. */
  apiOverrides?: { serverEnvironmentPrefix?: "dev" | "qa" | "" };
  /** Callback on closed dialog. */
  onClose?: () => void;
  /** Callback on failed delete. */
  onError?: (error: Error) => void;
  /** Callback on successful delete. */
  onSuccess?: () => void;
  /** Object of string overrides. */
  stringsOverrides?: {
    /** Displayed after successful delete. */
    successMessage?: string;
    /** Displayed after failed delete. */
    errorMessage?: string;
    /** The title of the dialog. */
    title?: string;
    /** Main body message. */
    bodyMessage?: string;
    /** Confirm button string. */
    confirmButton?: string;
    /** Cancel button string. */
    cancelButton?: string;
  };
};

export function DeleteProject(props: DeleteProjectProps) {
  const {
    project: { id: projectId, displayName },
    accessToken,
    apiOverrides = { serverEnvironmentPrefix: "" },
    onClose,
    onError,
    onSuccess,
    stringsOverrides,
  } = props;
  const [isOpen, setIsOpen] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const deleteProject = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${apiOverrides?.serverEnvironmentPrefix &&
          `${apiOverrides.serverEnvironmentPrefix}-`}api.bentley.com/projects/${projectId}`,
        { method: "DELETE", headers: { Authorization: `${accessToken}` } }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      } else {
        setIsLoading(false);
        toaster.positive(
          stringsOverrides?.successMessage ?? "Project deleted successfully."
        );
        onSuccess?.();
      }
      close();
    } catch (err) {
      error(err);
      close();
    }
  };

  const error = (error: Error) => {
    setIsLoading(false);
    toaster.negative(
      stringsOverrides?.errorMessage ??
        "Could not delete a project. Please try again later."
    );
    onError?.(error);
  };

  const close = React.useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        style={{ maxWidth: 600 }}
        onClose={close}
        title={
          <div className="idp-delete-title">
            <SvgWarning className="warning-icon" />
            {stringsOverrides?.title ??
              `Delete project ${displayName && `'${displayName}'`}`}
          </div>
        }
      >
        {stringsOverrides?.bodyMessage ??
          "Deleting this project will remove access for all users and all data will no longer be available. Are you sure you want to delete this project?"}
        <ModalButtonBar>
          <Button styleType="high-visibility" onClick={deleteProject}>
            {stringsOverrides?.confirmButton ?? "Yes"}
          </Button>
          <Button onClick={close}>
            {stringsOverrides?.cancelButton ?? "No"}
          </Button>
        </ModalButtonBar>
      </Modal>
      {isLoading && <OverlaySpinner />}
    </>
  );
}

function OverlaySpinner() {
  return (
    <div className="idp-delete-title overlay-container">
      <ProgressRadial indeterminate />
    </div>
  );
}
