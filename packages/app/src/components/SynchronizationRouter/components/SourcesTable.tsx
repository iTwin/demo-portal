/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Table } from "@itwin/itwinui-react";
import React from "react";

import { SourceFile } from "../../../api/synchronization/generated";
import { SynchronizationClient } from "../../../api/synchronization/synchronizationClient";
import { CreateTypeFromInterface } from "../../../utils";
import { LastRunContext } from "../Synchronize";
import { BridgeIcon } from "./BridgeIcon";
import { SkeletonCell } from "./SkeletonCell";

interface SourcesTableProps {
  sources: SourceFile[];
}

export const SourcesTable = ({ sources }: SourcesTableProps) => {
  return (
    <Table<CreateTypeFromInterface<SourceFile>>
      data={sources}
      columns={React.useMemo(
        () => [
          {
            width: 60,
            accessor: "iModelBridgeType",
            Cell: (props) => {
              return (
                <SkeletonCell {...props}>
                  <div
                    style={{
                      display: "flex",
                      placeContent: "center",
                      flex: "1 1 auto",
                    }}
                  >
                    <BridgeIcon bridgeType={props.value} />
                  </div>
                </SkeletonCell>
              );
            },
          },
          {
            accessor: "lastKnownFileName",
            Cell: SkeletonCell,
          },
          {
            id: "state",
            accessor: "id",
            Cell: (props) => {
              const lastRunResults = React.useContext(LastRunContext);
              let display = "";
              if (lastRunResults) {
                const task = SynchronizationClient.getTaskInfoFromRun(
                  lastRunResults,
                  props.data,
                  props.row.index
                );
                display = task?.state ?? "";
              }
              if (!display && !props.row.original.lastKnownFileName) {
                display = "Connection must be run after uploading the file";
              }
              return <SkeletonCell {...props}>{display}</SkeletonCell>;
            },
          },
          {
            id: "start",
            accessor: "id",
            Cell: (props) => {
              const lastRunResults = React.useContext(LastRunContext);
              let display = "";
              if (lastRunResults) {
                const task = SynchronizationClient.getTaskInfoFromRun(
                  lastRunResults,
                  props.data,
                  props.row.index
                );
                display =
                  !task?.startDateTime ||
                  task?.startDateTime?.startsWith("0001")
                    ? ""
                    : new Date(task?.startDateTime).toLocaleString();
              }
              return display;
            },
          },
          {
            id: "end",
            accessor: "id",
            Cell: (props) => {
              const lastRunResults = React.useContext(LastRunContext);
              let display = "";
              if (lastRunResults) {
                const task = SynchronizationClient.getTaskInfoFromRun(
                  lastRunResults,
                  props.data,
                  props.row.index
                );
                display =
                  !task?.endDateTime || task?.endDateTime?.startsWith("0001")
                    ? ""
                    : new Date(task?.endDateTime).toLocaleString();
              }
              return display;
            },
          },
        ],
        []
      )}
      emptyTableContent={
        "No file connected, drop file above to create new connections"
      }
    />
  );
};
