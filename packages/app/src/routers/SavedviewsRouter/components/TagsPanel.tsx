/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { Button, InputGroup, LabeledInput, Text } from "@itwin/itwinui-react";
import React from "react";

import {
  TagSavedviewsAPI,
  TagUpdateSavedviewsAPI,
} from "../../../api/savedviews/generated";
import { toastErrorWithCode } from "../util";
import { ButtonBar } from "./ButtonBar";

interface TagCreatePanelProps {
  tag: TagSavedviewsAPI | undefined;
  createFn: (displayName: string) => Promise<void>;
  updateFn: (id: string, payload: TagUpdateSavedviewsAPI) => Promise<void>;
  onCancel?: () => void;
}

export const TagPanel = ({
  tag,
  createFn,
  updateFn,
  onCancel,
}: TagCreatePanelProps) => {
  const [working, setWorking] = React.useState(false);
  const [displayName, setDisplayName] = React.useState("");
  const [status, setStatus] = React.useState<{
    status?: "positive" | "warning" | "negative" | undefined;
    message?: string | undefined;
  }>({});
  const reset = React.useCallback(() => {
    setDisplayName(tag ? tag.displayName : "");
  }, [tag]);
  React.useEffect(reset, [reset]);
  const displayNameRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (!working) {
      displayNameRef.current?.focus();
    }
  }, [working]);

  const submit = React.useCallback(() => {
    if (!displayName.trim()) {
      setStatus({ status: "warning", message: "A name must be provided" });
      return;
    }
    setWorking(true);
    if (tag) {
      const update: TagUpdateSavedviewsAPI = {};
      if (displayName.trim() !== tag.displayName) {
        update.displayName = displayName;
      }
      if (Object.keys(update).length > 0) {
        updateFn(tag.id, update)
          .then(() => {
            setStatus({
              status: "positive",
              message: "Tag updated",
            });
          })
          .catch((e) => {
            toastErrorWithCode(e, "Tag update failed.");
            setStatus({
              status: "negative",
              message: "Tag update failed",
            });
          })
          .finally(() => {
            setWorking(false);
          });
      } else {
        setWorking(false);
      }
    } else {
      createFn(displayName)
        .then(() => {
          setStatus({
            status: "positive",
            message: "Tag created",
          });
          reset();
        })
        .catch((e) => {
          toastErrorWithCode(e, "Tag creation failed.");
          setStatus({
            status: "negative",
            message: "Tag creation failed",
          });
        })
        .finally(() => {
          setWorking(false);
        });
    }
  }, [displayName, tag, updateFn, reset, createFn]);
  return (
    <InputGroup
      status={status.status}
      message={status.message}
      style={{ maxWidth: 450 }}
    >
      <Text>{tag?.id ?? ""}</Text>
      <LabeledInput
        label="Tag"
        ref={displayNameRef}
        disabled={working}
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            submit();
          }
        }}
      />
      <ButtonBar>
        <Button
          styleType="high-visibility"
          onClick={() => submit()}
          disabled={working}
        >
          {tag ? "Update" : "Create"}
        </Button>
        <Button
          onClick={() => {
            reset();
            onCancel?.();
          }}
          disabled={working}
        >
          Cancel
        </Button>
      </ButtonBar>
    </InputGroup>
  );
};
