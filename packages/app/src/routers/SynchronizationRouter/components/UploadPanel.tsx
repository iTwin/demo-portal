/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import {
  Alert,
  FileUpload,
  FileUploadTemplate,
  ProgressLinear,
  Wizard,
} from "@itwin/itwinui-react";
import React, { ComponentPropsWithoutRef } from "react";

import { SynchronizationClient } from "../../../api/synchronization/synchronizationClient";
import { useSynchronizeFileUploader } from "../useSynchronizeFileUploader";
import "./UploadPanel.scss";

interface UploadPanelProps {
  iModelId: string;
  projectId: string;
  accessToken: string;
  onSuccess?: () => void;
}

const getAlertType = (state: string) =>
  (({
    Success: "positive",
    Error: "negative",
  } as { [state: string]: ComponentPropsWithoutRef<typeof Alert>["type"] })[
    state
  ] ?? "informational");

export const UploadPanel = ({
  iModelId,
  projectId,
  accessToken,
  onSuccess,
}: UploadPanelProps) => {
  const {
    status,
    uploadFiles,
    progress,
    state,
    step,
    resetUploader,
    conflictResolutionModalNode,
  } = useSynchronizeFileUploader({
    iModelId,
    projectId,
    accessToken,
  });

  const uploadAndRefresh = React.useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) {
        return;
      }
      void uploadFiles(fileList, onSuccess);
    },
    [onSuccess, uploadFiles]
  );

  return (
    <>
      <Wizard
        type={"workflow"}
        currentStep={step}
        steps={[
          {
            name: "Choose a file",
            description:
              "Select a Microstation, Revit, IFC or NVD file to connect to your iModel",
          },
          {
            name: "Validating connection",
            description:
              "Validate that we have everything that we need and that a connection for this file name does not already exists for the iModel.",
          },
          {
            name: "Validating file share",
            description:
              "Validate that we can upload the file to the share service so it can be processed properly by the synchronization service.",
          },
          {
            name: "Uploading file",
            description: "Upload the file to the project share service.",
          },
          {
            name: "Creating connection",
            description:
              "Create a synchronization between the uploaded file and the iModel.",
          },
          {
            name: "Complete",
            description:
              "The file was uploaded and is now ready to be synchronized to the iModel.",
          },
        ]}
      />
      {status && state && (
        <Alert
          type={getAlertType(state)}
          className={"full-width-alert"}
          onClose={
            getAlertType(state) !== "informational" ? resetUploader : undefined
          }
        >
          {status}
          {status === "Uploading file" && <ProgressLinear value={progress} />}
        </Alert>
      )}
      {state !== "Working" && (
        <FileUpload onFileDropped={uploadAndRefresh}>
          <FileUploadTemplate
            acceptType={SynchronizationClient.supportedFileExtensions.join(",")}
            acceptMultiple={false}
            onChange={(e) => uploadAndRefresh(e?.target?.files)}
          />
        </FileUpload>
      )}
      {conflictResolutionModalNode}
    </>
  );
};
