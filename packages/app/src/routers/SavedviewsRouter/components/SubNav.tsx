/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { SvgImageFrame, SvgList, SvgTag } from "@itwin/itwinui-icons-react";
import { ButtonGroup, IconButton } from "@itwin/itwinui-react";
import { RouteComponentProps } from "@reach/router";
import React from "react";

export const SubNav = ({
  navigate,
  path,
}: Pick<RouteComponentProps, "navigate" | "path">) => {
  const isGroups = path?.endsWith("groups");
  const isTags = path?.endsWith("tags");
  const isRoot = !isGroups && !isTags;
  const relativePath = isRoot ? "" : "../";
  return (
    <ButtonGroup>
      <IconButton
        disabled={isRoot}
        onClick={() => {
          void navigate?.("..");
        }}
        title={"Saved views"}
      >
        <SvgImageFrame />
      </IconButton>
      <IconButton
        disabled={isGroups}
        onClick={() => {
          void navigate?.(`${relativePath}groups`);
        }}
        title={"Groups"}
      >
        <SvgList />
      </IconButton>
      <IconButton
        disabled={isTags}
        onClick={() => {
          void navigate?.(`${relativePath}tags`);
        }}
        title={"Tags"}
      >
        <SvgTag />
      </IconButton>
    </ButtonGroup>
  );
};
