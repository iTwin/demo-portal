/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { ProgressRadial } from "@itwin/itwinui-react";
import React from "react";

import {
  ConnectionSynchronizationAPI,
  ExecutionResultSynchronizationAPI,
  ExecutionStateSynchronizationAPI,
  RunSynchronizationAPI,
  StorageFileSynchronizationAPI,
} from "../../api/synchronization/generated";
import { SynchronizationClient } from "../../api/synchronization/synchronizationClient";
import { useApiPrefix } from "../../api/useApiPrefix";

export const useSynchronizeInfo = (iModelId: string, accessToken: string) => {
  const urlPrefix = useApiPrefix();

  const [connection, setConnection] = React.useState<
    ConnectionSynchronizationAPI
  >();

  const [lastRunResults, setLastRunResults] = React.useState<
    RunSynchronizationAPI
  >();
  const fetchRunResults = React.useCallback(
    async (connectionId: string, runId: string) => {
      const client = new SynchronizationClient(urlPrefix, accessToken);
      const { run } = await client.getConnectionRun(connectionId, runId);
      setLastRunResults({ ...run, connectionId });
    },
    [accessToken, urlPrefix]
  );

  React.useEffect(() => {
    if (lastRunResults?.state !== ExecutionStateSynchronizationAPI.Completed) {
      const timeout = setTimeout(async () => {
        if (!lastRunResults?.connectionId || !lastRunResults.id) {
          return;
        }
        await fetchRunResults(lastRunResults.connectionId, lastRunResults.id);
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [accessToken, fetchRunResults, lastRunResults, urlPrefix]);

  const [sourceFiles, setSourceFiles] = React.useState<
    StorageFileSynchronizationAPI[]
  >();
  const fetchSources = React.useCallback(async () => {
    setLastRunResults(undefined);
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
      connection?._links?.lastRun?.href
    );
    if (connectionId && runId) {
      await fetchRunResults(connectionId, runId);
    }
    setSourceFiles(sourceFiles);
    setConnection(connection);
  }, [accessToken, fetchRunResults, iModelId, urlPrefix]);

  return {
    connection,
    sourceFiles,
    lastRunResults,
    fetchSources,
  };
};

export const interpretRunInfo = (run: RunSynchronizationAPI | undefined) => {
  const time = run
    ? SynchronizationClient.formatSynchronizationLatestDate(run, "now", " -")
    : "";
  const status = run
    ? run.state === ExecutionStateSynchronizationAPI.Completed
      ? run.result
      : run.state
    : "Never ran";
  const displayState =
    !run || !run.state || !run.result
      ? undefined
      : run.state !== ExecutionStateSynchronizationAPI.Completed
      ? "working"
      : {
          [ExecutionResultSynchronizationAPI.Cancelled]: "warning",
          [ExecutionResultSynchronizationAPI.Error]: "negative",
          [ExecutionResultSynchronizationAPI.PartialSuccess]: "positive",
          [ExecutionResultSynchronizationAPI.Skipped]: "warning",
          [ExecutionResultSynchronizationAPI.Success]: "positive",
          [ExecutionResultSynchronizationAPI.TimedOut]: "negative",
          [ExecutionResultSynchronizationAPI.Undetermined]: "",
        }[run.result];

  const radialIndeterminate = displayState === "warning" ? false : true;
  const radialStyle =
    displayState === "warning"
      ? {
          color: "var(--iui-color-foreground-warning)",
        }
      : undefined;
  const radialStatus =
    displayState === "positive"
      ? "positive"
      : displayState === "negative"
      ? "negative"
      : undefined;
  return {
    time,
    status,
    icon: (
      <ProgressRadial
        style={radialStyle}
        indeterminate={radialIndeterminate}
        value={100}
        size={"small"}
        status={radialStatus}
      />
    ),
  };
};
