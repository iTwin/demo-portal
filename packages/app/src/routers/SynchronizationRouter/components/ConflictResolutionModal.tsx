/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import {
  Button,
  InputGroup,
  Modal,
  ModalButtonBar,
  Radio,
  Text,
} from "@itwin/itwinui-react";
import byteSize from "byte-size";
import React from "react";

import { FileStorageAPI } from "../../../api/storage/generated";
import { StorageClient } from "../../../api/storage/storageClient";
import { StorageFileSynchronizationAPI } from "../../../api/synchronization/generated";
import { useApiPrefix } from "../../../api/useApiPrefix";
import "./ConflictResolutionModal.scss";
import { ConnectorIcon } from "./ConnectorIcon";

interface ConflictResolutionModalProps {
  closeModal(error: any | null, success?: unknown): void;
  sourceFile: StorageFileSynchronizationAPI | undefined;
  iModelName?: string;
  accessToken: string;
}

export const ConflictResolutionModal = ({
  closeModal,
  sourceFile,
  iModelName,
  accessToken,
}: ConflictResolutionModalProps) => {
  const urlPrefix = useApiPrefix();

  const [storageFile, setStorageFile] = React.useState<FileStorageAPI>();
  const isLoading = !storageFile?.displayName;

  const [value, setValue] = React.useState("");
  const changeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setValue(value);
  };

  React.useEffect(() => {
    if (!sourceFile?.storageFileId) {
      setStorageFile(undefined);
      setValue("");
      return;
    }
    new StorageClient(urlPrefix, accessToken)
      .getFile(sourceFile.storageFileId)
      .then(({ file }) => {
        setStorageFile(file);
      })
      .catch(console.error);
  }, [accessToken, sourceFile, urlPrefix]);

  return (
    <Modal
      isOpen={!!sourceFile}
      title={`Conflict resolution${iModelName ? ` for ${iModelName}` : ""}`}
      onClose={() => {
        closeModal(new Error("Conflict resolution canceled"));
        setValue("");
      }}
    >
      <div className={"conflict-resolution-modal"}>
        <span>A file with the same name exists:</span>
        <div className={"file-description"} style={{ flexDirection: "row" }}>
          <ConnectorIcon connectorType={sourceFile?.connectorType} />
          <div style={{ flexDirection: "column" }}>
            <Text isSkeleton={isLoading} as={"div"}>
              {storageFile?.displayName}
            </Text>
            <Text
              className={"iui-text-small"}
              isSkeleton={isLoading}
              as={"div"}
              style={{ flexDirection: "row" }}
            >
              <span>{byteSize(storageFile?.size ?? 0).toString()}</span>
              <span>
                {new Date(
                  storageFile?.lastModifiedDateTime ?? ""
                ).toLocaleString()}
              </span>
            </Text>
          </div>
        </div>
        <InputGroup>
          <Radio
            name={"operation"}
            onChange={changeValue}
            value={"Update"}
            label={"Replace existing file"}
            required={true}
          />
          <Radio
            name={"operation"}
            onChange={changeValue}
            value={"Rename"}
            label={"Upload and rename automatically"}
            required={true}
          />
        </InputGroup>
      </div>
      <ModalButtonBar>
        <Button
          styleType="high-visibility"
          disabled={!value}
          onClick={() => {
            closeModal(null, value);
            setValue("");
          }}
        >
          Finish
        </Button>
        <Button
          onClick={() => {
            closeModal(new Error("Conflict resolution canceled"));
            setValue("");
          }}
        >
          Cancel
        </Button>
      </ModalButtonBar>
    </Modal>
  );
};
