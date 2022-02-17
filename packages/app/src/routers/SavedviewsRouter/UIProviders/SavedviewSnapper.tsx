import { YawPitchRollAngles } from "@bentley/geometry-core";
import {
  imageBufferToPngDataUrl,
  ScreenViewport,
} from "@bentley/imodeljs-frontend";
import {
  CommonStatusBarItem,
  StageUsage,
  StatusBarSection,
  UiItemsProvider,
} from "@bentley/ui-abstract";
import {
  StatusBarItemUtilities,
  useActiveViewport,
} from "@bentley/ui-framework";
import { FooterIndicator } from "@bentley/ui-ninezone";
import "@itwin/itwinui-css/css/icon.css";
import { SvgImageFrame } from "@itwin/itwinui-icons-react";
import { Tooltip } from "@itwin/itwinui-react";
import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
} from "react";

import {
  ViewCameraSavedviewsAPI,
  ViewItwin3dSavedviewsAPI,
  ViewSavedviewsAPI,
  ViewVisibilityListSavedviewsAPI,
  ViewYawPitchRollSavedviewsAPI,
} from "../../../api/savedviews/generated";
import { SavedViewsModal } from "../components/SavedviewsModal";

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
export interface SavedviewSnapperContextProps {
  projectId: string | undefined;
  iModelId?: string;
  accessToken: string | undefined;
}

const SavedviewSnapperContext = React.createContext<
  SavedviewSnapperContextProps
>({
  accessToken: undefined,
  projectId: undefined,
});

export const SavedviewSnapperContextProvider = ({
  accessToken,
  iModelId,
  projectId,
  children,
}: PropsWithChildren<SavedviewSnapperContextProps>) => {
  return (
    <SavedviewSnapperContext.Provider
      value={{ iModelId, accessToken, projectId }}
    >
      {children}
    </SavedviewSnapperContext.Provider>
  );
};

const build3dView = (vp: ScreenViewport | undefined) => {
  if (!vp || !vp.view.is3d) {
    return;
  }

  let angles: ViewYawPitchRollSavedviewsAPI | undefined;
  const yprAngles = YawPitchRollAngles.createFromMatrix3d(
    vp.view.getRotation()
  );
  if (yprAngles) {
    angles = {
      yaw: yprAngles?.yaw?.degrees,
      pitch: yprAngles?.pitch?.degrees,
      roll: yprAngles?.roll?.degrees,
    };
  }

  let camera: ViewCameraSavedviewsAPI | undefined;
  if (vp.view.isCameraEnabled()) {
    camera = {
      eye: vp.view.camera.eye.toArray(),
      focusDist: vp.view.camera.focusDist,
      lens: vp.view.camera.lens.degrees,
    };
  }

  const models: ViewVisibilityListSavedviewsAPI = { enabled: [] };
  vp.view.forEachModel((model) => {
    models.enabled?.push(model.id);
  });

  const view: ViewItwin3dSavedviewsAPI = {
    origin: vp.view.getOrigin().toArray(),
    extents: vp.view.getExtents().toArray(),
    angles,
    categories: {
      enabled: vp.view.categorySelector.toJSON().categories,
    },
    models,
    camera,
  };
  return view;
};

const buildImage = (vp: ScreenViewport | undefined) => {
  const targetSize = undefined; //new Point2d(300, 300);
  const t = vp?.readImage(undefined, targetSize, true);
  if (t) {
    return imageBufferToPngDataUrl(t);
  }
  return undefined;
};

const SavedviewStatusBarItem = () => {
  const { projectId, iModelId, accessToken } = useContext(
    SavedviewSnapperContext
  );
  const target = useRef<HTMLDivElement>(null);
  const activeViewport = useActiveViewport();
  const [view, setViewInfo] = React.useState<{
    view?: ViewSavedviewsAPI;
    image?: string;
  }>({});

  const snap = useCallback(() => {
    if (activeViewport) {
      const view = build3dView(activeViewport);
      const image = buildImage(activeViewport);
      setViewInfo({
        view: { itwin3dView: view },
        image,
      });
    }
  }, [activeViewport]);

  return (
    <>
      <Tooltip placement="top" content={"Create saved view"}>
        <div ref={target} onClick={snap}>
          <FooterIndicator isInFooterMode={true}>
            <SvgImageFrame
              style={{
                cursor: "pointer",
                fill: "currentColor",
              }}
              className="iui-icons-default"
            />
          </FooterIndicator>
        </div>
      </Tooltip>
      {accessToken && projectId ? (
        <SavedViewsModal
          complete={() => setViewInfo({})}
          accessToken={accessToken}
          projectId={projectId}
          iModelId={iModelId}
          view={view.view}
          image={view.image}
        />
      ) : null}
    </>
  );
};

export class SavedviewSnapper implements UiItemsProvider {
  public readonly id = "SavedviewSnapperProvider";

  public provideStatusBarItems(
    _stageId: string,
    stageUsage: string
  ): CommonStatusBarItem[] {
    const statusBarItems: CommonStatusBarItem[] = [];
    if (stageUsage === StageUsage.General) {
      statusBarItems.push(
        StatusBarItemUtilities.createStatusBarItem(
          "SavedviewsSnapper.StatusBarItem",
          StatusBarSection.Right,
          15,
          <SavedviewStatusBarItem />
        )
      );
    }

    return statusBarItems;
  }
}
