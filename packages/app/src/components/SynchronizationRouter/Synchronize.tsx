/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  SvgCloud,
  SvgDelete,
  SvgPlay,
  SvgSettings,
  SvgSync,
  SvgWindow,
} from "@itwin/itwinui-icons-react";
import {
  Alert,
  Body,
  ButtonGroup,
  FileUpload,
  FileUploadTemplate,
  IconButton,
  ProgressLinear,
  Table,
  Title,
  toaster,
  Wizard,
} from "@itwin/itwinui-react";
import { RouteComponentProps } from "@reach/router";
import React, { ComponentPropsWithoutRef } from "react";

import {
  BASE_PATH as SYNCH_BASE,
  Connection,
  DefaultApi as SynchronizationApi,
  ExecutionResult,
  ExecutionState,
} from "../../api/synchronization";
import { extractIdsFromLastRunDetails } from "../../api/synchronizationApiUtils";
import { useApiPrefix, usePrefixedUrl } from "../../api/useApiPrefix";
import "./Synchronize.scss";
import { useSynchronizeFileUploader } from "./useSynchronizeFileUploader";

type CreateTypeFromInterface<Interface> = {
  [Property in keyof Interface]: Interface[Property];
};

const getAlertType = (state: string) =>
  (({
    Success: "positive",
    Error: "negative",
  } as { [state: string]: ComponentPropsWithoutRef<typeof Alert>["type"] })[
    state
  ] ?? "informational");

