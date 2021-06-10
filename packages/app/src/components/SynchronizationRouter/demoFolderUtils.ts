/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { FilesApiFp, FoldersApi } from "../../api/storage";

export const extractFolderIdFromStorageHref = (href?: string) => {
  return href?.split("/").reverse()?.[0] ?? "";
};

/**
 * Retrieves the id of the folder named "demo-portal-imodel-connections" in the provided folder.
 * Note that this will cache retrieved value and not return to the network as these are not
 * expected to change through the lifetime of the project.
 * @param projectFolderId Found by calling getProject api.
 * @param accessToken Require storage:read, also storage:modify if createIfNotFound is true
 * @param createIfNotFound
 * @param api FoldersApi instance
 * @returns A storage api folderID if found or createIfNotFound is true, an empty string otherwise.
 */
export const getDemoFolderId = async (
  projectFolderId: string,
  accessToken: string,
  createIfNotFound: boolean,
  api: FoldersApi
) => {
  return getFolderIdByName(
    projectFolderId,
    "demo-portal-imodel-connections",
    accessToken,
    createIfNotFound,
    api
  );
};

/**
 * Retrieves the id of the folder named by the iModelId in the provided folder.
 * (Will work in any folder, but expects the id to be the one of the demo folder)
 * Note that this will cache retrieved value and not return to the network as these are not
 * expected to change through the lifetime of the project.
 * @param demoFolderId Found by calling getDemoFolderId function
 * @param iModelId IModel to find the folder for.
 * @param accessToken Require storage:read, also storage:modify if createIfNotFound is true
 * @param createIfNotFound
 * @param api FoldersApi instance.
 * @returns A storage api folderID if found or createIfNotFound is true, an empty string otherwise.
 */
export const getIModelFolderId = async (
  demoFolderId: string,
  iModelId: string,
  accessToken: string,
  createIfNotFound: boolean,
  api: FoldersApi
) => {
  return getFolderIdByName(
    demoFolderId,
    iModelId,
    accessToken,
    createIfNotFound,
    api
  );
};

const folderIdCache: { [hash: string]: string } = {};
const getFolderIdByName = async (
  folderId: string,
  folderName: string,
  accessToken: string,
  createIfNotFound: boolean,
  api: FoldersApi
) => {
  const cacheKey = folderId + folderName;
  if (folderIdCache[cacheKey]) {
    return folderIdCache[cacheKey];
  }
  const pageSize = 1000;
  let currentPage = 0;
  let searching = true;
  let namedFolderId = "";
  while (searching) {
    const folders = await api.getFoldersInFolder(
      folderId,
      accessToken,
      pageSize,
      currentPage * pageSize
    );
    namedFolderId =
      folders.folders?.find((folder) => folder.displayName === folderName)
        ?.id ?? "";
    searching =
      !namedFolderId &&
      !!folders.folders &&
      folders.folders.length === pageSize;
    currentPage++;
  }
  if (!namedFolderId && createIfNotFound) {
    const namedFolder = await api.createFolder(
      folderId,
      accessToken,
      undefined,
      {
        folder: {
          displayName: folderName,
          description:
            "Folder used by the Demo portal to store iModel automatic iModel creation",
        },
      }
    );
    namedFolderId = namedFolder.folder?.id ?? "";
  }
  if (namedFolderId) {
    folderIdCache[cacheKey] = namedFolderId;
  }
  return namedFolderId;
};

/**
 * Using XMLHttpRequest so we can provide upload progress, however, this seems to cause
 * issues with the Complete (as if the connection was not complete?), need to investigate.
 * @param url Target Url
 * @param file data to send
 * @param setProgress Function to provide progress updates
 * @returns
 */
export const uploadFileWithProgress = async (
  url: string,
  file: File,
  setProgress: (percent: number) => void
) =>
  new Promise<void>((resolve, reject) => {
    setProgress(0);
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (event) => {
      if (event.total > 0) {
        setProgress((event.loaded * 100) / event.total);
      }
    };
    xhr.onerror = reject;
    xhr.upload.onerror = reject;
    xhr.upload.onabort = reject;
    xhr.upload.ontimeout = reject;
    xhr.upload.onload = () => setTimeout(resolve, 1000);
    xhr.open("PUT", url);
    xhr.setRequestHeader("x-ms-blob-type", "BlockBlob");
    xhr.send(file);
  });

/**
 *
 * @param completeUrl Complete URL returned by the "createFile" api call.
 * @param accessToken Require "storage:modify" scope.
 * @returns Created file
 */
export const completeFileCreation = async (
  completeUrl: string | undefined,
  accessToken: string
) => {
  if (!completeUrl) {
    throw new Error("Complete URL required");
  }
  // Using Fp here because I need to override the URL, using
  // the # in the base url makes the "computed" path not part of the
  // request. NOT SURE THIS IS SAFE, but it works for demo purposes.
  // After switching to XHR above, I had issues that request werent working
  // so I decided to use the complete url provided by the API (which points
  // to a specific host, rather than api.bentley.com, there might be timing issues)
  return FilesApiFp().completeFileCreation("overrideByBasePath", accessToken)(
    undefined,
    `${completeUrl}#`
  );
};
