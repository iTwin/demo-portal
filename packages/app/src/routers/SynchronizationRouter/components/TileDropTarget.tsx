/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { SvgRemove, SvgUpload } from "@itwin/itwinui-icons-react";
import React from "react";

import { ConnectorTypeSynchronizationAPI } from "../../../api/synchronization/generated";
import { BridgeIcon } from "./BridgeIcon";
import "./TileDropTarget.scss";

interface TileDropTargetProps {
  isDisabled: boolean;
}

export const TileDropTarget = ({ isDisabled = false }: TileDropTargetProps) => (
  <div className={"tile-drop-target"}>
    {!isDisabled && (
      <div className={"tile-upload-options"}>
        <BridgeIcon bridgeType={ConnectorTypeSynchronizationAPI.MSTN} />
        <BridgeIcon bridgeType={ConnectorTypeSynchronizationAPI.REVIT} />
        <BridgeIcon bridgeType={ConnectorTypeSynchronizationAPI.NWD} />
        <BridgeIcon bridgeType={ConnectorTypeSynchronizationAPI.IFC} />
        <BridgeIcon bridgeType={ConnectorTypeSynchronizationAPI.DWG} />
      </div>
    )}
    {isDisabled ? (
      <SvgRemove className={"tile-upload-icon"} />
    ) : (
      <SvgUpload className={"tile-upload-icon"} />
    )}
    <div className={"tile-upload-text"}>
      {isDisabled ? "Upload already in progress" : "Drop to upload"}
    </div>
  </div>
);
