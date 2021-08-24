/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { SvgAdd } from "@itwin/itwinui-icons-react";
import { IconButton, LabeledInput, toaster } from "@itwin/itwinui-react";
import React from "react";

import { ProjectsClient } from "../../../api/projects/projectsClient";
import { useApiPrefix } from "../../../api/useApiPrefix";

interface AddMemberInputProps {
  projectId: string | undefined;
  accessToken: string;
  onSuccess(): Promise<void>;
}

export const AddMemberInput = ({
  projectId,
  accessToken,
  onSuccess,
}: AddMemberInputProps) => {
  const urlPrefix = useApiPrefix();
  const ref = React.useRef<HTMLInputElement>(null);

  const [addWorking, setAddWorking] = React.useState(false);
  const [addError, setAddError] = React.useState("");
  const [email, setEmail] = React.useState("");
  const addUser = React.useCallback(async () => {
    setAddError("");
    if (!projectId) {
      return;
    }
    if (!email) {
      setAddError("Please enter an email address");
      return;
    }
    setAddWorking(true);
    const newMember = email;
    const client = new ProjectsClient(urlPrefix, accessToken);
    try {
      await client.addProjectMember(projectId, newMember);
      await onSuccess();
      setEmail("");
    } catch (error) {
      toaster.negative(await client.extractAPIErrorMessage(error), {
        hasCloseButton: true,
      });
    }
    setAddWorking(false);
    ref.current?.focus({ preventScroll: true });
  }, [accessToken, email, onSuccess, projectId, urlPrefix]);

  return (
    <div className={"input-with-button"}>
      <LabeledInput
        ref={ref}
        disabled={addWorking}
        label={"Add member"}
        placeholder={"Enter email address"}
        value={email}
        message={addError}
        status={(addError && "negative") || undefined}
        onChange={(event) => {
          const {
            target: { value },
          } = event;
          setEmail(value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            void addUser();
          }
          if (event.key === "Escape") {
            setEmail("");
          }
        }}
      />
      <IconButton onClick={addUser} disabled={addWorking}>
        <SvgAdd />
      </IconButton>
    </div>
  );
};
