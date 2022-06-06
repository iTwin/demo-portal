/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { BrowserAuthorizationCallbackHandler } from "@itwin/browser-authorization";
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import "./index.scss";
import * as serviceWorker from "./serviceWorker";

// Do not render full application if we are handling OIDC callback
const redirectUrl = new URL(`${window.location.origin}/signin-callback`);
if (redirectUrl.pathname === window.location.pathname) {
  BrowserAuthorizationCallbackHandler.handleSigninCallback(
    redirectUrl.toString()
  ).catch(console.error);
} else {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
