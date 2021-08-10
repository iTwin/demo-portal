/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { SvgFlag } from "@itwin/itwinui-icons-react";
import { HeaderButton } from "@itwin/itwinui-react";
import { useNavigate } from "@reach/router";
import classNames from "classnames";
import React from "react";

import { useApiData } from "../../api/useApiData";

interface IdAndDisplay {
  id: string;
  displayName?: string;
}

interface VersionHeaderButtonProps {
  versionId?: string;
  accessToken?: string;
  iModelId?: string;
  projectId?: string;
  section?: string;
}
export const VersionHeaderButton = ({
  iModelId,
  section,
  projectId,
  accessToken,
  versionId,
}: VersionHeaderButtonProps) => {
  const navigate = useNavigate();
  const {
    results: { namedVersion: fetchedVersion },
  } = useApiData<{ namedVersion: IdAndDisplay }>({
    accessToken: versionId ? accessToken : undefined,
    url: `https://api.bentley.com/imodels/${iModelId}/namedversions/${versionId}`,
  });
  const namedVersion = versionId
    ? fetchedVersion
    : {
        displayName: "Latest checkpoint",
      };
  return section === "view" ? (
    <HeaderButton
      key="namedVersion"
      name={namedVersion ? namedVersion?.displayName : "Fetching version"}
      onClick={() =>
        navigate(`/manage-versions/project/${projectId}/imodel/${iModelId}`)
      }
      className={classNames(!namedVersion && "iui-skeleton")}
      isActive={!!namedVersion?.displayName}
      startIcon={<SvgFlag />}
    />
  ) : null;
};
