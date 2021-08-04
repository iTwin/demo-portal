/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { UserInfo } from "@bentley/itwin-client";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import {
  ApplicationInsights,
  ITelemetryItem,
} from "@microsoft/applicationinsights-web";

import { getConfig } from "../../config";
import { TelemetryEventName, TelemetryMetricName } from "./TelemetryNames";

class TelemetryService {
  private _reactPlugin: ReactPlugin;
  private _appInsights?: ApplicationInsights;
  private _userInfo?: UserInfo;

  private _configureUserContext = (): void => {
    if (!this._appInsights) {
      return;
    }

    if (!this._userInfo) {
      // This shouldn't ever happen
      this._appInsights.clearAuthenticatedUserContext();
      return;
    }
    this._appInsights.setAuthenticatedUserContext(
      this._userInfo?.id,
      this._userInfo?.organization?.id,
      true
    );
  };

  constructor() {
    this._reactPlugin = new ReactPlugin();
  }

  private _telemetryInitializer = () => {
    if (
      !this._appInsights ||
      !process.env.NODE_ENV ||
      process.env.NODE_ENV === "test"
    ) {
      // Don't send any telemetry while running tests.
      return false;
    }
  };

  private _userDataTelemetryInitializer = (envelope: ITelemetryItem) => {
    envelope.data = envelope.data ?? {};
    (envelope.data as any).user = (envelope.data as any).user ?? {};
    (envelope.data as any).user.email = this._userInfo?.email?.id ?? "No Email";
    (envelope.data as any).user.org =
      this._userInfo?.organization?.name ?? "No Organization";
    (envelope.data as any).user.orgId =
      this._userInfo?.organization?.id ?? "No Organization ID";
    (envelope.data as any).user.ultimate =
      this._userInfo?.featureTracking?.ultimateSite ?? "No Ultimate";
  };

  async initialize(reactPluginConfig: any, userInfo?: UserInfo) {
    this._userInfo = userInfo;
    const { appInsights } = await getConfig();

    this._appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: appInsights?.key,
        disableFetchTracking: false,
        enableAutoRouteTracking: true,
        extensions: [this._reactPlugin],
        extensionConfig: {
          [this._reactPlugin.identifier]: reactPluginConfig,
        },
      },
    });

    this._appInsights.loadAppInsights();
    this._appInsights.addTelemetryInitializer(this._telemetryInitializer);
    this._appInsights.addTelemetryInitializer(
      this._userDataTelemetryInitializer
    );

    this._configureUserContext();
  }

  get appInsights() {
    return this._appInsights;
  }

  get reactPlugin() {
    return this._reactPlugin;
  }

  updateUserInfo(userInfo?: UserInfo) {
    this._userInfo = userInfo;
    this._configureUserContext();
  }
}

export const ai = new TelemetryService();

/**
 * Track event named `name` in ApplicationInsights.
 * `name` should be defined in @ref TelemetryEvent.
 *
 * Properties can be defined by the event.  Any values set will be visible in the
 * telemetry data in Azure.
 */
export const trackEvent = (
  name: TelemetryEventName,
  properties?: { [key: string]: any }
) => {
  if (!ai.appInsights) {
    console.error(
      //This one should remain a normal console.error.
      "Cannot track event if application insights is not initialized (event, properties)",
      name,
      properties
    );
  }
  ai.appInsights?.trackEvent({
    name: name,
    properties: properties,
  });
};

/**
 * Use to log a metric that is not related to any particular event.
 *
 * @param name Required - The name of the metric to track.
 */
export const trackMetric = (
  name: TelemetryMetricName, // The identifier of the metric
  average: number, // The average value of the metric
  sampleCount?: number, // The number of samples in the average - Default: 1
  min?: number, // The minimum value in the average - Default: average
  max?: number // The maximum value in the average - Default: average
) => {
  ai.appInsights?.trackMetric({
    name: name,
    average: average,
    sampleCount: sampleCount,
    min: min,
    max: max,
  });
};
