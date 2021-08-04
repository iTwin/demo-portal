/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import "./MainContainer.scss";

const MainContainer = ({
  header,
  sidebar,
  children,
}: {
  header: React.ReactNode;
  sidebar?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <div className={"full-page-container"}>
      <div className={"full-height-column"}>
        {header}
        <div className={"full-height-row"}>
          {sidebar}
          <div className={"full-page-content"}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