export interface SynchronizeProps extends RouteComponentProps {
  projectId?: string;
  iModelId?: string;
  accessToken: string;
  email: string;
}
export const Synchronize = ({
  iModelId = "",
  projectId = "",
  accessToken,
  email,
}: SynchronizeProps) => {
  const synchronizationBaseUrl = usePrefixedUrl(SYNCH_BASE);
  const urlPrefix = useApiPrefix();

  const [connections, setConnections] = React.useState<any[]>([]);
  const fetchConnections = React.useCallback(async () => {
    const api = new SynchronizationApi(undefined, synchronizationBaseUrl);
    const connections = await api.getConnections(
      iModelId,
      accessToken,
      undefined,
      undefined,
      undefined,
      {
        headers: {
          Prefer: "return=representation",
        },
      }
    );
    setConnections(connections.connections ?? []);
  }, [accessToken, iModelId, synchronizationBaseUrl]);

  React.useEffect(() => void fetchConnections(), [fetchConnections]);

  const {
    status,
    uploadFiles,
    progress,
    state,
    step,
  } = useSynchronizeFileUploader({
    iModelId,
    projectId,
    accessToken,
    email,
  });

  const [hideStatus, setHideStatus] = React.useState(true);
  const uploadAndRefresh = React.useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) {
        return;
      }
      setHideStatus(false);
      void uploadFiles(fileList, fetchConnections);
    },
    [fetchConnections, uploadFiles]
  );
  return (
    <div className="scrolling-tab-container">
      <div className="title-section">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Title>Synchronize</Title>
          <ButtonGroup>
            <IconButton
              style={{ opacity: 0.6 }}
              styleType={"borderless"}
              onClick={() => {
                window.open(
                  `https://${
                    urlPrefix ? urlPrefix + "-" : ""
                  }connect-itwinbridgeportal.bentley.com/${projectId}/${iModelId}`,
                  "bridgeportal"
                );
              }}
              title={"Temporary debug tool: Open Bridge portal"}
            >
              <div>
                <SvgSync className={"sync-in-window"} />
                <SvgWindow />
                <SvgSettings className={"settings-in-window"} />
              </div>
            </IconButton>
            <IconButton
              style={{ opacity: 0.6 }}
              styleType={"borderless"}
              onClick={() => {
                window.open(
                  `https://${
                    urlPrefix ? urlPrefix + "-" : ""
                  }connect-projectshareweb.bentley.com/${projectId}`,
                  "shareportal"
                );
              }}
              title={"Temporary debug tool: Open Share portal"}
            >
              <div>
                <SvgCloud className={"cloud-in-window"} />
                <SvgWindow />
                <SvgSettings className={"settings-in-window"} />
              </div>
            </IconButton>
          </ButtonGroup>
        </div>
        <Wizard
          type={"workflow"}
          currentStep={hideStatus ? 0 : step}
          steps={[
            {
              name: "Choose a file",
              description:
                "Select a Microstation, Revit, IFC or NVD file to connect to your iModel",
            },
            {
              name: "Validating connection",
              description:
                "Validate that we have everything that we need and that a connection for this file name does not already exists for the iModel.",
            },
            {
              name: "Validating file share",
              description:
                "Validate that we can upload the file to the share service so it can be processed properly by the synchronization service.",
            },
            {
              name: "Uploading file",
              description: "Upload the file to the project share service.",
            },
            {
              name: "Creating connection",
              description:
                "Create a synchronization between the uploaded file and the iModel.",
            },
            {
              name: "Complete",
              description:
                "The file was uploaded and is now ready to be synchronized to the iModel.",
            },
          ]}
        />
        {!hideStatus && status && state && (
          <Alert
            type={getAlertType(state)}
            className={"full-width-alert"}
            onClose={
              getAlertType(state) !== "informational"
                ? () => setHideStatus(true)
                : undefined
            }
          >
            {status}
            {status === "Uploading file" && <ProgressLinear value={progress} />}
          </Alert>
        )}
        {state !== "Working" && (
          <FileUpload onFileDropped={uploadAndRefresh}>
            <FileUploadTemplate
              acceptMultiple={false}
              onChange={(e) => uploadAndRefresh(e?.target?.files)}
            />
          </FileUpload>
        )}
      </div>
      <div className="scrolling-tab-content title-section">
        <Table<CreateTypeFromInterface<Connection>>
          data={connections}
          columns={React.useMemo(
            () => [
              {
                Header: "Table",
                columns: [
                  { accessor: "displayName", Header: "File" },
                  {
                    Header: "Last synchronization result",
                    accessor: "_links",
                    id: "last-run-results",
                    Cell: (props) => {
                      const [status, setStatus] = React.useState<
                        ExecutionResult | ExecutionState | string | undefined
                      >();
                      const [runTime, setRunTime] = React.useState("");
                      const [
                        connectionId,
                        runId,
                      ] = extractIdsFromLastRunDetails(
                        props.value?.lastRunDetails?.href
                      );
                      React.useEffect(() => {
                        if (!connectionId || !runId) {
                          setStatus("Never ran");
                          return;
                        }
                        const api = new SynchronizationApi(
                          undefined,
                          synchronizationBaseUrl
                        );
                        api
                          .getConnectionRun(
                            connectionId,
                            runId,
                            accessToken,
                            iModelId
                          )
                          .then((result) => {
                            if (
                              result.run?.endDateTime &&
                              result.run.startDateTime
                            ) {
                              if (result.run.endDateTime.startsWith("0001")) {
                                setRunTime(
                                  new Date(
                                    result.run?.startDateTime
                                  ).toLocaleString() + " -"
                                );
                              } else {
                                setRunTime(
                                  new Date(
                                    result.run?.endDateTime
                                  ).toLocaleString() + " -"
                                );
                              }
                            } else {
                              setRunTime("");
                            }
                            setStatus(
                              (result?.run?.result ===
                              ExecutionResult.Undetermined
                                ? result.run.state
                                : result.run?.result) ??
                                ExecutionResult.Undetermined
                            );
                          })
                          .catch((error) => {
                            console.error("Fetching failed", error);
                            setStatus(`Fetching failed: see console`);
                          });
                      }, [connectionId, runId]);
                      return (
                        <>
                          {runTime}{" "}
                          {status ?? <Body isSkeleton={true}>Fetching...</Body>}
                        </>
                      );
                    },
                  },
                  {
                    Header: "Actions",
                    id: "btns",
                    accessor: "id",
                    Cell: (props) => {
                      const api = new SynchronizationApi(
                        undefined,
                        synchronizationBaseUrl
                      );
                      const deleteConnection = async () => {
                        if (window.confirm("Confirm delete")) {
                          await api.deleteConnection(
                            props.value ?? "",
                            iModelId,
                            accessToken
                          );
                          toaster.positive(
                            `Connection ${props.row.original.displayName} deleted!`
                          );
                          void fetchConnections();
                        }
                      };
                      const runConnection = async () => {
                        await api.runConnection(
                          props.value ?? "",
                          iModelId,
                          accessToken
                        );
                        toaster.positive(
                          `Connection ${props.row.original.displayName} scheduled!`
                        );
                        void fetchConnections();
                      };
                      return (
                        <ButtonGroup>
                          <IconButton
                            styleType={"borderless"}
                            onClick={runConnection}
                            title={"Run connection"}
                          >
                            <SvgPlay />
                          </IconButton>
                          <IconButton
                            styleType={"borderless"}
                            onClick={deleteConnection}
                            title={"Delete connection"}
                          >
                            <SvgDelete />
                          </IconButton>
                        </ButtonGroup>
                      );
                    },
                  },
                ],
              },
            ],
            [accessToken, fetchConnections, iModelId, synchronizationBaseUrl]
          )}
          emptyTableContent={
            "No existing connections, drop file above to create new connections"
          }
        />
      </div>
    </div>
  );
};
