import { ErrorPage } from "@itwin/itwinui-react";
import React, { useEffect, useState } from "react";
import { useConfig } from "../../config/ConfigProvider";
import { useAuth } from "./AuthProvider";

export const withAuthorization = () => {
  const HOC = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const { auth } = useConfig();
    const { userInfo } = useAuth();

    useEffect(() => {
      if (
        auth?.whitelistedUltimateIds &&
        userInfo?.featureTracking?.ultimateSite
      ) {
        setIsAuthorized(
          auth.whitelistedUltimateIds.includes(
            userInfo.featureTracking.ultimateSite
          )
        );
      }
    }, [auth, userInfo]);

    return !isAuthorized && <ErrorPage errorType="401" />;
  };
  // HOC.displayName = `withAuthorization_{compDisplayName}`;

  return HOC;
};
