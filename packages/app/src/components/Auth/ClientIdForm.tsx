/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import {
  Body,
  Button,
  LabeledInput,
  Modal,
  ModalButtonBar,
} from "@itwin/itwinui-react";
import React from "react";

interface ClientIdFormProps {
  onSave(clientId: string): void;
}
export const ClientIdForm = ({ onSave }: ClientIdFormProps) => {
  const [clientId, setClientId] = React.useState("");
  return (
    <Modal
      title={"Registered application client id required"}
      isOpen={true}
      isDismissible={false}
    >
      <Body>
        This demonstration portal require a client Id registered from
        developper.bentley.com.
      </Body>
      <LabeledInput
        label="Client Id"
        onChange={({ target: { value } }) => setClientId(value)}
      />
      <ModalButtonBar>
        <Button
          onClick={() => onSave(clientId)}
          disabled={!clientId}
          styleType={"cta"}
        >
          Save and Continue
        </Button>
      </ModalButtonBar>
    </Modal>
  );
};
