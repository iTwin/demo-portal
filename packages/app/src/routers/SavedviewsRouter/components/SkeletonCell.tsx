/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { Body } from "@itwin/itwinui-react";
import React, { PropsWithChildren } from "react";

import "./SkeletonCell.scss";

export type SkeletonCellProps = PropsWithChildren<{
  value: any;
  row: {
    original: any;
  };
}>;
export const SkeletonCell = (props: SkeletonCellProps) => {
  if (Object.keys(props.row.original).length !== 0) {
    return (props.children ?? (
      <span title={props.value}>{props.value}</span>
    )) as React.ReactElement;
  }
  return <Body isSkeleton={true}>Fetching</Body>;
};

export const skeletonRow = {};
export const skeletonRows = [skeletonRow, skeletonRow, skeletonRow];
