/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { SvgDelete, SvgPlay } from "@itwin/itwinui-icons-react";
import {
  Body,
  ButtonGroup,
  IconButton,
  ProgressRadial,
  Table,
  toaster,
} from "@itwin/itwinui-react";
import React, { useContext } from "react";

import {
  Connection,
  ExecutionResult,
  ExecutionState,
} from "../../../api/synchronization/generated";
import { SynchronizationClient } from "../../../api/synchronization/synchronizationClient";
import { useApiPrefix } from "../../../api/useApiPrefix";
import { CreateTypeFromInterface } from "../../../utils";
import { LastRunContext } from "../Synchronize";
import { SkeletonCell } from "./SkeletonCell";

interface ConnectionsTableProps {
  refreshCallback: () => void;
  iModelId: string;
  accessToken: string;
  connections: Connection[];
}

export const ConnectionsTable = ({
  connections,
  accessToken,
  iModelId,
  refreshCallback,
}: ConnectionsTableProps) => {
  const urlPrefix = useApiPrefix();
  const lastRun = React.useContext(LastRunContext);
  return (
    <Table<CreateTypeFromInterface<Connection>>
      data={connections}
      columns={React.useMemo(
        () => [
          {
            Header: "Table",
            columns: [
              {
                Header:
                  !lastRun || lastRun.state === ExecutionState.Completed
                    ? "Last synchronization result"
                    : "Synchronization status",
                accessor: "_links",
                id: "last-run-results",
                Cell: (props) => {
                  const [status, setStatus] = React.useState<
                    ExecutionResult | ExecutionState | string | undefined
                  >();
                  const [runTime, setRunTime] = React.useState("");
                  const run = React.useContext(LastRunContext);
                  React.useEffect(() => {
                    if (!run) {
                      setStatus("Never ran");
                      return;
                    }
                    if (run?.endDateTime && run.startDateTime) {
                      if (run.endDateTime.startsWith("0001")) {
                        setRunTime(new Date().toLocaleTimeString() + " -");
                      } else {
                        setRunTime(
                          new Date(run?.endDateTime).toLocaleString() + " -"
                        );
                      }
                    } else {
                      setRunTime("");
                    }
                    setStatus(
                      run.state === ExecutionState.Completed
                        ? run.result
                        : run.state
                    );
                  }, [run]);
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

                  const radialIndeterminate =
                    displayState === "warning" ? false : true;
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
                  return (
                    <SkeletonCell {...props}>
                      {runTime}{" "}
                      {status ?? <Body isSkeleton={true}>Fetching...</Body>}
                      {run?.state && run.result && (
                        <ProgressRadial
                          style={radialStyle}
                          indeterminate={radialIndeterminate}
                          value={100}
                          size={"small"}
                          status={radialStatus}
                        />
                      )}
                    </SkeletonCell>
                  );
                },
              },
              {
                Header: "Actions",
                id: "btns",
                accessor: "id",
                Cell: (props) => {
                  const lastRun = useContext(LastRunContext);
                  const client = new SynchronizationClient(
                    urlPrefix,
                    accessToken
                  );
                  const deleteConnection = async () => {
                    if (window.confirm("Confirm delete")) {
                      await client.deleteConnection(
                        iModelId,
                        props.value ?? ""
                      );
                      toaster.positive(
                        `Connection ${props.row.original.displayName} deleted!`
                      );
                      refreshCallback?.();
                    }
                  };
                  const runConnection = async () => {
                    await client.runConnection(iModelId, props.value ?? "");
                    toaster.positive(
                      `Connection ${props.row.original.displayName} scheduled!`
                    );
                    refreshCallback?.();
                  };
                  return (
                    <SkeletonCell {...props}>
                      <ButtonGroup>
                        <IconButton
                          styleType={"borderless"}
                          onClick={runConnection}
                          title={"Run connection"}
                          disabled={
                            lastRun &&
                            lastRun.state !== ExecutionState.Completed
                          }
                        >
                          <SvgPlay />
                        </IconButton>
                        <IconButton
                          styleType={"borderless"}
                          onClick={deleteConnection}
                          title={"Delete connection"}
                          disabled={
                            lastRun &&
                            lastRun.state !== ExecutionState.Completed
                          }
                        >
                          <SvgDelete />
                        </IconButton>
                      </ButtonGroup>
                    </SkeletonCell>
                  );
                },
              },
            ],
          },
        ],
        [accessToken, iModelId, lastRun, refreshCallback, urlPrefix]
      )}
      emptyTableContent={
        "No file connected, drop file above to create new connections"
      }
    />
  );
};
