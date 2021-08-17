/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { Title } from "@itwin/itwinui-react";
import { RouteComponentProps } from "@reach/router";
import React from "react";

import { RunSynchronizationAPI } from "../../api/synchronization/generated";
import { spreadIf } from "../../utils";
import { ConnectionsTable } from "./components/ConnectionsTable";
import { DebugTools } from "./components/DebugTools";
import { skeletonRow, skeletonRows } from "./components/SkeletonCell";
import { SourcesTable } from "./components/SourcesTable";
import { UploadPanel } from "./components/UploadPanel";
import { useSynchronizeInfo } from "./useSynchronizeInfo";

export const LastRunContext = React.createContext<
  RunSynchronizationAPI | undefined
>(undefined);
export interface SynchronizeProps extends RouteComponentProps {
  projectId?: string;
  iModelId?: string;
  accessToken: string;
}
export const Synchronize = ({
  iModelId = "",
  projectId = "",
  accessToken,
}: SynchronizeProps) => {
  const {
    connection,
    sourceFiles,
    fetchSources,
    lastRunResults,
  } = useSynchronizeInfo(iModelId, accessToken);

  const connections = React.useMemo(
    () => [...(sourceFiles ? spreadIf(connection) : [skeletonRow])],
    [connection, sourceFiles]
  );
  const sources = React.useMemo(
    () => [...(sourceFiles ? sourceFiles : skeletonRows)],
    [sourceFiles]
  );

  React.useEffect(() => void fetchSources(), [fetchSources]);

  return (
    <div className="idp-scrolling-container">
      <div className="idp-content-margins">
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
          onSuccess={fetchSources}
        />
      </div>
      <div className="idp-scrolling-content idp-content-margins">
        <LastRunContext.Provider value={lastRunResults}>
          <ConnectionsTable
            accessToken={accessToken}
            connections={connections}
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
