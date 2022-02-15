/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { SvgDelete, SvgShare } from "@itwin/itwinui-icons-react";
import { ButtonGroup, IconButton, Table } from "@itwin/itwinui-react";
import React from "react";

import { GroupSavedviewsAPI } from "../../../api/savedviews/generated";
import { CreateTypeFromInterface } from "../../../utils";
import { createSelectionStateController, toastErrorWithCode } from "../util";
import { SharedIcon } from "./SharedIcon";
import { SkeletonCell } from "./SkeletonCell";

interface GroupsTableProps {
  selected: string | undefined;
  groups: Partial<GroupSavedviewsAPI>[];
  selectFn: (group: GroupSavedviewsAPI) => void;
  deleteGroup: (id: string) => Promise<void>;
}

export const GroupsTable = ({
  selected,
  groups,
  deleteGroup,
  selectFn,
}: GroupsTableProps) => {
  const stateController = React.useCallback(
    createSelectionStateController<
      CreateTypeFromInterface<Partial<GroupSavedviewsAPI>>
    >(selected),
    [selected]
  );

  return (
    <Table<CreateTypeFromInterface<Partial<GroupSavedviewsAPI>>>
      data={groups}
      getRowId={(o) => o.id as string}
      useControlledState={stateController}
      onRowClick={(e, r) => {
        selectFn(r.original as GroupSavedviewsAPI);
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
                            deleteGroup(props.value ?? "").catch((e) => {
                              toastErrorWithCode(
                                e,
                                `Deleting group '${props.row.original.displayName}
                                ' failed.`
                              );
                              setDeleting(false);
                            });
                          }}
                          title={"Delete group"}
                        >
                          <SvgDelete />
                        </IconButton>
                      </ButtonGroup>
                    </SkeletonCell>
                  );
                },
              },
            ],
          },
        ],
        [deleteGroup]
      )}
      emptyTableContent={"No group created, use field above to create group."}
    />
  );
};
