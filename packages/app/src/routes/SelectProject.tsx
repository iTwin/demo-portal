/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { Link, RouteComponentProps } from "@reach/router";
import React from "react";

export const SelectProject = (props: RouteComponentProps) => (
  <Link to={`project/${process.env.IMJS_CONTEXT_ID ?? ""}`}>
    Select default project
  </Link>
);
