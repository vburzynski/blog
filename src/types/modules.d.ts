// WARNING: If these are included in a file with import lines, VSCode becomes unhappy
// in the situation above, vscode's intellisense completion of the import path is broken
// and it reports an error of not being able to find the module.

declare module '*.svg' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}

declare module '*.yml';
declare module '*.yaml';
declare module '*.jpg';
declare module '*.png';
