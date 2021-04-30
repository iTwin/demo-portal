import "./index.scss";

import { BrowserAuthorizationCallbackHandler } from "@bentley/frontend-authorization-client";
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

// Do not render full application if we are handling OIDC callback
const redirectUrl = new URL(process.env.IMJS_AUTH_CLIENT_REDIRECT_URI ?? "");
if (redirectUrl.pathname === window.location.pathname) {
  BrowserAuthorizationCallbackHandler.handleSigninCallback(
    redirectUrl.toString()
  ).catch(console.error);
} else {
  ReactDOM.render(<App />, document.getElementById("root"));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
