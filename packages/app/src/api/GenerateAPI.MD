# Generate API from exported storage.json files (OpenAPI V2 Json)

Note to myself, this is the "simplest" that we can use the storage api with minimum changes, until they are really fixed in the exported file itself, so it might differ a bit, but these are guidelines.

After Exporting the OpenAPI v2 (json) file "xxx.json" (if the API changes),

1. Compare current "xxxOpenAPIOrignial.json" file with "xxxOpenAPI.json" (right-click and "Select for compare" in VSCode)

2. Replicate relevant changes to "xxx.json". (Might need to adapt depending on the changes, but it should give a general guide, note that xxxOpenAPIOriginal.json have a 2 space indentation, so xxx.json should be saved once to apply these before comparing)

3. Save updated "xxx.json" over "xxxOpenAPI.json".

4. From the root folder (or adapt the `${PWD}/packages/app/src/api` part if you prefer), run the following command (dont forget to replace the `xxx` part and start docker before... :) )

```ps
docker run --rm -v "${PWD}/packages/app/src/api:/local" swaggerapi/swagger-codegen-cli generate -i /local/xxxOpenAPI.json -l typescript-fetch -o /local/xxx --additional-properties=supportsES6=true,modelPropertyNaming=original
```

5. After the command ran successfully, update the file `packages/app/src/api/xxx/api.ts` with these 2 additional lines on top of the file:

```diff
+ /* eslint-disable */
+ //@ts-nocheck
  /// <reference path="./custom.d.ts" />
```

and `export` the `BASE_PATH` in it (Required for environment awareness):

```diff
- const BASE_PATH = "https://api.bentley.com/xxx/v1".replace(
+ export const BASE_PATH = "https://api.bentley.com/xxx/v1".replace(
```

6. Fix existing code from whatever have changed in the API as they are not guaranteed to be compatible in any way.

## Additional informations

Swagger document for synchronization types: https://imodelbridgeservice.bentley.com/swagger/index.html

Other option could be to use this command instead once the original files are properly fixed:

```ps
docker run --rm -v \"${PWD}/packages/app/src/api:/local\" openapitools/openapi-generator-cli generate -i /local/storage.json -g typescript-fetch -o /local/storage --additional-properties=typescriptThreePlus=true,withoutRuntimeChecks=true
```
