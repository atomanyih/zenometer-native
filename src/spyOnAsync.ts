export interface AsyncMock<T> extends jest.Mock<Promise<T>> {
  mockResolveNext(val: T): Promise<T>;
  mockRejectNext(val?: T): Promise<any>;
}

const resets : Set<() => void> = new Set();

const createAsyncMock = <T>() => {
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

  resets.add(() => {resetPromise()})

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

export const resetAllPromises = () => {
  resets.forEach(reset => reset());
}