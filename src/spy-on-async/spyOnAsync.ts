export interface AsyncMock<T> extends jest.Mock<Promise<T>> {
  mockResolveNext(val: T): Promise<T>;
  mockRejectNext(val?: T): Promise<any>;
}

const createMockImplementation = <T>() => {
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

      return promise.catch(() => {});
    },
    implementation: () => promise,
    resetPromise
  };
};

class AsyncMocker {
  private _resetRegistry:  Set<() => void>;

  constructor() {
    this._resetRegistry = new Set();
  }

  resetAllPromises = () => {
    this._resetRegistry.forEach(reset => reset());
  }

  createAsyncMock = <T>(): AsyncMock<T> => {
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