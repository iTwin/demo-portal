import { Link, RouteComponentProps } from "@reach/router";
import React from "react";

export const SelectProject = (props: RouteComponentProps) => (
  <Link to={`project/${process.env.IMJS_CONTEXT_ID ?? ""}`}>
    Select default project
  </Link>
);
