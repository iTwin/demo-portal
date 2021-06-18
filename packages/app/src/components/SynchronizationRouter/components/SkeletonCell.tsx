/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Body } from "@itwin/itwinui-react";
import React, { PropsWithChildren } from "react";

import "./SkeletonCell.scss";

type SkeletonCellProps = PropsWithChildren<{
  value: any;
  row: {
    original: any;
  };
}>;
export const SkeletonCell = (props: SkeletonCellProps) => {
  if (Object.keys(props.row.original).length !== 0) {
    return props.children ?? props.value;
  }
  return <Body isSkeleton={true}>Fetching</Body>;
};

export const skeletonRow = {};
export const skeletonRows = [skeletonRow, skeletonRow, skeletonRow];
