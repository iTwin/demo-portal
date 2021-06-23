/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { SvgDelete, SvgPlay } from "@itwin/itwinui-icons-react";
import {
  Body,
  ButtonGroup,
  IconButton,
  Table,
  toaster,
} from "@itwin/itwinui-react";
import React, { useContext } from "react";

import {
  Connection,
  ExecutionState,
} from "../../../api/synchronization/generated";
import { SynchronizationClient } from "../../../api/synchronization/synchronizationClient";
import { useApiPrefix } from "../../../api/useApiPrefix";
import { CreateTypeFromInterface } from "../../../utils";
import { LastRunContext } from "../Synchronize";
import { interpretRunInfo } from "../useSynchronizeInfo";
import "./ConnectionsTable.scss";
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
                  const run = React.useContext(LastRunContext);
                  const runInfo = interpretRunInfo(run);
                  return (
                    <SkeletonCell {...props}>
                      <div className={"status-cell"}>
                        {run?.state && run.result && runInfo.icon}
                        {runInfo.time}{" "}
                        {runInfo.status ?? (
                          <Body isSkeleton={true}>Fetching...</Body>
                        )}
                      </div>
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
