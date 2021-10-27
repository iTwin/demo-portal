/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import {
  ManageVersions as ACRManageVersions,
  ManageVersionsProps,
} from "@itwin/manage-versions-react";
import { RouteComponentProps, useLocation, useNavigate } from "@reach/router";
import React from "react";

import { useApiPrefix } from "../../api/useApiPrefix";
import "./ManageVersions.scss";

type ManageVersionsTabs = Required<ManageVersionsProps>["currentTab"];

const CHANGE_TAB_SEARCHSTRING = "?changes";
export interface VersionsProps extends RouteComponentProps {
  iTwinId?: string;
  iModelId?: string;
  accessToken: string;
}
export const ManageVersions = ({
  iModelId = "",
  iTwinId = "",
  accessToken,
  navigate: localNavigate,
}: VersionsProps) => {
  const location = useLocation();
  const serverEnvironmentPrefix = useApiPrefix();
  const globalNavigate = useNavigate();
  const [tab, setTab] = React.useState<ManageVersionsTabs>(
    location.search === CHANGE_TAB_SEARCHSTRING ? 1 : 0
  );
  React.useEffect(() => {
    const search = tab === 1 ? CHANGE_TAB_SEARCHSTRING : "";
    if (location.search !== search) {
      void localNavigate?.(`./${search}`, {
        replace: true,
      });
    }
  }, [location.search, localNavigate, tab]);

  return (
    <div className="manage-versions-with-side-and-splitter">
      <ACRManageVersions
        accessToken={accessToken}
        imodelId={iModelId}
        apiOverrides={{ serverEnvironmentPrefix }}
        onViewClick={(version) =>
          globalNavigate(
            `/view/itwin/${iTwinId}/imodel/${iModelId}/version/${version.id}`
          )
        }
        onTabChange={setTab}
        currentTab={tab}
      />
    </div>
  );
};
