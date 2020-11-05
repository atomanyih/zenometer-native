export {};
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeAround(expected: number, precision: number): R;
    }

    interface Expect {
      toBeAround(expected: number, precision: number): any;
    }
  }
}
