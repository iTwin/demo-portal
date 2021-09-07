/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { RouteComponentProps, useNavigate } from "@reach/router";
import React from "react";

import { RolesProjectsAPI } from "../../api/projects/generated";
import { useApiData } from "../../api/useApiData";
import { UpdateRole } from "./components/update-role/UpdateRole";
import "./RoleBase.scss";
import { useRoleConfig } from "./useRoleConfig";

interface EditProps extends RouteComponentProps {
  accessToken: string;
  projectId?: string;
  roleId?: string;
}

// Not safe, but works for now.
const useUpdateRoleLoadingStyler = (loading: boolean) => {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    ref.current
      ?.querySelectorAll(
        ".iui-input[name=displayName], .iui-input[name=description], .iui-checkbox .iui-label"
      )
      .forEach((element) =>
        element.classList[loading ? "add" : "remove"]("iui-skeleton")
      );
  }, [loading]);
  return { ref };
};

export const RoleEdit = ({
  accessToken,
  projectId = "",
  roleId = "",
}: EditProps) => {
  const {
    results: { roles },
    refreshData,
  } = useApiData<RolesProjectsAPI>({
    accessToken,
    url: `https://api.bentley.com/projects/${projectId}/roles`,
  });
  const initialRole = React.useMemo(() => {
    const role = roles?.find((role) => role.id === roleId);
    return {
      id: role?.id ?? "",
      displayName: role?.displayName ?? "",
      description: role?.description ?? "",
      permissions: role?.permissions ?? [],
    };
  }, [roleId, roles]);
  const navigate = useNavigate();
  const goBack = () => navigate?.(-1);
  const refreshAndGoBack = React.useCallback(async () => {
    await refreshData();
    navigate?.(-1);
  }, [refreshData, navigate]);

  const { ref } = useUpdateRoleLoadingStyler(!roles);
  return (
    <div ref={ref} className={"idp-scrolling-role-base"}>
      <div className={"idp-content-margins"}>
        <UpdateRole
          key={initialRole.id}
          accessToken={accessToken}
          projectId={projectId}
          roleId={roleId}
          initialRole={initialRole}
          onClose={goBack}
          onSuccess={refreshAndGoBack}
          {...useRoleConfig()}
        />
      </div>
    </div>
  );
};
