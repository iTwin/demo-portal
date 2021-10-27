/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import {
  ApiOverrides,
  ProjectFull,
  ProjectGrid,
  ProjectGridProps,
} from "@itwin/imodel-browser-react";
import {
  SvgCalendar,
  SvgList,
  SvgSearch,
  SvgStarHollow,
} from "@itwin/itwinui-icons-react";
import {
  ButtonGroup,
  HorizontalTab,
  HorizontalTabs,
  IconButton,
  LabeledInput,
} from "@itwin/itwinui-react";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import { RouteComponentProps, useLocation } from "@reach/router";
import React, { useState } from "react";

import { useApiPrefix } from "../../api/useApiPrefix";
import { ai, trackEvent } from "../../services/telemetry";
import { useCreateIModelAction } from "../CRUDRouter/useCreateIModelAction";
import { useCreateITwinAction } from "../CRUDRouter/useCreateITwinAction";
import { useDeleteITwinAction } from "../CRUDRouter/useDeleteITwinAction";
import { useEditITwinAction } from "../CRUDRouter/useEditITwinAction";
import { useMembersITwinAction } from "../MembersRouter/useMembersITwinAction";
import "./SelectITwin.scss";

export interface SelectITwinProps
  extends RouteComponentProps<ProjectGridProps> {
  iTwinId?: string;
  accessToken: string;
}

const ITWIN_TYPE_MAP = ["", "?recents", "?myitwins"];

const tabsWithIcons = [
  <HorizontalTab
    key="favorite"
    label="Favorite iTwins"
    startIcon={<SvgStarHollow />}
  />,
  <HorizontalTab
    key="recents"
    label="Recent iTwins"
    startIcon={<SvgCalendar />}
  />,
  <HorizontalTab key="all" label="My iTwins" startIcon={<SvgList />} />,
];

const SelectITwin = ({
  accessToken,
  navigate,
  ...gridProps
}: SelectITwinProps) => {
  const location = useLocation();

  const [iTwinType, setITwinType] = useState(() =>
    ITWIN_TYPE_MAP.includes(location.search)
      ? ITWIN_TYPE_MAP.indexOf(location.search)
      : 0
  );
  React.useEffect(() => {
    const search = ITWIN_TYPE_MAP[iTwinType];
    if (location.search !== search) {
      void navigate?.(`./${search}`, {
        replace: true,
      });
    }
  }, [location.search, navigate, iTwinType]);
  const { createAction } = useCreateIModelAction({ navigate });
  const { createIconButton } = useCreateITwinAction({ navigate });
  const { editAction } = useEditITwinAction({ navigate });
  const { deleteDialog, deleteAction, refreshKey } = useDeleteITwinAction({
    accessToken,
  });
  const { membersAction } = useMembersITwinAction();

  const iTwinActions = React.useMemo(() => {
    return [createAction, editAction, membersAction, deleteAction];
  }, [createAction, editAction, membersAction, deleteAction]);

  const [searchValue, setSearchValue] = React.useState("");
  const [searchParam, setSearchParam] = React.useState("");
  const startSearch = React.useCallback(() => {
    setSearchParam(searchValue);
  }, [searchValue]);

  const serverEnvironmentPrefix = useApiPrefix();
  const apiOverrides = React.useMemo<ApiOverrides<ProjectFull[]>>(
    () => ({ serverEnvironmentPrefix }),
    [serverEnvironmentPrefix]
  );
  const stringsOverrides = React.useMemo(
    () => ({ noProjects: "No iTwins found." }),
    []
  );
  return (
    <>
      <div className="idp-scrolling-container select-itwin">
        <HorizontalTabs
          labels={tabsWithIcons}
          onTabSelected={setITwinType}
          activeIndex={iTwinType}
          type={"borderless"}
          contentClassName="grid-holding-tab"
          tabsClassName="grid-holding-tabs"
        >
          <div className={"title-section idp-content-margins"}>
            <ButtonGroup>{createIconButton}</ButtonGroup>
            <div className={"inline-input-with-button"}>
              <LabeledInput
                label={"Search"}
                placeholder={"Will search in name or number"}
                displayStyle={"inline"}
                value={searchValue}
                onChange={(event) => {
                  const {
                    target: { value },
                  } = event;
                  setSearchValue(value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    startSearch();
                  }
                  if (event.key === "Escape") {
                    setSearchValue("");
                    setSearchParam("");
                  }
                }}
              />
              <IconButton onClick={startSearch}>
                <SvgSearch />
              </IconButton>
            </div>
          </div>
          <div className={"idp-scrolling-content"}>
            <ProjectGrid
              accessToken={accessToken}
              requestType={
                iTwinType === 0 ? "favorites" : iTwinType === 1 ? "recents" : ""
              }
              onThumbnailClick={(iTwin) => {
                trackEvent("iTwinClicked", { iTwin: iTwin.id });
                navigate?.(`itwin/${iTwin.id}`);
              }}
              filterOptions={searchParam}
              projectActions={iTwinActions}
              apiOverrides={apiOverrides}
              key={refreshKey}
              stringsOverrides={stringsOverrides}
              {...gridProps}
            />
          </div>
        </HorizontalTabs>
      </div>
      {deleteDialog}
    </>
  );
};

export default withAITracking(
  ai.reactPlugin,
  SelectITwin,
  "SelectITwin",
  "full-height-container"
);
