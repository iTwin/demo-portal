/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { SvgDelete } from "@itwin/itwinui-icons-react";
import { ButtonGroup, IconButton, Table } from "@itwin/itwinui-react";
import React from "react";

import { TagSavedviewsAPI } from "../../../api/savedviews/generated";
import { CreateTypeFromInterface } from "../../../utils";
import { createSelectionStateController, toastErrorWithCode } from "../util";
import { SkeletonCell } from "./SkeletonCell";

interface TagsTableProps {
  selected: string | undefined;
  tags: Partial<TagSavedviewsAPI>[];
  selectFn: (tag: TagSavedviewsAPI) => void;
  deleteFn: (id: string) => Promise<void>;
}

export const TagsTable = ({
  selected,
  tags,
  selectFn,
  deleteFn,
}: TagsTableProps) => {
  const stateController = React.useCallback(
    createSelectionStateController<
      CreateTypeFromInterface<Partial<TagSavedviewsAPI>>
    >(selected),
    [selected]
  );

  return (
    <Table<CreateTypeFromInterface<Partial<TagSavedviewsAPI>>>
      data={tags}
      getRowId={(o) => o.id as string}
      useControlledState={stateController}
      onRowClick={(e, r) => {
        selectFn(r.original as TagSavedviewsAPI);
      }}
      columns={React.useMemo(
        () => [
          {
            Header: "Table",
            columns: [
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
                            deleteFn(props.value ?? "").catch((e) => {
                              toastErrorWithCode(
                                e,
                                `Deleting tag '${props.row.original.displayName}' failed.`
                              );
                              setDeleting(false);
                            });
                          }}
                          title={"Delete tag"}
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
        [deleteFn]
      )}
      emptyTableContent={"No tag created, use field above to create tag."}
    />
  );
};
