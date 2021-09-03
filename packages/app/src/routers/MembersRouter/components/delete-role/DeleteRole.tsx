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

import { ProjectsClient } from "../../../../api/projects/projectsClient";
import "./DeleteRole.scss";

export type DeleteRoleProps = {
  /** Role object to delete. */
  role: { displayName?: string; id: string; projectId: string };
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

export function DeleteRole(props: DeleteRoleProps) {
  const {
    role: { id: roleId, displayName, projectId },
    accessToken,
    apiOverrides = { serverEnvironmentPrefix: "" },
    onClose,
    onError,
    onSuccess,
    stringsOverrides,
  } = props;
  const [isOpen, setIsOpen] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const deleteRole = async () => {
    setIsLoading(true);
    try {
      await new ProjectsClient(
        apiOverrides?.serverEnvironmentPrefix ?? "",
        accessToken
      ).deleteProjectRole(projectId, roleId);
      setIsLoading(false);
      toaster.positive(
        stringsOverrides?.successMessage ?? "Role deleted successfully."
      );
      onSuccess?.();
    } catch (err) {
      const responseError = err as Response;
      let error = new Error();
      if (responseError?.json) {
        const responseBody = await responseError?.json();
        error = { ...error, ...responseBody };
      } else {
        error = { ...error, ...responseError };
      }
      handleError(error);
    }
    close();
  };

  const handleError = (error: Error) => {
    setIsLoading(false);
    toaster.negative(
      stringsOverrides?.errorMessage ??
        "Could not delete a role. Please try again later."
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
          <div className="idp-delete-role-title">
            <SvgWarning className="warning-icon" />
            {stringsOverrides?.title ??
              `Delete role ${displayName && `'${displayName}'`}`}
          </div>
        }
      >
        {stringsOverrides?.bodyMessage ??
          "Deleting this role will remove it for all users. Are you sure you want to delete this role?"}
        <ModalButtonBar>
          <Button styleType="high-visibility" onClick={deleteRole}>
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
    <div className="idp-delete-role-title overlay-container">
      <ProgressRadial indeterminate />
    </div>
  );
}
