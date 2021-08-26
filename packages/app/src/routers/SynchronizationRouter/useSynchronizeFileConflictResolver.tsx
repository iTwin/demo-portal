/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import { StorageFileSynchronizationAPI } from "../../api/synchronization/generated";
import { ConflictResolutionModal } from "./components/ConflictResolutionModal";

type PromiseCallbacksRefObject = {
  resolve(success: string): void;
  reject(reason?: any): void;
};

export const useSynchronizeFileConflictResolver = (
  accessToken: string,
  iModelName?: string
) => {
  const [sourceFile, setSourceFile] = React.useState<
    StorageFileSynchronizationAPI
  >();
  const promisesRef = React.useRef<PromiseCallbacksRefObject | null>(null);
  const closeModal = (error: any | null, success?: string) => {
    setSourceFile(undefined);
    if (error !== null) {
      promisesRef.current?.reject(error);
    } else {
      promisesRef.current?.resolve(success ?? "");
    }
    promisesRef.current = null;
  };

  const openModal = React.useCallback(
    (storageSourcefile: StorageFileSynchronizationAPI) => {
      setSourceFile(storageSourcefile);
      return new Promise<string>((resolve, reject) => {
        promisesRef.current = { resolve, reject };
      });
    },
    []
  );

  return {
    conflictResolutionModalNode: (
      <ConflictResolutionModal
        accessToken={accessToken}
        iModelName={iModelName}
        closeModal={closeModal}
        sourceFile={sourceFile}
      />
    ),
    openConflictResolutionModal: openModal,
  };
};
