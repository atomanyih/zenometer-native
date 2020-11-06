import {AsyncMock, createAsyncMock, resetAllPromises} from "./spyOnAsync";

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

    describe('.resetAllPromises', () => {
      it('returns a new promise on next call', async () => {
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
    });
  });
});
