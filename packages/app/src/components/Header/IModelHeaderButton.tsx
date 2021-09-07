/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { IModelFull, IModelThumbnail } from "@itwin/imodel-browser-react";
import { HeaderButton } from "@itwin/itwinui-react";
import { useNavigate } from "@reach/router";
import classNames from "classnames";
import React from "react";

import { useApiData } from "../../api/useApiData";
import { useApiPrefix } from "../../api/useApiPrefix";
import "./IModelHeaderButton.scss";

interface IModelHeaderButtonProps {
  accessToken?: string;
  iModelId?: string;
  iTwinId?: string;
  section?: string;
}
export const IModelHeaderButton = ({
  iModelId,
  section,
  iTwinId,
  accessToken,
}: IModelHeaderButtonProps) => {
  const navigate = useNavigate();
  const {
    results: { iModel },
  } = useApiData<{ iModel: IModelFull }>({
    accessToken,
    url: `https://api.bentley.com/imodels/${iModelId}`,
  });
  const serverEnvironmentPrefix = useApiPrefix();
  return (
    <HeaderButton
      key="iModel"
      name={iModel ? iModel?.displayName : "Fetching iModel..."}
      description={iModel?.description}
      onClick={() => navigate(`/${section}/itwin/${iTwinId}`)}
      className={classNames(!iModel && "iui-skeleton")}
      isActive={!!iModel?.displayName && section !== "view"}
      startIcon={
        !!iModel?.displayName ? (
          <IModelThumbnail
            className={"imodel-header-icon"}
            iModelId={iModelId ?? ""}
            accessToken={accessToken}
            apiOverrides={{ serverEnvironmentPrefix }}
          />
        ) : (
          undefined
        )
      }
    />
  );
};
