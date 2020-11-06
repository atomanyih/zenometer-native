import mocker, {AsyncMock} from './spyOnAsync';

export {AsyncMock};
export const createAsyncMock = mocker.createAsyncMock
export const resetAllPromises = mocker.resetAllPromises