/* eslint-disable @typescript-eslint/no-explicit-any */
export default function cleanObj(obj: any) {
  for (const propName in obj) {
    if (obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
}
