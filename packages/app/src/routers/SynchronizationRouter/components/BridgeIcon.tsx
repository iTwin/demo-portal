/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import { ConnectorTypeSynchronizationAPI } from "../../../api/synchronization/generated";
import { ReactComponent as SvgDwg } from "../../../svg/autocad.svg";
import { ReactComponent as SvgDgn } from "../../../svg/dgndocument.svg";
import { ReactComponent as SvgDocument } from "../../../svg/document.svg";
import { ReactComponent as SvgIfcIcon } from "../../../svg/ifcicon.svg";
import { ReactComponent as SvgRevit } from "../../../svg/revitdocument.svg";
import { ReactComponent as SvgNwd } from "../../../svg/unknowndocument.svg";
import "./BridgeIcon.scss";

interface BridgeIconProps {
  bridgeType?: ConnectorTypeSynchronizationAPI;
}
export const BridgeIcon = ({ bridgeType }: BridgeIconProps) =>
  ({
    [ConnectorTypeSynchronizationAPI.MSTN]: <SvgDgn title={"MSTN"} />,
    [ConnectorTypeSynchronizationAPI.REVIT]: <SvgRevit title={"Revit"} />,
    [ConnectorTypeSynchronizationAPI.NWD]: <SvgNwd title={"Nwd"} />,
    [ConnectorTypeSynchronizationAPI.IFC]: (
      <div className={"composite-document-icon"} title={"Ifc"}>
        <SvgDocument />
        <SvgIfcIcon className={"icon-in-document"} />
      </div>
    ),
    [ConnectorTypeSynchronizationAPI.DWG]: <SvgDwg title={"DWG"} />,
    [ConnectorTypeSynchronizationAPI.NotSet]: null,
  }[bridgeType ?? ConnectorTypeSynchronizationAPI.NotSet]);
