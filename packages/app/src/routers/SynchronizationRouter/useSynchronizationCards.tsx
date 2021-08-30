/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { IModelGrid } from "@itwin/imodel-browser-react";
import { SvgPlay, SvgSync } from "@itwin/itwinui-icons-react";
import {
  Body,
  IconButton,
  Tag,
  TagContainer,
  toaster,
} from "@itwin/itwinui-react";
import classnames from "classnames";
import React, { ComponentPropsWithoutRef } from "react";
import { useInView } from "react-intersection-observer";

import {
  ExecutionResultSynchronizationAPI,
  ExecutionStateSynchronizationAPI,
} from "../../api/synchronization/generated";
import { SynchronizationClient } from "../../api/synchronization/synchronizationClient";
import { useApiPrefix } from "../../api/useApiPrefix";
import { pascalCaseToSentenceCase } from "../../utils";
import { DetailedStatus } from "./components/DetailedStatus";
import { TileDropTarget } from "./components/TileDropTarget";
import { useSynchronizeFileUploader } from "./useSynchronizeFileUploader";
import { interpretRunInfo, useSynchronizeInfo } from "./useSynchronizeInfo";

type UseIndividualState = ComponentPropsWithoutRef<
  typeof IModelGrid
>["useIndividualState"];

const getProgressStatus = (state = "") =>
  state === "Error" ? "negative" : undefined;

/**
 * Adds the ability to see synchronization details and add upload drop target handling.
 * use as useIndividualState parameter in IModelGrid
 */
export const useSynchronizationCards: UseIndividualState = (
  { id: iModelId, projectId, ...iModel },
  { accessToken = "" }
) => {
  const [active, setActive] = React.useState(false);

  const dragTarget = React.useRef<HTMLDivElement | null>(null);
  const {
    progress,
    step,
    state,
    status,
    uploadFiles,
    resetUploader,
    conflictResolutionModalNode,
  } = useSynchronizeFileUploader({
    accessToken: accessToken ?? "",
    iModelId: iModelId,
    projectId: projectId ?? "",
    iModelName: iModel.displayName,
  });

  const { ref: inViewRef, inView } = useInView({ triggerOnce: true });
  const {
    connection,
    sourceFiles,
    fetchSources,
    lastRunResults,
  } = useSynchronizeInfo(inView ? iModelId : "", accessToken);

  React.useEffect(() => void fetchSources(), [fetchSources]);

  const urlPrefix = useApiPrefix();

  const connectionId = connection?.id;
  const runConnection = React.useCallback(async () => {
    if (!connectionId) {
      return;
    }
    const client = new SynchronizationClient(urlPrefix, accessToken);
    await client.runConnection(connectionId);
    void fetchSources();
  }, [accessToken, connectionId, fetchSources, urlPrefix]);

  const lastRunId = lastRunResults?.id;
  const lastRunState = lastRunResults?.state;
  const [preUploadRunId, setPreUploadRunId] = React.useState(lastRunId);
  React.useEffect(() => {
    if (
      lastRunId &&
      (preUploadRunId !== lastRunId ||
        lastRunState !== ExecutionStateSynchronizationAPI.Completed) &&
      state === "Success"
    ) {
      resetUploader();
      setPreUploadRunId(lastRunId);
    }
  }, [lastRunId, lastRunState, preUploadRunId, resetUploader, state]);

  const [count, setCount] = React.useState<string | undefined>("--");
  React.useEffect(() => {
    if (typeof sourceFiles?.length !== "undefined") {
      setCount(sourceFiles.length > 99 ? "99+" : `${sourceFiles.length}`);
    }
  }, [sourceFiles]);

  const [connectionStatus, setConnectionStatus] = React.useState<
    React.ReactNode
  >();

  React.useEffect(() => {
    if (state) {
      const progressStatus = getProgressStatus(state);
      setConnectionStatus(
        <DetailedStatus
          text={status && progressStatus !== "negative" ? status : state}
          status={progressStatus}
          progress={step === 3 ? progress : undefined}
        />
      );
    } else if (lastRunResults) {
      if (
        lastRunResults.state === ExecutionStateSynchronizationAPI.Completed &&
        lastRunResults.result !== ExecutionResultSynchronizationAPI.Error &&
        sourceFiles?.some(
          ({ storageFileId }) =>
            !SynchronizationClient.getTaskInfoFromRun(
              lastRunResults,
              storageFileId
            )
        )
      ) {
        setConnectionStatus(
          <DetailedStatus
            text={"Ready to synchronize"}
            altIcon={
              count !== "0" && (
                <IconButton
                  styleType={"borderless"}
                  size={"small"}
                  onClick={runConnection}
                >
                  <SvgPlay />
                </IconButton>
              )
            }
          />
        );
      } else {
        const runInfo = interpretRunInfo(lastRunResults);
        setConnectionStatus(
          <DetailedStatus
            text={`${runInfo.time} ${pascalCaseToSentenceCase(
              runInfo.status?.toString()
            )}`}
            altIcon={runInfo.icon}
          />
        );
      }
    } else {
      setConnectionStatus(
        !sourceFiles ? (
          <Body isSkeleton={true}>Fetching...</Body>
        ) : (
          <DetailedStatus
            text={
              count === "0"
                ? "Empty ? Drag a file here to start!"
                : "Ready to synchronize"
            }
            altIcon={
              count !== "0" && (
                <IconButton
                  styleType={"borderless"}
                  size={"small"}
                  onClick={runConnection}
                >
                  <SvgPlay />
                </IconButton>
              )
            }
          />
        )
      );
    }
  }, [
    count,
    lastRunResults,
    progress,
    runConnection,
    sourceFiles,
    state,
    status,
    step,
  ]);

  React.useEffect(() => {
    if (state === "Error") {
      toaster.negative(`Upload to "${iModel.displayName}" failed: ${status}`, {
        type: "persisting",
        hasCloseButton: true,
      });
    }
  }, [iModel.displayName, state, status]);

  return {
    tileProps: {
      onMouseEnter: () => {
        if (active) {
          setActive(false);
        }
      },
      onDragOver: (e: any) => {
        e.stopPropagation();
        e.preventDefault();
      },
      onDragEnter: (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        // only set active if a file is dragged over
        if (!active && e.dataTransfer?.items?.[0]?.kind === "file") {
          setActive(true);
          dragTarget.current = e.target as HTMLDivElement;
        }
      },
      onDragLeave: (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        // only set inactive if secondary target is outside the component
        if (active && !dragTarget.current?.contains(e.target)) {
          setActive(false);
        }
      },
      onDrop: (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (active) {
          setActive(false);
          if (state !== "Working") {
            void uploadFiles(e?.dataTransfer?.files, () => {
              void fetchSources();
            });
          }
        }
      },
      metadata: (
        <>
          <SvgSync />
          <TagContainer>
            <Tag variant={"basic"}>{count}</Tag>
          </TagContainer>
        </>
      ),
      className: classnames("tile-with-status", active && "hollow-shell"),
      children: (
        <>
          <div className={"tile-status"} ref={inViewRef}>
            {connectionStatus}
            {active && <TileDropTarget isDisabled={state === "Working"} />}
          </div>
          {conflictResolutionModalNode}
        </>
      ),
    },
  } as any;
};
