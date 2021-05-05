# iTwin Demo Portal

Copyright © Bentley Systems, Incorporated. All rights reserved.

The iTwin Demo Portal is a demonstration of some of the features of the [iTwin Platform](https://developer.bentley.com/).

## Environment Variables

Prior to running the app, add a valid clientId in `packages/app/.env.local` file:

```
IMJS_AUTH_CLIENT_CLIENT_ID="spa-xxxx"
```

This client Id can be created by going to [developer.bentley.com/register](https://developer.bentley.com/register/), the application should have the Visualization, Data Management and Administration API associations and at least have `http://localhost:3000/signin-callback` redirect url.

## Available Scripts

In the project directory, you can run:

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
