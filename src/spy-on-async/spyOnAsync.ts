export interface AsyncMock<T> extends jest.Mock<Promise<T>> {
  mockResolveNext(val: T): Promise<T>;
  mockRejectNext(val?: T): Promise<any>;
}

type AsyncMockCall<T> = {
  resolve(val?: T) : Promise<T>;
  reject(val?: any): Promise<any>;
  implementation(): Promise<T>; // call
  resetPromise(): void; // reset
}

const createMockImplementation = <T>() : AsyncMockCall<T> => {
  let resolvePromise: (value?: T | PromiseLike<T>) => void;
  let rejectPromise: (reason?: any) => void;
  let promise : Promise<T>;

  function resetPromise() {
    promise = new Promise<T>((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });
  }

  resetPromise();

  return {
    resolve(val?: T) {
      resolvePromise(val);

      return promise;
    },
    reject(val?: any) {
      rejectPromise(val);

      return promise.catch(() => val);
    },
    implementation: () => promise,
    resetPromise
  };
};

const multiple = <T>(createMockImplementation: <T>() => AsyncMockCall<T>) => () : AsyncMockCall<T> => {
  let calls : AsyncMockCall<T>[] = []

  return {
    resolve(val?: T) {
      const call = calls.pop();
      if(!call) {
        throw 'No calls yo'
      }

      return call.resolve(val);
    },
    reject(val?: any) {
      const call = calls.pop();
      if(!call) {
        throw 'No calls yo'
      }

      return call.reject(val);
    },
    implementation: () => {
      const call = createMockImplementation<T>();
      calls.unshift(call)

      return call.implementation()
    },
    resetPromise: () => {
      calls = []
    }
  }
}

class AsyncMocker {
  private _resetRegistry:  Set<() => void>;

  constructor() {
    this._resetRegistry = new Set();
  }

  resetAllPromises = () => {
    this._resetRegistry.forEach(reset => reset());
  }

  createAsyncMock = <T>(): AsyncMock<T> => {
    const {implementation, resolve, reject, resetPromise} = multiple<T>(createMockImplementation)()

    this._resetRegistry.add(resetPromise)

    const fn = Object.assign(jest.fn(), {
      mockResolveNext: resolve,
      mockRejectNext: reject
    });

    fn.mockImplementation(implementation)

    return fn;
  }

  createAsyncMockSingleton = <T>(): AsyncMock<T> => {
    const {implementation, resolve, reject, resetPromise} = createMockImplementation<T>()

    this._resetRegistry.add(resetPromise)

    const fn = Object.assign(jest.fn(), {
      mockResolveNext: resolve,
      mockRejectNext: reject
    });

    fn.mockImplementation(implementation)

    return fn;
  }
}

const mocker = new AsyncMocker();

export default mocker;