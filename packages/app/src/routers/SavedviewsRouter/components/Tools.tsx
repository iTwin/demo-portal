import {
  SvgCloud,
  SvgSettings,
  SvgSync,
  SvgWindow,
} from "@itwin/itwinui-icons-react";
import { ButtonGroup, IconButton } from "@itwin/itwinui-react";
import React from "react";

import { useApiPrefix } from "../../../api/useApiPrefix";

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
interface DebugToolsProps {
  projectId: string;
  iModelId: string;
}

export const DebugTools = ({ iModelId, projectId }: DebugToolsProps) => {
  const urlPrefix = useApiPrefix();

  return (
    <ButtonGroup>
      <IconButton
        styleType={"borderless"}
        onClick={() => {
          window.open(
            `https://${
              urlPrefix ? urlPrefix + "-" : ""
            }connect-itwinbridgeportal.bentley.com/${projectId}/${iModelId}`,
            "synchronizerportal"
          );
        }}
        title={"Temporary debug tool: Open iTwin Synchronizer Portal"}
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
  );
};
