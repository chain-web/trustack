/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
export const getNow = (): bigint => {
  if (globalThis.process?.hrtime) {
    // nodeJs
    return globalThis.process.hrtime.bigint();
  } else {
    // browser
    return BigInt(globalThis.performance.now().toFixed(0));
  }
};

export const getStack = (): string[] => {
  const stack: string[] = [];
  const err = new Error();
  // console.log(err.stack);
  if (err.stack) {
    err.stack.split('\n').forEach((line) => {
      const call = line.match(/(?<=at\s)([\s\S])+?(?=(\s\(|\sfile:))/);
      // test case
      // at testClass.descriptor.value (/workspaces/faith-stack/packages/skchain/src/utils/performance.ts:36:23)

      // at async runTest (/workspaces/faith-stack/node_modules/.pnpm/jest-runner@29.4.1/node_modules/jest-runner/build/runTest.js:444:34)

      // at SKChain.decorateFunction [as transaction] (/workspaces/faith-stack/packages/skchain/src/utils/performance.ts:93:29)

      // at Object.<anonymous> (/workspaces/faith-stack/packages/skchain/tests/node.spec.ts:28:19)

      //     at async file:///workspaces/faith-stack/packages/sknode/dist/src/skchain.mjs:10:22

      //     at async file:///workspaces/faith-stack/packages/sknode/dist/src/skchain.mjs:10:22
      if (call && call[0]) {
        stack.unshift(call[0]);
      } else {
        if (line.match('at ')) {
          throw new Error(`no stack match: ${line}`);
        }
      }
    });
  }
  stack.pop();
  return stack;
};

const processStack = (funcName: string, stack: string[]): string[] => {
  // console.log(stack);
  const last = stack.pop();
  if (last?.match('.')) {
    stack.push(last.split('.')[0]);
  }
  stack.push(funcName);

  return stack;
};

export function logPerformance(
  _target: any,
  name: string,
  descriptor: any,
): any {
  if (!performanceCollecter.enabled) {
    return descriptor;
  }
  const originalGet = descriptor && descriptor.get;
  if (typeof originalGet === 'function') {
    descriptor.get = function () {
      const start = getNow();
      try {
        const result = originalGet.apply(this);
        return result;
        // eslint-disable-next-line no-useless-catch
      } catch (e) {
        throw e;
      } finally {
        const stack = processStack(`get ${name}`, getStack());
        const end = getNow();
        performanceCollecter.addLog({
          start,
          end,
          cost: end - start,
          funcName: name,
          params: '[]',
          stack,
        });
      }
    };
  }
  return descriptor;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function logClassPerformance(): Function {
  if (!performanceCollecter.enabled) {
    return () => {};
  }
  return function (Class: any) {
    const propertyNames = Object.getOwnPropertyNames(Class.prototype);
    Object.keys(propertyNames).forEach((key) => {
      const propName = propertyNames[key as unknown as number];
      const descriptor = Object.getOwnPropertyDescriptor(
        Class.prototype,
        propName,
      );
      if (!descriptor) {
        throw new Error('nodescriptor ');
      }
      if (propName !== 'constructor') {
        if (descriptor.value) {
          const decorateFunction = async function (...params: any[]) {
            const start = getNow();
            try {
              // @ts-ignore
              const result = await descriptor.value.apply(this, params);
              return result;
              // eslint-disable-next-line no-useless-catch
            } catch (e) {
              throw e;
            } finally {
              const end = getNow();
              const stack = processStack(propName, getStack());
              performanceCollecter.addLog({
                start,
                end,
                cost: end - start,
                funcName: propName,
                params: JSON.stringify(params),
                stack,
              });
            }
          };
          Object.defineProperty(Class.prototype, propName, {
            ...descriptor,
            value: decorateFunction,
          });
        }
        // if (descriptor.get) {
        //   descriptor.get = genDescriptorFunc('get');
        //   Object.defineProperty(Class.prototype, propName, {
        //     ...descriptor,
        //     get: function () {
        //       // @ts-ignore
        //       return descriptor.get.apply(this);
        //     },
        //   });
        // }
      }
    });
  };
}

interface PerformanceLogItem {
  funcName: string;
  start: bigint;
  end: bigint;
  cost: bigint;
  params: string;
  stack: string[];
}

interface logTree {
  name: string;
  children: logTree[];
}

class PerformanceCollecter {
  private _enabled: boolean = Boolean(
    (globalThis as any).__pc__ || globalThis.process?.env?.TS_JEST,
  );

  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
  }

  logs: PerformanceLogItem[] = [];
  tree: logTree = {
    name: 'root',
    children: [],
  };

  addLog(log: PerformanceLogItem): void {
    this.logs.push(log);
  }
  genTree() {
    return this.tree;
  }

  print() {
    // eslint-disable-next-line no-console
    console.log(this.logs);
  }
}
export const performanceCollecter = new PerformanceCollecter();
