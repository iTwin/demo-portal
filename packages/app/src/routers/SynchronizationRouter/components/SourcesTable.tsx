/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { Table } from "@itwin/itwinui-react";
import React from "react";

import { StorageFileSynchronizationAPI } from "../../../api/synchronization/generated";
import { SynchronizationClient } from "../../../api/synchronization/synchronizationClient";
import {
  CreateTypeFromInterface,
  pascalCaseToSentenceCase,
} from "../../../utils";
import { LastRunContext } from "../Synchronize";
import { ConnectorIcon } from "./ConnectorIcon";
import { SkeletonCell } from "./SkeletonCell";

interface SourcesTableProps {
  sources: StorageFileSynchronizationAPI[];
}

export const SourcesTable = ({ sources }: SourcesTableProps) => {
  return (
    <Table<CreateTypeFromInterface<StorageFileSynchronizationAPI>>
      data={sources}
      columns={React.useMemo(
        () => [
          {
            width: 60,
            accessor: "connectorType",
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
                    <ConnectorIcon connectorType={props.value} />
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
            accessor: "storageFileId",
            Cell: (props) => {
              const lastRunResults = React.useContext(LastRunContext);
              let display = "";
              if (lastRunResults) {
                const task = SynchronizationClient.getTaskInfoFromRun(
                  lastRunResults,
                  props.value
                );
                display = pascalCaseToSentenceCase(task?.state) ?? "";
              }
              if (!display && !props.row.original.lastKnownFileName) {
                display = "Connection must be run after uploading the file";
              }
              return <SkeletonCell {...props}>{display}</SkeletonCell>;
            },
          },
          {
            id: "start",
            accessor: "storageFileId",
            Cell: (props) => {
              const lastRunResults = React.useContext(LastRunContext);
              let display = "";
              if (lastRunResults) {
                const task = SynchronizationClient.getTaskInfoFromRun(
                  lastRunResults,
                  props.value
                );
                display = SynchronizationClient.formatSynchronizationDate(
                  task?.startDateTime
                );
              }
              return display;
            },
          },
          {
            id: "end",
            accessor: "storageFileId",
            Cell: (props) => {
              const lastRunResults = React.useContext(LastRunContext);
              let display = "";
              if (lastRunResults) {
                const task = SynchronizationClient.getTaskInfoFromRun(
                  lastRunResults,
                  props.value
                );
                display = SynchronizationClient.formatSynchronizationDate(
                  task?.endDateTime
                );
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
