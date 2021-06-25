/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import expand from "dotenv-expand";
import { config } from "dotenv-flow";

export interface User {
  username: string;
  password: string;
}

const envResult = config({ silent: true });
if (envResult.error) {
  throw envResult.error;
}
expand(envResult);

export const User1: User = {
  username: process.env.GenericUserName1 ?? "",
  password: process.env.GenericUserPassword1 ?? "",
};
export const SiteUrl: string = process.env.SiteUrl ?? "";

export const BrowserName = process.env.BROWSER ?? "chromium";

// for DesignReview tests
export const DRProjectID = process.env.DR_PROJECT_ID ?? "Missing Project Id";
export const DRIModelID = process.env.DR_IMODEL_ID ?? "Missing iModel Id";
export const DRChangeSetID =
  process.env.DR_CHANGESET_ID ?? "Missing Changeset Id";

export const ProjectNameContainingIModel =
  process.env.PROJECT_NAME_CONTAINING_IMODEL ?? "DesignReviewTestDatasets";
