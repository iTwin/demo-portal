import {
  Button,
  Code,
  DropdownButton,
  InputGroup,
  LabeledInput,
  LabeledSelect,
  MenuItem,
  Small,
  Tag,
  TagContainer,
  Text,
  ToggleSwitch,
} from "@itwin/itwinui-react";
import React from "react";

import {
  GroupSavedviewsAPI,
  ImageUpdateSavedviewsAPI,
  SavedViewSavedviewsAPI,
  SavedViewUpdateSavedviewsAPI,
  SavedViewWithDataSavedviewsAPI,
  TagSavedviewsAPI,
  ViewSavedviewsAPI,
} from "../../../api/savedviews/generated";
import { GroupIdHrefMatcher } from "../../../api/savedviews/savedviewsClient";
import { CreateSavedViewPayload } from "../useSavedviewsInfo";
import { toastErrorWithCode } from "../util";
import { ButtonBar } from "./ButtonBar";
import "./SavedviewsPanel.scss";

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
interface SavedviewCreatePanelProps {
  view?: ViewSavedviewsAPI | undefined;
  image?: string;
  tags: TagSavedviewsAPI[];
  groups: GroupSavedviewsAPI[];
  savedview?:
    | SavedViewSavedviewsAPI
    | SavedViewWithDataSavedviewsAPI
    | undefined;
  createFn: (
    savedview: CreateSavedViewPayload,
    image?: ImageUpdateSavedviewsAPI
  ) => Promise<void>;
  updateFn?: (
    id: string,
    payload: SavedViewUpdateSavedviewsAPI
  ) => Promise<void>;
  onCancel?: () => void;
}

