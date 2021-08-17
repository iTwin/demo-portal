/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { prefixUrl } from "../useApiPrefix";
import {
  BASE_PATH,
  FileCreateStorageAPI,
  FilesApi,
  FilesApiFp,
  FoldersApi,
} from "./generated";

const folderIdCache: { [hash: string]: string } = {};

export class StorageClient {
  private DEMO_FOLDER_NAME = "demo-portal-imodel-connections";
  private filesApi: FilesApi;
  private foldersApi: FoldersApi;
  constructor(urlPrefix: string, private accessToken: string) {
    const baseUrl = prefixUrl(BASE_PATH, urlPrefix);
    this.filesApi = new FilesApi(undefined, baseUrl);
    this.foldersApi = new FoldersApi(undefined, baseUrl);
  }

  /**
   * Will attempt to retrieve id from the link, as it is not provided directly.
   * @param href href from project _links
   * @returns
   */
  static extractFolderIdFromStorageHref(href?: string) {
    return href?.split("/").reverse()?.[0] ?? "";
  }

  /**
   * See {@link FilesApi.createFile} for details.
   * @param folderId
   * @param fileSpec
   * @returns
   */
  async createFile(folderId: string, fileSpec: FileCreateStorageAPI) {
    return this.filesApi.createFile(
      folderId,
      this.accessToken,
      fileSpec,
      "application/vnd.bentley.itwin-platform.v1+json"
    );
  }

  /**
   * See {@link FilesApi.updateFileContent} for details.
   * @param fileId File to retreive upload info
   * @returns upload info
   */
  async updateFile(fileId: string) {
    return this.filesApi.updateFileContent(
      fileId,
      this.accessToken,
      "application/vnd.bentley.itwin-platform.v1+json"
    );
  }

  /**
   * See {@link FilesApi.getFile} for details.
   * @param fileId Id of the file to retrieve.
   * @returns
   */
  async getFile(fileId: string, abortSignal?: AbortSignal) {
    const options = abortSignal
      ? {
          signal: abortSignal,
        }
      : {};
    return this.filesApi.getFile(
      fileId,
      this.accessToken,
      "application/vnd.bentley.itwin-platform.v1+json",
      options
    );
  }

  /**
   * See {@link FilesApi.completeFileCreation} for details.
   * @param completeUrl Complete URL returned by the "createFile" api call.
   * @returns Created file
   */
  async completeFileCreation(completeUrl: string | undefined) {
    if (!completeUrl) {
      throw new Error("Complete URL required");
    }
    // Using Fp here because I need to override the URL, using
    // the # in the base url makes the "computed" path not part of the
    // request. NOT SURE THIS IS SAFE, but it works for demo purposes.
    // After switching to XHR above, I had issues that request werent working
    // so I decided to use the complete url provided by the API (which points
    // to a specific host, rather than api.bentley.com, there might be timing issues)
    return FilesApiFp().completeFileCreation(
      "overrideByBasePath",
      this.accessToken,
      "application/vnd.bentley.itwin-platform.v1+json"
    )(undefined, `${completeUrl}#`);
  }

  /**
   * Retrieves the id of the folder named "demo-portal-imodel-connections" in the provided folder.
   * Note that this will cache retrieved value and not return to the network as these are not
   * expected to change through the lifetime of the project.
   * @param projectId
   * @param createIfNotFound
   * @returns A storage api folderID if found or createIfNotFound is true, an empty string otherwise.
   */
  async getDemoFolderId(projectId: string, createIfNotFound: boolean) {
    const projectInfo = await this.foldersApi.getTopLevelFoldersAndFilesByProject(
      projectId,
      this.accessToken,
      1000,
      0,
      "application/vnd.bentley.itwin-platform.v1+json"
    );
    const topFolderId = projectInfo._links?.folder?.href
      ?.split("/")
      .reverse()[0];
    const demoFolder = projectInfo.items?.find(
      (folder) => folder.displayName === this.DEMO_FOLDER_NAME
    );
    if (demoFolder) {
      return demoFolder.id;
    }
    if (topFolderId) {
      return this.getFolderIdByName(
        topFolderId,
        this.DEMO_FOLDER_NAME,
        createIfNotFound
      );
    }
  }

  /**
   * Retrieves the id of the folder named by the iModelId in the provided folder.
   * (Will work in any folder, but expects the id to be the one of the demo folder)
   * Note that this will cache retrieved value and not return to the network as these are not
   * expected to change through the lifetime of the project.
   * @param demoFolderId Found by calling getDemoFolderId function
   * @param iModelId IModel to find the folder for.
   * @param createIfNotFound
   * @returns A storage api folderID if found or createIfNotFound is true, an empty string otherwise.
   */
  async getIModelFolderId(
    demoFolderId: string,
    iModelId: string,
    createIfNotFound: boolean
  ) {
    return this.getFolderIdByName(demoFolderId, iModelId, createIfNotFound);
  }

  private async getFolderIdByName(
    folderId: string,
    folderName: string,
    createIfNotFound: boolean
  ) {
    const cacheKey = folderId + folderName;
    if (folderIdCache[cacheKey]) {
      return folderIdCache[cacheKey];
    }
    const pageSize = 1000;
    let currentPage = 0;
    let searching = true;
    let namedFolderId = "";
    while (searching) {
      const folders = await this.foldersApi.getFoldersInFolder(
        folderId,
        this.accessToken,
        pageSize,
        currentPage * pageSize,
        "application/vnd.bentley.itwin-platform.v1+json"
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
      const namedFolder = await this.foldersApi.createFolder(
        folderId,
        this.accessToken,
        {
          displayName: folderName,
          description:
            "Folder used by the Demo portal to store iModel automatic iModel creation",
        },
        "application/vnd.bentley.itwin-platform.v1+json"
      );
      namedFolderId = namedFolder.folder?.id ?? "";
    }
    if (namedFolderId) {
      folderIdCache[cacheKey] = namedFolderId;
    }
    return namedFolderId;
  }

  /**
   * Using XMLHttpRequest so we can provide upload progress, however, this seems to cause
   * issues with the Complete (as if the connection was not complete?), need to investigate.
   * @param url Target Url
   * @param file data to send
   * @param setProgress Function to provide progress updates
   * @returns
   */
  async uploadFileWithProgress(
    url: string,
    file: File,
    setProgress: (percent: number) => void
  ) {
    return new Promise<void>((resolve, reject) => {
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
  }
}
