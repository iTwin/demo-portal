# Forking disclaimer

This sample application is intended to be used as an example of several possible workflows that you can achieve using the iTwin Platform. The source code is provided AS IS, without warranty of any kind with the intent being to provide inspiration and guidance. It should not be used as the basis of a production application, and it is NOT production ready.

# iTwin Demo Portal

Copyright © Bentley Systems, Incorporated. All rights reserved.

The iTwin Demo Portal is a demonstration of some of the features of the [iTwin Platform](https://developer.bentley.com/).

## Environment Variables

Prior to running the app, add a valid clientId in `packages/app/.env.local` file:

```
IMJS_AUTH_CLIENT_CLIENT_ID="spa-xxxx"
```

This client Id can be created by going to [developer.bentley.com/register](https://developer.bentley.com/register/). The application should have the Visualization, Data Management, Synchronization and Administration API associations and at least have `http://localhost:3000/signin-callback` as a redirect url.

## Available Scripts

In the project directory, you can run:

### `yarn`

Pulls all dependencies so the app can be started.

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Initial setup

1. `git clone https://github.com/iTwin/demo-portal.git`
2. `cd demo-portal`
3. Create new app using [`https://developer.bentley.com/register/`](https://developer.bentley.com/register/) (See above for app requirements)
4. **Create** [`packages/app/.env.local`](packages/app/.env.local) file with a single line containing `IMJS_AUTH_CLIENT_CLIENT_ID=spa-xxxx` (ID created in step 2)
5. `yarn` (same as `yarn install`)
6. `yarn start` (Takes a few minutes to start)
7. Browse to [`http://localhost:3000`](http://localhost:3000) (Should open automatically)
