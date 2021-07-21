/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ProgressRadial } from "@itwin/itwinui-react";
import React from "react";

import {
  Connection,
  ExecutionResult,
  ExecutionState,
  Run,
  StorageFile,
} from "../../api/synchronization/generated";
import { SynchronizationClient } from "../../api/synchronization/synchronizationClient";
import { useApiPrefix } from "../../api/useApiPrefix";

export const useSynchronizeInfo = (iModelId: string, accessToken: string) => {
  const urlPrefix = useApiPrefix();

  const [connection, setConnection] = React.useState<Connection>();

  const [lastRunResults, setLastRunResults] = React.useState<Run>();
  const fetchRunResults = React.useCallback(
    async (connectionId: string, runId: string) => {
      const client = new SynchronizationClient(urlPrefix, accessToken);
      const { run } = await client.getConnectionRun(connectionId, runId);
      setLastRunResults({ ...run, connectionId });
    },
    [accessToken, urlPrefix]
  );

  React.useEffect(() => {
    if (lastRunResults?.state !== ExecutionState.Completed) {
      const timeout = setTimeout(async () => {
        if (!lastRunResults?.connectionId || !lastRunResults.id) {
          return;
        }
        await fetchRunResults(lastRunResults.connectionId, lastRunResults.id);
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [accessToken, fetchRunResults, lastRunResults, urlPrefix]);

  const [sourceFiles, setSourceFiles] = React.useState<StorageFile[]>();
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

export const interpretRunInfo = (run: Run | undefined) => {
  const time = run
    ? SynchronizationClient.formatSynchronizationLatestDate(run, "now", " -")
    : "";
  const status = run
    ? run.state === ExecutionState.Completed
      ? run.result
      : run.state
    : "Never ran";
  const displayState =
    !run || !run.state || !run.result
      ? undefined
      : run.state !== ExecutionState.Completed
      ? "working"
      : {
          [ExecutionResult.Canceled]: "warning",
          [ExecutionResult.Error]: "negative",
          [ExecutionResult.PartialSuccess]: "positive",
          [ExecutionResult.Skipped]: "warning",
          [ExecutionResult.Success]: "positive",
          [ExecutionResult.TimedOut]: "negative",
          [ExecutionResult.Undetermined]: "",
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
