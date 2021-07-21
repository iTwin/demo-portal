/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Table } from "@itwin/itwinui-react";
import React from "react";

import { StorageClient } from "../../../api/storage/storageClient";
import { StorageFile } from "../../../api/synchronization/generated";
import { SynchronizationClient } from "../../../api/synchronization/synchronizationClient";
import { useApiPrefix } from "../../../api/useApiPrefix";
import { CreateTypeFromInterface } from "../../../utils";
import { LastRunContext } from "../Synchronize";
import { BridgeIcon } from "./BridgeIcon";
import { SkeletonCell } from "./SkeletonCell";

interface SourcesTableProps {
  accessToken: string;
  sources: StorageFile[];
}

export const SourcesTable = ({ sources, accessToken }: SourcesTableProps) => {
  const urlPrefix = useApiPrefix();
  return (
    <Table<CreateTypeFromInterface<StorageFile>>
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
                    <BridgeIcon bridgeType={props.value} />
                  </div>
                </SkeletonCell>
              );
            },
          },
          {
            accessor: "lastKnownFileName",
            Cell: (props) => {
              const [value, setValue] = React.useState(props.value);
              React.useEffect(() => {
                if (!props.value && props.row.original.storageFileId) {
                  const abortController = new AbortController();
                  const client = new StorageClient(urlPrefix, accessToken);
                  client
                    .getFile(
                      props.row.original.storageFileId,
                      abortController.signal
                    )
                    .then((file) => {
                      setValue(file.file?.displayName);
                    })
                    .catch(() => {
                      // value already empty.
                    });
                  return () => abortController.abort();
                }
              }, [props.row.original.storageFileId, props.value]);
              return <SkeletonCell {...props}>{value}</SkeletonCell>;
            },
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
