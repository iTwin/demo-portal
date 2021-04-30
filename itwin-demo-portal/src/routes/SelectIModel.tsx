import { Link, RouteComponentProps } from "@reach/router";
import React from "react";

export interface IModelRouteProps extends RouteComponentProps {
  projectId?: string;
}
export const SelectIModel = (props: IModelRouteProps) => (
  <Link to={`imodel/${process.env.IMJS_IMODEL_ID ?? ""}`}>
    Open default iModel (should be in {props.projectId})
  </Link>
);
