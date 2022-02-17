/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import {
  SvgDelete,
  SvgImageFrame,
  SvgShare,
  SvgTag,
} from "@itwin/itwinui-icons-react";
import {
  ButtonGroup,
  IconButton,
  Table,
  Tag,
  TagContainer,
} from "@itwin/itwinui-react";
import React from "react";

import {
  GroupSavedviewsAPI,
  SavedViewSavedviewsAPI,
} from "../../../api/savedviews/generated";
import { GroupIdHrefMatcher } from "../../../api/savedviews/savedviewsClient";
import { CreateTypeFromInterface } from "../../../utils";
import { createSelectionStateController, toastErrorWithCode } from "../util";
import { SharedIcon } from "./SharedIcon";
import { SkeletonCell } from "./SkeletonCell";

interface SavedviewsTableProps {
  selected: string | undefined;
  groups: GroupSavedviewsAPI[];
  savedviews: Partial<SavedViewSavedviewsAPI>[];
  navigate: (savedviewId: string) => void;
  selectFn: (savedview: SavedViewSavedviewsAPI) => void;
  deleteFn: (id: string) => Promise<void>;
}

export const SavedviewsTable = ({
  selected,
  groups,
  savedviews,
  navigate,
  selectFn,
  deleteFn,
}: SavedviewsTableProps) => {
  const stateController = React.useCallback(
    createSelectionStateController<
      CreateTypeFromInterface<Partial<SavedViewSavedviewsAPI>>
    >(selected),
    [selected]
  );
  return (
    <Table<CreateTypeFromInterface<Partial<SavedViewSavedviewsAPI>>>
      getRowId={(o) => o.id as string}
      data={savedviews}
      useControlledState={stateController}
      onRowClick={(e, r) => {
        selectFn(r.original as SavedViewSavedviewsAPI);
      }}
      columns={React.useMemo(
        () => [
          {
            Header: "Table",
            columns: [
              {
                Header: <SvgShare style={{ width: 20 }} />,
                width: 50,
                accessor: "shared",
                Cell: (props) => {
                  return (
                    <SkeletonCell {...props}>
                      <SharedIcon shared={props.value} />
                    </SkeletonCell>
                  );
                },
              },
              {
                Header: "Name",
                accessor: "displayName",
                Cell: SkeletonCell,
              },
              {
                Header: "Group",
                id: "group",
                accessor: "id",
                Cell: (props) => {
                  const groupId =
                    props.row.original._links?.group?.href.match(
                      GroupIdHrefMatcher
                    )?.[0] ?? "";
                  let group = "";
                  if (groupId) {
                    group =
                      groups.find((group) => group.id === groupId)
                        ?.displayName ?? "";
                  }
                  return <SkeletonCell {...props}>{group}</SkeletonCell>;
                },
              },
              {
                Header: "Tags",
                id: "tags",
                accessor: "tags",
                Cell: (props) => {
                  return (
                    <SkeletonCell {...props}>
                      {(props.value?.length ?? 0) > 0 && (
                        <>
                          <SvgTag
                            style={{
                              height: 12,
                              width: 12,
                              opacity: 0.6,
                              marginRight: 12,
                            }}
                          />
                          <TagContainer>
                            {props.value?.map((tag) => (
                              <Tag variant="basic" key={tag.id}>
                                {tag.displayName}
                              </Tag>
                            ))}
                          </TagContainer>
                        </>
                      )}
                    </SkeletonCell>
                  );
                },
              },
              {
                Header: "Action",
                id: "btns",
                accessor: "id",
                Cell: (props) => {
                  const [deleting, setDeleting] = React.useState(false);
                  return (
                    <SkeletonCell {...props}>
                      <ButtonGroup>
                        <IconButton
                          styleType={"borderless"}
                          disabled={deleting}
                          onClick={(e) => {
                            setDeleting(true);
                            e.stopPropagation();
                            deleteFn(props.value ?? "").catch((e) => {
                              toastErrorWithCode(
                                e,
                                `Deleting savedviews '${props.row.original.displayName}' failed.`
                              );
                              setDeleting(false);
                            });
                          }}
                          title={"Delete savedview"}
                        >
                          <SvgDelete />
                        </IconButton>
                        <IconButton
                          styleType={"borderless"}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(props.value ?? "");
                          }}
                          title={"Show saved view"}
                        >
                          <SvgImageFrame />
                        </IconButton>
                      </ButtonGroup>
                    </SkeletonCell>
                  );
                },
              },
            ],
          },
        ],
        [deleteFn, groups, navigate]
      )}
      emptyTableContent={
        "No savedview created, use field above to create savedview."
      }
    />
  );
};
