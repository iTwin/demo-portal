/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Title } from "@itwin/itwinui-react";
import { RouteComponentProps } from "@reach/router";
import React from "react";

import {
  Connection,
  ExecutionState,
  Run,
  SourceFile,
} from "../../api/synchronization/generated";
import { SynchronizationClient } from "../../api/synchronization/synchronizationClient";
import { useApiPrefix } from "../../api/useApiPrefix";
import { spreadIf } from "../../utils";
import { ConnectionsTable } from "./components/ConnectionsTable";
import { DebugTools } from "./components/DebugTools";
import { skeletonRow, skeletonRows } from "./components/SkeletonCell";
import { SourcesTable } from "./components/SourcesTable";
import { UploadPanel } from "./components/UploadPanel";

export const LastRunContext = React.createContext<Run | undefined>(undefined);
export interface SynchronizeProps extends RouteComponentProps {
  projectId?: string;
  iModelId?: string;
  accessToken: string;
  email: string;
}
export const Synchronize = ({
  iModelId = "",
  projectId = "",
  accessToken,
  email,
}: SynchronizeProps) => {
  const urlPrefix = useApiPrefix();

  const [connections, setConnections] = React.useState<Connection[]>([
    skeletonRow,
  ]);

  const [lastRunResults, setLastRunResults] = React.useState<Run>();
  const [sources, setSources] = React.useState<SourceFile[]>(skeletonRows);
  const fetchSources = React.useCallback(async () => {
    if (!accessToken || !iModelId) {
      return;
    }
    const client = new SynchronizationClient(urlPrefix, accessToken);
    const {
      sourceFiles,
      connection,
    } = await client.getDemoConnectionAndSourceFiles(iModelId);
    const [
      connectionId,
      runId,
    ] = SynchronizationClient.extractIdsFromLastRunDetails(
      connection?._links?.lastRunDetails?.href
    );
    if (connectionId && runId) {
      const { run } = await client.getConnectionRun(
        iModelId,
        connectionId,
        runId
      );

      setLastRunResults(run);
    }
    setSources(sourceFiles);
    setConnections([...spreadIf(connection)]);
  }, [accessToken, iModelId, urlPrefix]);
  React.useEffect(() => void fetchSources(), [fetchSources]);

  React.useEffect(() => {
    if (lastRunResults?.state !== ExecutionState.Completed) {
      const timeout = setTimeout(async () => {
        if (!lastRunResults?.connectionId || !lastRunResults.id) {
          return;
        }
        const client = new SynchronizationClient(urlPrefix, accessToken);
        const { run } = await client.getConnectionRun(
          iModelId,
          lastRunResults?.connectionId,
          lastRunResults?.id
        );

        setLastRunResults(run);
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [accessToken, iModelId, lastRunResults, urlPrefix]);

  return (
    <div className="scrolling-tab-container">
      <div className="title-section">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Title>Synchronize</Title>
          <DebugTools iModelId={iModelId} projectId={projectId} />
        </div>
        <UploadPanel
          iModelId={iModelId}
          projectId={projectId}
          accessToken={accessToken}
          email={email}
          onSuccess={fetchSources}
        />
      </div>
      <div className="scrolling-tab-content title-section">
        <LastRunContext.Provider value={lastRunResults}>
          <ConnectionsTable
            accessToken={accessToken}
            connections={connections}
            iModelId={iModelId}
            refreshCallback={fetchSources}
          />
          {sources.length > 0 && (
            <>
              <hr />
              <SourcesTable sources={sources} />
            </>
          )}
        </LastRunContext.Provider>
      </div>
    </div>
  );
};
