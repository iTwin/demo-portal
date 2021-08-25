/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { StorageClient } from "../storage/storageClient";
import { prefixUrl } from "../useApiPrefix";
import {
  BASE_PATH,
  ConnectionsPreferReturnRepresentationSynchronizationAPI,
  ConnectorTypeSynchronizationAPI,
  DefaultApi,
  RunSynchronizationAPI,
  StorageFilePreferReturnRepresentationSynchronizationAPI,
  StorageFileSynchronizationAPI,
} from "./generated";

const ACCEPT = "application/vnd.bentley.itwin-platform.v1+json";

export class SynchronizationClient {
  private DEMO_CONNECTION_NAME = "demo-portal-imodel-connection";
  private synchronizationApi: DefaultApi;
  private storageClient: StorageClient;
  private static _supportedFileExtensions = [
    ".dgn",
    ".rvt",
    ".ifc",
    ".nwd",
    ".dwg",
  ];

  constructor(urlPrefix: string, private accessToken: string) {
    this.synchronizationApi = new DefaultApi(
      undefined,
      prefixUrl(BASE_PATH, urlPrefix)
    );
    this.storageClient = new StorageClient(urlPrefix, accessToken);
  }

  /**
   * list of supported file extensions
   */
  public static get supportedFileExtensions() {
    return this._supportedFileExtensions;
  }

  /**
   * Will attempt to retrieve ids from the link, as they are not provided directly.
   * @param href href from connection _links
   * @returns
   */
  static extractIdsFromLastRunDetails(href: string | undefined) {
    if (!href) {
      return [];
    }
    if (href.includes("/runs/")) {
      return href?.split("/storageConnections/")[1]?.split("/runs/") ?? [];
    }

    return href?.split("runs")[1]?.split("/") ?? [];
  }

  /**
   * Will derive a connector type based on the file name extension, or undefined if not supported
   * @param fileName File name to compare
   * @returns Connector type, or undefined if file name not supported.
   */
  static getConnectorType(fileName: string) {
    return ({
      dgn: ConnectorTypeSynchronizationAPI.MSTN,
      rvt: ConnectorTypeSynchronizationAPI.REVIT,
      nwd: ConnectorTypeSynchronizationAPI.NWD,
      ifc: ConnectorTypeSynchronizationAPI.IFC,
      dwg: ConnectorTypeSynchronizationAPI.DWG,
    } as { [extension: string]: ConnectorTypeSynchronizationAPI })[
      fileName.split(".").reverse()[0]
    ];
  }

  /**
   * Synchronization API will send a date in year 0001 if the date is meant to be empty,
   * this will format it accordingly to and empty string, or a "toLocaleString" otherwise.
   * @param synchDate Date to be parsed
   * @param suffix suffix to add if the date is not "empty"
   * @returns
   */
  static formatSynchronizationDate(synchDate: string | undefined, suffix = "") {
    if (!synchDate || synchDate.startsWith("0001")) {
      return "";
    }
    return new Date(synchDate).toLocaleString() + suffix;
  }

  /**
   *
   * @param src Typically, either a run or a task returned by synchronization API
   * @param fallback If endDate is "empty", "start" return formatted startDateTime, "now" return current time only.
   * @param suffix suffix to add if the date is not "empty"
   * @returns
   */
  static formatSynchronizationLatestDate(
    src: { startDateTime?: string; endDateTime?: string } | undefined,
    fallback: "start" | "now",
    suffix = ""
  ) {
    const endDate = this.formatSynchronizationDate(src?.endDateTime, suffix);
    if (endDate) {
      return endDate;
    }
    if (fallback === "start") {
      return this.formatSynchronizationDate(src?.startDateTime, suffix);
    }
    return new Date().toLocaleTimeString() + suffix;
  }

  /**
   * Retrieve the task information based on the storageFileId associated to the task
   * @param run Last run details fetched from getRun or getRuns api.
   * @param storageFileId Storage file Id
   * @returns Task info
   */
  static getTaskInfoFromRun(
    run: RunSynchronizationAPI,
    storageFileId: string | undefined
  ) {
    if (!storageFileId) {
      return;
    }
    for (const job of run.jobs ?? []) {
      for (const task of job.tasks ?? []) {
        if (task.storageFileId === storageFileId) {
          return task;
        }
      }
    }
  }

  /**
   * See {@link DefaultApi.getConnections} for details.
   * @param iModelId
   * @returns
   */
  async getConnections(iModelId: string) {
    return this.synchronizationApi.getConnections(
      iModelId,
      this.accessToken,
      undefined,
      undefined,
      ACCEPT,
      {
        headers: {
          Prefer: "return=representation",
        },
      }
    );
  }

