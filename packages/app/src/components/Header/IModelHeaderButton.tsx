/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { IModelFull, IModelThumbnail } from "@itwin/imodel-browser";
import { HeaderButton } from "@itwin/itwinui-react";
import { useNavigate } from "@reach/router";
import classNames from "classnames";
import React from "react";

import { useApiData } from "../../api/useApiData";
import "./IModelHeaderButton.scss";

interface IModelHeaderButtonProps {
  accessToken?: string;
  iModelId?: string;
  projectId?: string;
  section?: string;
}
export const IModelHeaderButton = ({
  iModelId,
  section,
  projectId,
  accessToken,
}: IModelHeaderButtonProps) => {
  const navigate = useNavigate();
  const {
    results: { iModel },
  } = useApiData<{ iModel: IModelFull }>({
    accessToken,
    url: `https://api.bentley.com/imodels/${iModelId}`,
  });
  return (
    <HeaderButton
      key="iModel"
      name={iModel ? iModel?.displayName : "Fetching iModel"}
      description={iModel?.description}
      onClick={() => navigate(`/${section}/project/${projectId}`)}
      className={classNames(!iModel && "iui-skeleton")}
      isActive={!!iModel?.displayName}
      startIcon={
        !!iModel?.displayName ? (
          <IModelThumbnail
            className={"imodel-header-icon"}
            iModelId={iModelId ?? ""}
            accessToken={accessToken}
          />
        ) : (
          undefined
        )
      }
    />
  );
};
