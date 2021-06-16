/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  DefaultApi as SynchronizeApi,
  IModelBridgeType,
} from "./synchronization/api";

const DEMO_CONNECTION_NAME = "demo-portal-imodel-connection";

export const extractIdsFromLastRunDetails = (href: string | undefined) => {
  console.log(href);
  if (!href) {
    return [];
  }
  if (href.includes("/runs/")) {
    return href?.split("/connections/")[1]?.split("/runs/") ?? [];
  }

  return href?.split("runs")[1]?.split("/") ?? [];
};

export const getDemoConnectionAndSourceFiles = async (
  iModelId: string,
  accessToken: string,
  synchronizeApi: SynchronizeApi
) => {
  const connections = await synchronizeApi.getConnections(
    iModelId,
    accessToken
  );
  const demoPortalConnection = connections.connections?.find(
    (connection) => connection.displayName === DEMO_CONNECTION_NAME
  );
  const sourceFiles = demoPortalConnection?.id
    ? (
        await synchronizeApi.getConnectionSourcefiles(
          demoPortalConnection.id,
          accessToken,
          iModelId,
          undefined,
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
};

export const addFileToDemoConnection = async (
  demoConnectionId: string | undefined,
  fileId: string,
  bridgeType: IModelBridgeType,
  iModelId: string,
  projectId: string,
  email: string,
  accessToken: string,
  api: SynchronizeApi
) => {
  if (!demoConnectionId) {
    const fileConnection = await api.createConnection(iModelId, accessToken, {
      connection: {
        ownerEmail: email.toLocaleLowerCase(),
        displayName: DEMO_CONNECTION_NAME,
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
    });
    if (!fileConnection.connection?.id) {
      throw new Error("Connection creation failed");
    }
    return fileConnection.connection.id;
  }
  const addedFile = await api.addConnectionSourcefile(
    demoConnectionId,
    accessToken,
    {
      sourceFile: {
        fileId,
        isSpatialRoot: false,
        iModelBridgeType: bridgeType,
      },
    },
    iModelId
  );
  if (!addedFile.sourceFile?.id) {
    throw new Error("Updating creation failed");
  }
  return demoConnectionId;
};
