export type ChildProcessMessage =
  | { type: 'log'; data?: string }
  | {
      type: 'lifecycleChange';
      data: [string, string[]];
    };
