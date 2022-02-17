/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { Angle, Vector3d, YawPitchRollAngles } from "@bentley/geometry-core";
import {
  imageBufferToPngDataUrl,
  ScreenViewport,
  ViewState3d,
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
  useEffect,
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
import { useSavedviewsInfo } from "../useSavedviewsInfo";
import { toastErrorWithCode } from "../util";

export interface SavedviewSnapperContextProps {
  projectId: string | undefined;
  iModelId?: string;
  accessToken: string | undefined;
  savedviewId?: string | undefined;
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
  savedviewId,
  children,
}: PropsWithChildren<SavedviewSnapperContextProps>) => {
  return (
    <SavedviewSnapperContext.Provider
      value={{ iModelId, accessToken, projectId, savedviewId }}
    >
      {children}
    </SavedviewSnapperContext.Provider>
  );
};

const apply3dView = (vp: ScreenViewport, view: ViewItwin3dSavedviewsAPI) => {
  const clone = vp.view.clone() as ViewState3d;
  clone.setOrigin({ x: view.origin[0], y: view.origin[1], z: view.origin[2] });
  clone.setExtents(new Vector3d(...view.extents));
  if (view.angles) {
    clone.setRotation(
      new YawPitchRollAngles(
        Angle.createDegrees(view.angles?.yaw ?? 0),
        Angle.createDegrees(view.angles?.pitch ?? 0),
        Angle.createDegrees(view.angles?.roll ?? 0)
      ).toMatrix3d()
    );
  }
  if (view.camera) {
    clone.camera.setEyePoint({
      x: view.camera.eye[0],
      y: view.camera.eye[1],
      z: view.camera.eye[2],
    });
    clone.camera.setFocusDistance(view.camera.focusDist);
    clone.camera.setLensAngle(Angle.createDegrees(view.camera.lens));
  }
  if (view.categories?.enabled && view.categories.enabled.length > 0) {
    clone.categorySelector.dropCategories(
      clone.categorySelector.toJSON().categories
    );
    clone.categorySelector.addCategories(view.categories.enabled);
  }
  vp.changeView(clone, { animationTime: 100 });
  if (view.models?.enabled && view.models.enabled.length > 0) {
    vp.changeViewedModels(view.models.enabled);
  }
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
  const { projectId, iModelId, accessToken, savedviewId } = useContext(
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

  const { fetchSavedview } = useSavedviewsInfo(
    projectId ?? "",
    iModelId,
    accessToken ?? ""
  );

  useEffect(() => {
    if (savedviewId && activeViewport && activeViewport.view.is3d()) {
      fetchSavedview(savedviewId)
        .then((savedview) => {
          const view = savedview?.savedViewData.itwin3dView;
          if (!view) {
            return;
          }
          setTimeout(() => {
            apply3dView(activeViewport, view);
          }, 100);
        })
        .catch((e) => {
          toastErrorWithCode(e, "Fetch savedview for display failed");
        });
    }
  }, [activeViewport, fetchSavedview, savedviewId]);

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