  /**
   * See {@link DefaultApi.getConnectionRun} for details.
   * @param connectionId
   * @param runId
   * @returns
   */
  async getConnectionRun(connectionId: string, runId: string) {
    return this.synchronizationApi.getStorageConnectionRun(
      connectionId,
      runId,
      this.accessToken,
      undefined,
      undefined,
      ACCEPT
    );
  }

  /**
   * See {@link DefaultApi.deleteConnection} for details.
   * @param connectionId
   * @returns
   */
  async deleteConnection(connectionId: string) {
    return this.synchronizationApi.deleteStorageConnection(
      connectionId,
      this.accessToken,
      ACCEPT
    );
  }

  /**
   * See {@link DefaultApi.runStorageConnection} for details.
   * @param connectionId
   * @returns
   */
  async runConnection(connectionId: string) {
    return this.synchronizationApi.runStorageConnection(
      connectionId,
      this.accessToken,
      ACCEPT
    );
  }

  /**
   * See {@link DefaultApi.getAuthorizationInformation} for details.
   * @param redirectUrl
   * @returns
   */
  async getAuthorization(redirectUrl: string) {
    return this.synchronizationApi.getAuthorizationInformation(
      redirectUrl,
      this.accessToken,
      ACCEPT
    );
  }

  /**
   * Will return the demo portal connection if it exists, and the sourcesFiles if there are any
   * @param iModelId to get info for
   * @returns
   */
  async getDemoConnectionAndSourceFiles(iModelId: string) {
    const connections = (await this.synchronizationApi.getConnections(
      iModelId,
      this.accessToken,
      undefined,
      undefined,
      ACCEPT,
      {
        headers: { Prefer: "return=representation" },
      }
    )) as ConnectionsPreferReturnRepresentationSynchronizationAPI;
    const demoPortalConnection = connections.connections?.find(
      (connection) => connection.displayName === this.DEMO_CONNECTION_NAME
    );
    const sourceFiles = demoPortalConnection?.id
      ? ((await this.synchronizationApi.getStorageConnectionSourcefiles(
          demoPortalConnection.id,
          this.accessToken,
          ACCEPT,
          {
            headers: { Prefer: "return=representation" },
          }
        )) as StorageFilePreferReturnRepresentationSynchronizationAPI)
          .sourceFiles ?? []
      : [];

    const sourceHaveUnknownFileName = (source: StorageFileSynchronizationAPI) =>
      !source.lastKnownFileName && source.storageFileId;

    await Promise.all(
      sourceFiles.filter(sourceHaveUnknownFileName).map(async (source) => {
        if (!source.storageFileId) {
          return;
        }
        const file = await this.storageClient.getFile(source.storageFileId);
        source.lastKnownFileName = file.file?.displayName;
      })
    );

    return {
      connection: demoPortalConnection,
      sourceFiles,
    };
  }

  /**
   * If the demoConnectionId is provided and not falsy, it wil `addConnectionSourceFile` to this connection
   * otherwise it will create a new connection named "demo-portal-imodel-connection" with this file in it.
   * @param projectId Needed for the projectShareLocation
   * @param iModelId iModel to associate this connection to.
   * @param demoConnectionId existing demo portal connection (can be empty/undefined)
   * @param fileId ID of a file in the storage API.
   * @param connectorType IModel connector type
   * @param email Connection owner email (only used for initial creation, if empty)
   * @returns
   */
  async addFileToDemoConnection(
    iModelId: string,
    demoConnectionId: string | undefined,
    fileId: string,
    connectorType: ConnectorTypeSynchronizationAPI
  ) {
    if (!demoConnectionId) {
      const {
        connection,
      } = await this.synchronizationApi.createStorageConnection(
        this.accessToken,
        {
          iModelId,
          displayName: this.DEMO_CONNECTION_NAME,
          sourceFiles: [
            {
              storageFileId: fileId,
              connectorType: connectorType,
            },
          ],
        },
        ACCEPT
      );
      if (!connection?.id) {
        throw new Error("Connection creation failed");
      }
      return connection.id;
    }
    const addedFile = await this.synchronizationApi.addStorageConnectionSourcefile(
      demoConnectionId,
      this.accessToken,
      {
        storageFileId: fileId,
        connectorType: connectorType,
      },
      ACCEPT
    );
    if (!addedFile.sourceFile?.id) {
      throw new Error("Updating creation failed");
    }
    return demoConnectionId;
  }
}
