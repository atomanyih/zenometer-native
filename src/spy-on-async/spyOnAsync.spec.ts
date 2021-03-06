import {AsyncMock, createAsyncMock, resetAllPromises} from "./index";

describe('spyOnAsync', () => {
  describe('createAsyncMock', () => {
    let asyncMock : AsyncMock<string>;

    beforeEach(() => {
      asyncMock = createAsyncMock<string>()
    });

    it('returns a promise when called', () => {
      const promise = asyncMock();
      expect(promise.then).toBeTruthy();
      expect(promise.catch).toBeTruthy();
    });

    describe('when #mockResolveNext is called', () => {
      it('resolves the promise', async () => {
        let val : string;
        asyncMock().then(value => {
          val = value
        });

        const resolvedValue = 'it woiks';
        await asyncMock.mockResolveNext(resolvedValue)

        // @ts-ignore
        expect(val).toEqual(resolvedValue);
      });
    });

    describe('when #mockRejectNext is rejected', () => {
      it('rejects the promise', async () => {
        let val : string;
        asyncMock().catch(value => {
          val = value
        });

        const rejectedValue = 'it woiks';
        await asyncMock.mockRejectNext(rejectedValue)

        // @ts-ignore
        expect(val).toEqual(rejectedValue);
      });
    });

    describe('when mock is called multiple times', () => {
      let firstCallResolvedValue : string | undefined;
      let secondCallResolvedValue : string | undefined;
      let firstCallRejectedValue : string | undefined;
      let secondCallRejectedValue : string | undefined;

      beforeEach(() => {
        firstCallResolvedValue = undefined;
        secondCallResolvedValue = undefined;
        firstCallRejectedValue = undefined;
        secondCallRejectedValue = undefined;

        asyncMock().then(value => {
          firstCallResolvedValue = value;
        }).catch(value => {
          firstCallRejectedValue = value;
        });

        asyncMock().then(value => {
          secondCallResolvedValue = value;
        }).catch(value => {
          secondCallRejectedValue = value;
        });
      });

      it('resolves in the order it was called', async () => {
        const resolvedValue1 = 'it woiks';
        const resolvedValue2 = 'it woiks againe';

        await asyncMock.mockResolveNext(resolvedValue1)
        expect(firstCallResolvedValue).toEqual(resolvedValue1);
        expect(secondCallResolvedValue).toBeUndefined();

        await asyncMock.mockResolveNext(resolvedValue2)

        expect(firstCallResolvedValue).toEqual(resolvedValue1);
        expect(secondCallResolvedValue).toEqual(resolvedValue2);
      });

      it('rejects in the order it was called', async () => {
        const rejectedValue1 = 'it brakes';
        const rejectedValue2 = 'it brakes againe';

        await asyncMock.mockRejectNext(rejectedValue1)
        expect(firstCallRejectedValue).toEqual(rejectedValue1);
        expect(secondCallRejectedValue).toBeUndefined();

        await asyncMock.mockRejectNext(rejectedValue2)

        expect(firstCallRejectedValue).toEqual(rejectedValue1);
        expect(secondCallRejectedValue).toEqual(rejectedValue2);
      });

      it('handles rejecting and resolving in order', async () => {
        const rejectedValue = 'it brakes';
        const resolvedValue = 'it woiks';

        await asyncMock.mockRejectNext(rejectedValue)
        expect(firstCallRejectedValue).toEqual(rejectedValue);
        expect(secondCallRejectedValue).toBeUndefined();
        expect(secondCallResolvedValue).toBeUndefined();

        await asyncMock.mockResolveNext(resolvedValue)

        expect(firstCallRejectedValue).toEqual(rejectedValue);
        expect(secondCallRejectedValue).toBeUndefined();
        expect(secondCallResolvedValue).toEqual(resolvedValue);
      });

      it('handles resolving and rejecting in order', async () => {
        const rejectedValue = 'it brakes';
        const resolvedValue = 'it woiks';

        await asyncMock.mockResolveNext(resolvedValue)
        expect(firstCallResolvedValue).toEqual(resolvedValue);
        expect(secondCallRejectedValue).toBeUndefined();
        expect(secondCallResolvedValue).toBeUndefined();

        await asyncMock.mockRejectNext(rejectedValue)
        expect(firstCallResolvedValue).toEqual(resolvedValue);
        expect(secondCallResolvedValue).toBeUndefined();
        expect(secondCallRejectedValue).toEqual(rejectedValue);
      });
    });

    describe('.resetAllPromises', () => {
      it('returns a new promise after reset', async () => {
        let val : string;
        asyncMock().then(value => {
          val = value
        });

        const resolvedValue = 'it woiks';
        await asyncMock.mockResolveNext(resolvedValue)

        // @ts-ignore
        expect(val).toEqual(resolvedValue);

        resetAllPromises();

        asyncMock().then(value => {
          val = value
        });
        const resolvedValue2 = 'it resets';

        await asyncMock.mockResolveNext(resolvedValue2)

        // @ts-ignore
        expect(val).toEqual(resolvedValue2);
      });

      it('does not resolve first promise after reset', async () => {
        let val1 : string;
        let val2 : string;
        asyncMock().then(value => {
          val1 = value
        });

        resetAllPromises();

        asyncMock().then(value => {
          val2 = value
        });
        const resolvedValue = 'it resets';

        await asyncMock.mockResolveNext(resolvedValue)

        // @ts-ignore
        expect(val2).toEqual(resolvedValue);
        // @ts-ignore
        expect(val1).toBeUndefined();
      });
    });
  });
});
