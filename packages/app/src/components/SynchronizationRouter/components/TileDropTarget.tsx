/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { SvgRemove, SvgUpload } from "@itwin/itwinui-icons-react";
import React from "react";

import { IModelBridgeType } from "../../../api/synchronization/generated";
import { BridgeIcon } from "./BridgeIcon";
import "./TileDropTarget.scss";

interface TileDropTargetProps {
  isDisabled: boolean;
}

export const TileDropTarget = ({ isDisabled = false }: TileDropTargetProps) => (
  <div className={"tile-drop-target"}>
    <div className={"tile-upload-options"}>
      <BridgeIcon bridgeType={IModelBridgeType.MSTN} />
      <BridgeIcon bridgeType={IModelBridgeType.REVIT} />
      <BridgeIcon bridgeType={IModelBridgeType.NWD} />
      <BridgeIcon bridgeType={IModelBridgeType.IFC} />
    </div>
    {isDisabled ? <SvgRemove /> : <SvgUpload className={"tile-upload-icon"} />}
    <div className={"tile-upload-text"}>
      {isDisabled ? "Upload already in progress" : "Drop to upload"}
    </div>
  </div>
);
