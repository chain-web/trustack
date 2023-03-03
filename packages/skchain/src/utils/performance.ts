/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
export const getNow = (): bigint => {
  if (globalThis.process?.hrtime) {
    // nodeJs
    return globalThis.process.hrtime.bigint();
  } else {
    // browser
    return BigInt(globalThis.performance.now());
  }
};

export const getStack = (): string[] => {
  const stack: string[] = [];
  const err = new Error();
  if (err.stack) {
    err.stack.split('\n').forEach((line) => {
      const call = line.match(/(?<=at\s)([\s\S])+(?=\s\()/);
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
        const stack = getStack();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        stack.push(stack.pop()!.split('.')[0]);
        stack.push(`get ${name}`);
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
          const decorateFunction = function (...params: any[]) {
            const start = getNow();
            try {
              // @ts-ignore
              const result = descriptor.value.apply(this, params);
              return result;
              // eslint-disable-next-line no-useless-catch
            } catch (e) {
              throw e;
            } finally {
              const end = getNow();
              const stack = getStack();
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              stack.push(stack.pop()!.split('.')[0]);
              stack.push(propName);
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

class PerformanceCollecter {
  private _enabled: boolean = false;
  //  Boolean(
  //   (globalThis as any).__pc__ || globalThis.process?.env?.TS_JEST,
  // );

  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
  }

  logs: PerformanceLogItem[] = [];

  addLog(log: PerformanceLogItem): void {
    this.logs.push(log);
  }

  print() {
    // eslint-disable-next-line no-console
    console.log(this.logs);
  }
}

export const performanceCollecter = new PerformanceCollecter();