export const SavedviewPanel = ({
  view,
  image,
  tags,
  groups,
  savedview,
  createFn,
  updateFn,
  onCancel,
}: SavedviewCreatePanelProps) => {
  const existRef = React.useRef<HTMLDivElement>(null);
  const [working, setWorking] = React.useState(false);
  const [displayName, setDisplayName] = React.useState("");
  const [shared, setShared] = React.useState(false);
  const [tagList, setTagList] = React.useState<string[]>([]);
  const [group, setGroup] = React.useState("");
  const [status, setStatus] = React.useState<{
    status?: "positive" | "warning" | "negative" | undefined;
    message?: string | undefined;
  }>({});
  const [imageFit, toggleImageFit] = React.useState(true);
  const viewData =
    (savedview as SavedViewWithDataSavedviewsAPI)?.savedViewData ?? view;
  const reset = React.useCallback(() => {
    setDisplayName(savedview ? savedview.displayName : "");
    setShared(savedview ? savedview.shared : false);
    setGroup(
      savedview
        ? savedview._links.group?.href.match(GroupIdHrefMatcher)?.[0] ?? ""
        : ""
    );
    setTagList(savedview ? savedview.tags?.map((tag) => tag.id) ?? [] : []);
  }, [savedview]);
  React.useEffect(reset, [reset]);
  const displayNameRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (!working) {
      displayNameRef.current?.focus();
    }
  }, [working]);

  const submit = React.useCallback(() => {
    if (!displayName.trim()) {
      setStatus({ status: "warning", message: "A name must be provided" });
      return;
    }
    setWorking(true);
    if (savedview) {
      const update: SavedViewUpdateSavedviewsAPI = {};
      if (displayName.trim() !== savedview.displayName) {
        update.displayName = displayName;
      }
      if (shared !== savedview.shared) {
        update.shared = shared;
      }
      if (
        group !==
          savedview._links.group?.href.match(
            savedview
              ? savedview._links.group?.href.match(GroupIdHrefMatcher)?.[0] ??
                  ""
              : ""
          )?.[0] ??
        ""
      ) {
        update.groupId = group;
      }
      if (
        tagList.length !== savedview.tags?.length ||
        !savedview.tags.every((tag) => tagList.includes(tag.id))
      ) {
        update.tagIds = tagList;
      }
      if (Object.keys(update).length > 0 && updateFn) {
        updateFn(savedview.id, update)
          .then(() => {
            if (!existRef.current) {
              return;
            }
            setStatus({
              status: "positive",
              message: "Savedview updated",
            });
          })
          .catch((e) => {
            toastErrorWithCode(e, "Savedview update failed.");
            setStatus({
              status: "negative",
              message: "Savedview update failed",
            });
          })
          .finally(() => {
            if (!existRef.current) {
              return;
            }
            setWorking(false);
          });
      } else {
        setWorking(false);
      }
    } else {
      const createPayload: CreateSavedViewPayload = {
        displayName,
        shared,
        savedViewData: view ?? {
          itwin3dView: { extents: [0, 0, 0], origin: [0, 0, 0] },
        },
      };
      if (group) {
        createPayload.groupId = group;
      }
      if (tagList.length > 0) {
        createPayload.tagIds = tagList;
      }
      createFn(
        createPayload,
        image && image !== "None" && image !== "Loading" ? { image } : undefined
      )
        .then(() => {
          if (!existRef.current) {
            return;
          }

          setStatus({
            status: "positive",
            message: "Savedview created",
          });
          reset();
        })
        .catch((e) => {
          toastErrorWithCode(e, "Savedview creation failed.");
          setStatus({
            status: "negative",
            message: "Savedview creation failed",
          });
        })
        .finally(() => {
          if (!existRef.current) {
            return;
          }

          setWorking(false);
        });
    }
  }, [
    displayName,
    savedview,
    shared,
    group,
    tagList,
    updateFn,
    view,
    createFn,
    image,
    reset,
  ]);
  return (
    <div className="idp-savedview-panel" ref={existRef}>
      <InputGroup
        status={status.status}
        message={status.message}
        style={{
          maxWidth: 450,
          gridRow: 1,
        }}
      >
        <Text>{savedview?.id ?? ""}</Text>
        <LabeledInput
          label="Savedview"
          ref={displayNameRef}
          value={displayName}
          disabled={working}
          onChange={(e) => setDisplayName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              submit();
            }
          }}
        />
        <LabeledSelect
          label="Group"
          value={group}
          disabled={working}
          options={[
            { value: "", label: "-- No Group --" },
            ...groups.map((group) => ({
              value: group.id,
              label: group.displayName,
            })),
          ]}
          onChange={(value) => setGroup(value)}
        />
        <InputGroup label="Tags">
          <TagContainer>
            <Tag id={"new"}>
              <DropdownButton
                disabled={working}
                menuItems={(close) =>
                  tags.map((tag) => (
                    <MenuItem
                      key={tag.id}
                      onClick={() => {
                        setTagList((list) =>
                          list.includes(tag.id) ? list : [tag.id, ...list]
                        );
                        close();
                      }}
                    >
                      {tag.displayName}
                    </MenuItem>
                  ))
                }
                styleType="borderless"
                size="small"
                style={{ borderRadius: "9.5px" }}
              >
                Select
              </DropdownButton>
            </Tag>
            {tagList.map((id) => (
              <Tag
                key={id}
                onRemove={
                  working
                    ? undefined
                    : () =>
                        setTagList((list) => list.filter((tag) => tag !== id))
                }
              >
                {tags.find((tag) => tag.id === id)?.displayName}
              </Tag>
            ))}
          </TagContainer>
        </InputGroup>
        <ToggleSwitch
          label="Shared"
          checked={shared}
          disabled={working}
          onChange={(e) => setShared(e.target.checked)}
        />
      </InputGroup>
      <InputGroup
        label={`View${viewData ? "" : " (default)"}`}
        style={{ gridRow: 1 }}
      >
        {viewData && Object.keys(viewData).length === 0 ? (
          <Text isSkeleton={true}>Loading...</Text>
        ) : (
          <Code style={{ whiteSpace: "pre" }}>
            {JSON.stringify(
              viewData ?? {
                itwin3dView: { extents: [0, 0, 0], origin: [0, 0, 0] },
              },
              undefined,
              2
            )}
          </Code>
        )}
      </InputGroup>
      <InputGroup label={"Snapshot"} style={{ gridRow: 1 }}>
        {image === "Loading" || image === "None" ? (
          <Text isSkeleton={image === "Loading"}>{image}</Text>
        ) : (
          <>
            <div>
              <img
                src={image}
                alt="Snapshot"
                className={imageFit ? "img-fit" : undefined}
                onClick={() => toggleImageFit((fit) => !fit)}
              />
            </div>
            <Small isMuted={true}>
              Click image to toggle full/fitted image
            </Small>
          </>
        )}
      </InputGroup>
      <ButtonBar style={{ gridRow: 2 }}>
        <Button
          styleType="high-visibility"
          onClick={() => submit()}
          disabled={working}
        >
          {savedview ? "Update" : "Create"}
        </Button>
        <Button
          onClick={() => {
            reset();
            onCancel?.();
          }}
          disabled={working}
        >
          Cancel
        </Button>
      </ButtonBar>
    </div>
  );
};
