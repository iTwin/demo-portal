/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { SvgCheckmark } from "@itwin/itwinui-icons-react";
import React from "react";

import "./SharedIcon.scss";

export interface SharedIconProps {
  shared: boolean | undefined;
}

export const SharedIcon = ({ shared }: SharedIconProps) => (
  <div>
    {shared ? <SvgCheckmark className="shared-checkmark" /> : undefined}
  </div>
);
