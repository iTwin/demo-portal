/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { SvgPlay } from "@itwin/itwinui-icons-react";
import {
  Body,
  ButtonGroup,
  IconButton,
  Table,
  toaster,
} from "@itwin/itwinui-react";
import React, { useContext } from "react";

import {
  ConnectionSynchronizationAPI,
  ExecutionStateSynchronizationAPI,
} from "../../../api/synchronization/generated";
import { SynchronizationClient } from "../../../api/synchronization/synchronizationClient";
import { useApiPrefix } from "../../../api/useApiPrefix";
import { SynchronizationContext } from "../../../components/Synchronization/SynchronizationAPIProvider";
import {
  CreateTypeFromInterface,
  pascalCaseToSentenceCase,
} from "../../../utils";
import { LastRunContext } from "../Synchronize";
import { interpretRunInfo } from "../useSynchronizeInfo";
import "./ConnectionsTable.scss";
import { SkeletonCell } from "./SkeletonCell";

interface ConnectionsTableProps {
  refreshCallback: () => void;
  accessToken: string;
  connections: ConnectionSynchronizationAPI[];
}

export const ConnectionsTable = ({
  connections,
  accessToken,
  refreshCallback,
}: ConnectionsTableProps) => {
  const urlPrefix = useApiPrefix();
  const lastRun = React.useContext(LastRunContext);
  const synchContext = useContext(SynchronizationContext);

  return (
    <Table<CreateTypeFromInterface<ConnectionSynchronizationAPI>>
      data={connections}
      columns={React.useMemo(
        () => [
          {
            Header: "Table",
            columns: [
              {
                Header:
                  !lastRun ||
                  lastRun.state === ExecutionStateSynchronizationAPI.Completed
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
                        {pascalCaseToSentenceCase(
                          runInfo.status?.toString()
                        ) ?? <Body isSkeleton={true}>Fetching...</Body>}
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
                  const runConnection = async () => {
                    const authorized = await synchContext.login();
                    if (!authorized) {
                      toaster.negative(
                        "You are not authorized to use the synchronization service. Please try again and complete the authentication process in the pop-up window that follows."
                      );
                      return;
                    }
                    await client.runConnection(props.value ?? "");
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
                            lastRun.state !==
                              ExecutionStateSynchronizationAPI.Completed
                          }
                        >
                          <SvgPlay />
                        </IconButton>
                      </ButtonGroup>
                    </SkeletonCell>
                  );
                },
              },
            ],
          },
        ],
        [accessToken, lastRun, refreshCallback, urlPrefix, synchContext]
      )}
      emptyTableContent={
        "No file connected, drop file above to create new connections"
      }
    />
  );
};
