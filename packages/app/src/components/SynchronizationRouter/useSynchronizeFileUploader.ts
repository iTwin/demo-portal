/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import {
  BASE_PATH as STORAGE_BASE,
  FilesApi,
  FoldersApi,
} from "../../api/storage";
import {
  BASE_PATH as SYNCH_BASE,
  DefaultApi as SynchronizationApi,
  IModelBridgeType,
} from "../../api/synchronization";
import { ProjectWithLinks, useApiData } from "../../api/useApiData";
import { usePrefixedUrl } from "../../api/useApiPrefix";
import {
  completeFileCreation,
  extractFolderIdFromStorageHref,
  getDemoFolderId,
  getIModelFolderId,
  uploadFileWithProgress,
} from "./demoFolderUtils";

interface ConnectionFileUploaderOptions {
  projectId: string;
  iModelId: string;
  accessToken: string;
  email: string;
}

const getBridgeType = (fileName: string) => {
  return ({
    dgn: IModelBridgeType.MSTN,
    rvt: IModelBridgeType.REVIT,
    nwd: IModelBridgeType.NWD,
    ifc: IModelBridgeType.IFC,
  } as { [extension: string]: IModelBridgeType })[
    fileName.split(".").reverse()[0]
  ];
};

export const useSynchronizeFileUploader = ({
  projectId,
  iModelId,
  accessToken = "",
  email = "",
}: ConnectionFileUploaderOptions) => {
  const synchronizationBaseUrl = usePrefixedUrl(SYNCH_BASE);
  const StorageBaseUrl = usePrefixedUrl(STORAGE_BASE);
  const { results } = useApiData<{ project: ProjectWithLinks }>({
    url: projectId
      ? `https://api.bentley.com/projects/${projectId}`
      : undefined,
    accessToken,
  });

  const storageLinkHref = results?.project?._links?.storage?.href;

  const [step, setStep] = React.useState(0);
  const [status, setStatus] = React.useState<string | undefined>();
  const [progress, setProgress] = React.useState(0);
  const [state, setState] = React.useState<"Success" | "Error" | "Working">();

  const uploadFiles = React.useCallback(
    async (fileList: FileList, onSuccess?: () => void) => {
      if (!fileList || fileList.length === 0) {
        return;
      }
      setProgress(0);
      setStep(1);
      setState("Working");
      try {
        if (accessToken === "") {
          throw new Error("A valid access token is required, none provided");
        }
        if (email === "") {
          throw new Error("User email required, none provided");
        }
        const projectFolderId = extractFolderIdFromStorageHref(storageLinkHref);
        if (!projectFolderId) {
          throw new Error(
            "Project folder could not be determined, please refresh the page"
          );
        }

        if (fileList.length > 1) {
          throw new Error("Only single file upload are supported (for now)");
        }
        const target = fileList[0];
        const fileName = target?.name;
        const bridgeType = getBridgeType(fileName);
        if (!bridgeType) {
          throw new Error(
            "This file type is not supported, current file support are .dgn, .rvt, .nwd and .ifc"
          );
        }

        setStatus("Validating new connection");
        const synchronizeApi = new SynchronizationApi(
          undefined,
          synchronizationBaseUrl
        );
        const connections = await synchronizeApi.getConnections(
          iModelId,
          accessToken
        );
        const existingConnection = connections.connections?.find(
          (connection) => connection.displayName === target.name
        );
        if (existingConnection) {
          throw new Error(
            `Connection for ${fileName} already exists, update is not supported, yet ;)`
          );
        }

        setStep(2);
        setStatus("Validating demo portal file share");
        const folderApi = new FoldersApi(undefined, StorageBaseUrl);
        const demoFolderId = await getDemoFolderId(
          projectFolderId,
          accessToken,
          true,
          folderApi
        );
        setStatus("Validating iModel file share");
        const iModelFolderId = await getIModelFolderId(
          demoFolderId,
          iModelId,
          accessToken,
          true,
          folderApi
        );

        setStep(3);
        const fileApi = new FilesApi(undefined, StorageBaseUrl);
        setStatus("Creating file target");
        const fileUpload = await fileApi.createFile(
          iModelFolderId,
          accessToken,
          undefined,
          {
            file: {
              description: "Demo-portal connection file",
              displayName: fileName,
            },
          }
        );

        setStatus("Uploading file");
        const uploadTarget = fileUpload._links?.uploadUrl?.href;
        if (!uploadTarget) {
          throw new Error("No upload target");
        }
        await uploadFileWithProgress(uploadTarget, target, setProgress);

        setStatus("Completing file creation");
        const file = await completeFileCreation(
          fileUpload._links?.completeUrl?.href,
          accessToken
        );
        if (!file.file.id) {
          throw new Error("Uploaded file have no Id!");
        }

        setStep(4);
        setStatus("Creating connection to uploaded file");
        const fileConnection = await synchronizeApi.createConnection(
          iModelId,
          accessToken,
          {
            connection: {
              ownerEmail: email.toLocaleLowerCase(),
              displayName: fileName,
              sourceFiles: [
                {
                  fileId: file.file.id,
                  isSpatialRoot: false,
                  iModelBridgeType: bridgeType,
                },
              ],
              projectShareLocation: {
                projectId,
              },
            },
          }
        );
        if (!fileConnection.connection?.id) {
          throw new Error("Connection creation failed");
        }
        // Disabled at the moment, the connection is not "Working" at this point, owner need to be updated.
        // setStatus("Running the connection");
        // await synchronizeApi.runConnection(
        //   fileConnection.connection.id,
        //   iModelId,
        //   accessToken
        // );
        onSuccess?.();
        setStep(5);
        setState("Success");
        setStatus(
          "File connected, click 'Open bridge portal' button and set yourself as the connection owner, then run the connection. (Yeah, I know... :) )"
        );
      } catch (error) {
        console.error(error);
        if (typeof error?.text === "function") {
          const unpackedError = (await error.text()) as string;
          if (unpackedError.includes("FolderNotFound")) {
            setStatus(
              "Upload failed, structure folder was deleted outside the portal, please refresh the page to continue"
            );
          } else {
            setStatus(unpackedError);
          }
        } else {
          setStatus(error.message);
        }
        setState("Error");
      }
    },
    [
      StorageBaseUrl,
      synchronizationBaseUrl,
      accessToken,
      email,
      iModelId,
      projectId,
      storageLinkHref,
    ]
  );
  return { uploadFiles, status, progress, state, step };
};
