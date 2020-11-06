export interface AsyncMock<T> extends jest.Mock<Promise<T>> {
  mockResolveNext(val: T): Promise<T>;
  mockRejectNext(val?: T): Promise<any>;
}

const resetRegistry : Set<() => void> = new Set();

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

  resetRegistry.add(() => {resetPromise()})

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

export const createAsyncMock = <T>(): AsyncMock<T> => {
  const {implementation, resolve, reject} = createMockImplementation<T>()

  const fn = Object.assign(jest.fn(), {
    mockResolveNext: resolve,
    mockRejectNext: reject
  });

  fn.mockImplementation(implementation)

  return fn;
}

export const resetAllPromises = () => {
  resetRegistry.forEach(reset => reset());
}