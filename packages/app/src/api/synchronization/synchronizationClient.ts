/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { prefixUrl } from "../useApiPrefix";
import {
  BASE_PATH,
  DefaultApi,
  IModelBridgeType,
  Run,
  SourceFile,
} from "./generated";

export class SynchronizationClient {
  private DEMO_CONNECTION_NAME = "demo-portal-imodel-connection";
  private synchronizationApi: DefaultApi;
  constructor(urlPrefix: string, private accessToken: string) {
    this.synchronizationApi = new DefaultApi(
      undefined,
      prefixUrl(BASE_PATH, urlPrefix)
    );
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
      return href?.split("/connections/")[1]?.split("/runs/") ?? [];
    }

    return href?.split("runs")[1]?.split("/") ?? [];
  }

  /**
   * Will derive a bridge type based on the file name extension, or undefined if not supported
   * @param fileName File name to compare
   * @returns Bridge type, or undefined if file name not supported.
   */
  static getBridgeType(fileName: string) {
    return ({
      dgn: IModelBridgeType.MSTN,
      rvt: IModelBridgeType.REVIT,
      nwd: IModelBridgeType.NWD,
      ifc: IModelBridgeType.IFC,
    } as { [extension: string]: IModelBridgeType })[
      fileName.split(".").reverse()[0]
    ];
  }

  /**
   * Until API is fixed so task.sourceFileId actually returns a source.id, we need to guess
   * which one it is. So far, the order are the same, except the jobs are by bridgeType
   * (So, if 2 file, one revit, and one MSTN, both will have task index 0 in their respective jobs...)
   * @param run Last run details fetched from getRun or getRuns api.
   * @param sources List of available sourceFiles for this connection
   * @param sourcesIndex Index in the sourceFiles of the file we are looking for
   * @returns Task info
   */
  static getTaskInfoFromRun(
    run: Run,
    sources: SourceFile[],
    sourcesIndex: number
  ) {
    let taskIndex = 0;
    if (
      sources.some((source) => {
        if (
          source.iModelBridgeType === sources[sourcesIndex].iModelBridgeType
        ) {
          if (source.id === sources[sourcesIndex].id) {
            return true;
          }
          taskIndex++;
        }
        return false;
      })
    ) {
      const job = run.jobs?.find((job) => {
        return job.bridgeType === sources[sourcesIndex].iModelBridgeType;
      });
      return job?.tasks?.[taskIndex];
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
      "application/vnd.bentley.itwin-platform.v1+json",
      {
        headers: {
          Prefer: "return=representation",
        },
      }
    );
  }

  /**
   * See {@link DefaultApi.getConnectionRun} for details.
   * @param iModelId
   * @param connectionId
   * @param runId
   * @returns
   */
  async getConnectionRun(
    iModelId: string,
    connectionId: string,
    runId: string
  ) {
    return this.synchronizationApi.getConnectionRun(
      connectionId,
      runId,
      this.accessToken,
      iModelId,
      undefined,
      undefined,
      "application/vnd.bentley.itwin-platform.v1+json"
    );
  }

  /**
   * See {@link DefaultApi.deleteConnection} for details.
   * @param iModelId
   * @param connectionId
   * @returns
   */
  async deleteConnection(iModelId: string, connectionId: string) {
    return this.synchronizationApi.deleteConnection(
      connectionId,
      iModelId,
      this.accessToken,
      "application/vnd.bentley.itwin-platform.v1+json"
    );
  }

  /**
   * See {@link DefaultApi.runConnection} for details.
   * @param iModelId
   * @param connectionId
   * @returns
   */
  async runConnection(iModelId: string, connectionId: string) {
    return this.synchronizationApi.runConnection(
      connectionId,
      iModelId,
      this.accessToken,
      "application/vnd.bentley.itwin-platform.v1+json"
    );
  }

  /**
   * Will return the demo portal connection if it exists, and the sourcesFiles if there are any
   * @param iModelId to get info for
   * @returns
   */
  async getDemoConnectionAndSourceFiles(iModelId: string) {
    const connections = await this.synchronizationApi.getConnections(
      iModelId,
      this.accessToken,
      undefined,
      undefined,
      "application/vnd.bentley.itwin-platform.v1+json",
      {
        headers: { Prefer: "return=representation" },
      }
    );
    const demoPortalConnection = connections.connections?.find(
      (connection) => connection.displayName === this.DEMO_CONNECTION_NAME
    );
    const sourceFiles = demoPortalConnection?.id
      ? (
          await this.synchronizationApi.getConnectionSourcefiles(
            demoPortalConnection.id,
            this.accessToken,
            iModelId,
            "application/vnd.bentley.itwin-platform.v1+json",
            {
              headers: { Prefer: "return=representation" },
            }
          )
        ).sourceFiles ?? []
      : [];

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
   * @param bridgeType IModel bridge type
   * @param email Connection owner email (only used for initial creation, if empty)
   * @returns
   */
  async addFileToDemoConnection(
    projectId: string,
    iModelId: string,
    demoConnectionId: string | undefined,
    fileId: string,
    bridgeType: IModelBridgeType,
    email: string
  ) {
    if (!demoConnectionId) {
      const fileConnection = await this.synchronizationApi.createConnection(
        iModelId,
        this.accessToken,
        {
          connection: {
            ownerEmail: email.toLocaleLowerCase(),
            displayName: this.DEMO_CONNECTION_NAME,
            sourceFiles: [
              {
                fileId,
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
      return fileConnection.connection.id;
    }
    const addedFile = await this.synchronizationApi.addConnectionSourcefile(
      demoConnectionId,
      this.accessToken,
      {
        sourceFile: {
          fileId,
          isSpatialRoot: false,
          iModelBridgeType: bridgeType,
        },
      },
      iModelId,
      "application/vnd.bentley.itwin-platform.v1+json"
    );
    if (!addedFile.sourceFile?.id) {
      throw new Error("Updating creation failed");
    }
    return demoConnectionId;
  }
}
