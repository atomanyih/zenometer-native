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

    xit('handles multiple calls', async () => {
      let val1 : string | undefined = undefined;
      let val2 : string | undefined = undefined;
      asyncMock().then(value => {
        val1 = value
      });

      asyncMock().then(value => {
        val2 = value
      });

      const resolvedValue1 = 'it woiks';
      const resolvedValue2 = 'it woiks againe';

      await asyncMock.mockResolveNext(resolvedValue1)
      expect(val1).toEqual(resolvedValue1);
      expect(val2).toBeUndefined();

      await asyncMock.mockResolveNext(resolvedValue2)

      expect(val1).toEqual(resolvedValue1);
      expect(val2).toEqual(resolvedValue2);
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
