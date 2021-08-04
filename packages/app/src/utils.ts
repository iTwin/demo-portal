/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
type Falsy = false | 0 | "" | null | undefined;
/**
 * Spread the result to add `addIfTrue` to an array based on input "Truthiness",
 * will not create empty element in the array if `addIfTrue` is falsy.
 * @example [...spreadIf(shouldAdd && {thingTo: 'add'})]
 * @param addIfTrue Should be a shorthand that returns Falsy or something.
 * @returns Array with object in it if "Truthy", an empty array otherwise
 */
export const spreadIf: <T>(addIfTrue: T | Falsy) => [T] | [] = (addIfTrue) =>
  addIfTrue ? [addIfTrue] : [];

export type CreateTypeFromInterface<Interface> = {
  [Property in keyof Interface]: Interface[Property];
};
