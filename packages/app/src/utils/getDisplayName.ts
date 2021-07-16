/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

export const getDisplayName = (wrappedComponent: React.ComponentType) => {
  return (
    wrappedComponent.displayName ?? wrappedComponent.name ?? "WrappedComponent"
  );
};
