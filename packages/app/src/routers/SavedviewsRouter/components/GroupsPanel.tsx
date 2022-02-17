/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import {
  Button,
  InputGroup,
  LabeledInput,
  ToggleSwitch,
} from "@itwin/itwinui-react";
import React from "react";

import {
  GroupSavedviewsAPI,
  GroupUpdateSavedviewsAPI,
} from "../../../api/savedviews/generated";
import { toastErrorWithCode } from "../util";
import { ButtonBar } from "./ButtonBar";

interface GroupsCreatePanelProps {
  group: GroupSavedviewsAPI | undefined;
  createFn: (displayName: string, shared?: boolean) => Promise<void>;
  updateFn: (id: string, payload: GroupUpdateSavedviewsAPI) => Promise<void>;
  onCancel?: () => void;
}

export const GroupCreatePanel = ({
  group,
  createFn,
  updateFn,
  onCancel,
}: GroupsCreatePanelProps) => {
  const [working, setWorking] = React.useState(false);
  const [displayName, setDisplayName] = React.useState("");
  const [shared, setShared] = React.useState(false);
  const [status, setStatus] = React.useState<{
    status?: "positive" | "warning" | "negative" | undefined;
    message?: string | undefined;
  }>({});

  const reset = React.useCallback(() => {
    setDisplayName(group ? group.displayName : "");
    setShared(group ? group.shared : false);
  }, [group]);

  React.useEffect(reset, [reset]);
  const displayNameRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (!working) {
      displayNameRef.current?.focus();
    }
  }, [working]);

  const submit = React.useCallback(() => {
    if (!displayName.trim()) {
      setStatus({
        status: "warning",
        message: "A name must be provided",
      });
      return;
    }
    setWorking(true);
    if (group) {
      const update: GroupUpdateSavedviewsAPI = {};
      if (displayName.trim() !== group.displayName) {
        update.displayName = displayName;
      }
      if (shared !== group.shared) {
        update.shared = shared;
      }
      if (Object.keys(update).length > 0) {
        updateFn(group.id, update)
          .then(() => {
            setStatus({
              status: "positive",
              message: "Group updated",
            });
          })
          .catch((e) => {
            toastErrorWithCode(e, "Group update failed.");
            setStatus({
              status: "negative",
              message: "Group update failed",
            });
          })
          .finally(() => {
            setWorking(false);
          });
      } else {
        setWorking(false);
      }
    } else {
      createFn(displayName, shared)
        .then(() => {
          setStatus({
            status: "positive",
            message: "Group created",
          });
          reset();
        })
        .catch(() => {
          setStatus({
            status: "negative",
            message: "Group creation failed",
          });
        })
        .finally(() => {
          setWorking(false);
        });
    }
  }, [createFn, displayName, group, reset, shared, updateFn]);
  return (
    <InputGroup
      status={status.status}
      message={status.message}
      style={{ maxWidth: 450 }}
    >
      <LabeledInput
        label="Group"
        disabled={working}
        ref={displayNameRef}
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            submit();
          }
        }}
      />
      <ToggleSwitch
        label="Shared"
        disabled={working}
        checked={shared}
        onChange={(e) => setShared(e.target.checked)}
      />
      <ButtonBar>
        <Button
          styleType="high-visibility"
          onClick={() => submit()}
          disabled={working}
        >
          {group ? "Update" : "Create"}
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
