/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
declare module "byte-size" {
  type Options = Partial<{
    precision: number;
    units: string;
    customUnits: {
      [unitName: string]: { from: number; to: number; unit: string }[];
    };
    toStringFn(): string;
    locale: string | string[];
  }>;
  declare function byteSize(
    bytes: number,
    options?: Options
  ): {
    value: string;
    unit: string;
    long: string;
    toString(): string;
  };
  declare namespace byteSize {
    function defaultOptions(options: Options): void;
  }
  export = byteSize;
}
