class HistoryAction {
  _getParams(paramString: string): { [key: string]: string } {
    const paramMap = paramString
      .split('&')
      .map((param: string) => {
        const [key, value] = param.split('=');
        return {
          [decodeURIComponent(key)]: decodeURIComponent(value),
        };
      })
      .reduce(
        (prev, cur) => ({
          ...prev,
          ...cur,
        }),
        {},
      );
    return paramMap;
  }

  pushHashParam(
    key: string,
    value: string,
    falseValueWillBeRemoved = false,
  ): void {
    const { origin, pathname, hash } = window.location;
    const hasParams = /\?/.test(hash);
    const [route, paramString] = hash.split('?');

    let paramMap: {
      [key: string]: string;
    } = {};

    if (hasParams) {
      paramMap = this._getParams(paramString);
    }

    paramMap[key] = value;

    if (falseValueWillBeRemoved) {
      if (value === 'false') {
        delete paramMap[key];
      }
    }

    const targetParamString = Object.keys(paramMap)
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(paramMap[k])}`)
      .join('&');

    const url = `${origin}${pathname}${route}?${targetParamString}`;
    window.history.pushState(null, '', url);
  }

  pushHashParams(
    obj: { [key: string]: string },
    falseValueWillBeRemoved = false,
  ): void {
    Object.keys(obj).forEach((key: string) => {
      this.pushHashParam(key, obj[key], falseValueWillBeRemoved);
    });
  }

  pullHashParam(key: string): string {
    const paramMap = this.pullHashParams();
    return paramMap[key];
  }

  pullHashParams(): { [key: string]: string } {
    const { hash } = window.location;
    const paramString = hash.split('?')[1];

    if (!paramString) {
      return {};
    }

    const paramMap = this._getParams(paramString);
    return paramMap;
  }
}

export const historyAction = new HistoryAction();
