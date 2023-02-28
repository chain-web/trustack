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

export function logPerformance(
  _target: any,
  _name: string,
  descriptor: any,
): any {
  const original = descriptor && descriptor.value;
  if (typeof original === 'function') {
    descriptor.value = function (...args: any) {
      const start = getNow();
      try {
        const result = original.apply(this, args);
        return result;
        // eslint-disable-next-line no-useless-catch
      } catch (e) {
        throw e;
      } finally {
        const end = getNow();
        console.log([{ _target, _name, args, performance: end - start }]);
      }
    };
  }
  return descriptor;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function logClassPerformance(): Function {
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
            console.log([
              {
                func: propName,
                params,
                cost: `${Number(end - start) / 1000}ms`,
              },
            ]);
          }
        };

        Object.defineProperty(Class.prototype, propName, {
          ...descriptor,
          value: decorateFunction,
        });
      }
    });
  };
}

class PerformanceCollecter {
  private _enabled: boolean = false;

  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
  }
}

export const performanceCollecter = new PerformanceCollecter();
