export interface AsyncMock<T> extends jest.Mock<Promise<T>> {
  mockResolveNext(val: T): Promise<T>;
  mockRejectNext(val?: T): Promise<any>;
}

const createAsyncMock = <T>() => {
  let resolvePromise: (value?: T | PromiseLike<T>) => void;
  let rejectPromise: (reason?: any) => void;

  const promise = new Promise<T>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  return {
    resolve(val?: T) {
      resolvePromise(val);

      return promise;
    },
    reject(val?: any) {
      rejectPromise(val);

      return promise.catch(() => {});
    },
    implementation: () => promise
  };
};

export const extendJestMock = <T>() => {
  const {implementation, resolve, reject} = createAsyncMock<T>()

  const fn : AsyncMock<T> = Object.assign(jest.fn(), {
    mockResolveNext: resolve,
    mockRejectNext: reject
  });

  fn.mockImplementation(implementation)

  return fn;
}
