/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { ProgressLinear, ProgressRadial } from "@itwin/itwinui-react";
import React from "react";

import "./DetailedStatus.scss";

interface DetailedStatusProps {
  progress?: number;
  text: string;
  status?: "positive" | "negative" | undefined;
  altIcon?: React.ReactNode;
}
export const DetailedStatus = ({
  progress,
  text,
  status,
  altIcon,
}: DetailedStatusProps) => (
  <div className={"detailed-status"}>
    {altIcon ?? (
      <ProgressRadial
        className={"status-icon"}
        indeterminate={true}
        status={status}
        size={"small"}
      />
    )}
    <div className="status-details">
      <div className={"status-text"}>{text}</div>
      {typeof progress !== "undefined" && <ProgressLinear value={progress} />}
    </div>
  </div>
);
