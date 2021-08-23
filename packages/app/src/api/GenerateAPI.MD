# Generate API from exported api.json files (OpenAPI V3 Json)

As the API are being actively developed and still in tech preview, some files are not ready to be used as is by code generators and need adjustments so the generators can be used against them.

After Exporting the OpenAPI v3 (json) file "xxx.json" (if the API changes),

Note that `storage` is mature enough and no longer needs adjustments, the file can be used directly in step 5. (Keep the latest used file in the repo)

1. Compare current "xxxOriginal.json" file with "xxxAdjusted.json" (right-click and "Select for compare" in VSCode)

2. Replicate relevant changes to "xxx.json". (Might need to adapt depending on the changes, but it should give a general guide, note that xxxOriginal.json have a 2 space indentation, so xxx.json should be saved once to apply these before comparing)

3. Save the original but properly indented (2 spaces) "xxx.json" over "xxxOriginal.json".

4. Save updated "xxx.json" over "xxxAdjusted.json".

5. From the root folder (or adapt the `${PWD}/packages/app/src/api` part if you prefer), run the following command (don't forget to replace the `xxx` part and start docker before... :) )

```ps
docker run --rm -v "${PWD}/packages/app/src/api/xxx:/local" swaggerapi/swagger-codegen-cli-v3 generate -i /local/openapi/xxxAdjusted.json -l typescript-fetch -o /local/generated --disable-examples --additional-properties=typescriptThreePlus=true,withoutRuntimeChecks=true,modelPropertyNaming=original --model-name-suffix XxxAPI
```

6. After the command ran successfully, update the file `packages/app/src/api/xxx/generated/api.ts` with these 2 additional lines on top of the file:

```diff
+ /* eslint-disable */
+ //@ts-nocheck
  /// <reference path="./custom.d.ts" />
```

and `export` the `BASE_PATH` in it (Required for environment awareness):

```diff
- const BASE_PATH = "https://api.bentley.com/xxx".replace(
+ export const BASE_PATH = "https://api.bentley.com/xxx".replace(
```

7. Fix existing code from whatever have changed in the API as they are not guaranteed to be compatible in any way.

## Ready to go command lines

### Projects

```ps
docker run --rm -v "${PWD}/packages/app/src/api/projects:/local" swaggerapi/swagger-codegen-cli-v3 generate -i /local/openapi/projectsAdjusted.json -l typescript-fetch -o /local/generated --disable-examples --additional-properties=typescriptThreePlus=true,withoutRuntimeChecks=true,modelPropertyNaming=original --model-name-suffix ProjectsAPI
```

### Storage

```ps
docker run --rm -v "${PWD}/packages/app/src/api/storage:/local" swaggerapi/swagger-codegen-cli-v3 generate -i /local/openapi/storage.json -l typescript-fetch -o /local/generated --disable-examples --additional-properties=typescriptThreePlus=true,withoutRuntimeChecks=true,modelPropertyNaming=original --model-name-suffix StorageAPI
```

### Synchronization

```ps
docker run --rm -v "${PWD}/packages/app/src/api/synchronization:/local" swaggerapi/swagger-codegen-cli-v3 generate -i /local/openapi/synchronizationAdjusted.json -l typescript-fetch -o /local/generated --disable-examples --additional-properties=typescriptThreePlus=true,withoutRuntimeChecks=true,modelPropertyNaming=original --model-name-suffix SynchronizationAPI
```
