import { tryPromise } from './index';

test('tryPromise handles an async void function', async () => {
  const asyncFunc = jest.fn();
  asyncFunc.mockImplementation((): Promise<void> => Promise.resolve());

  try {
    await tryPromise(asyncFunc, 10);
  } catch (error) {}
  expect(asyncFunc).toHaveBeenCalledTimes(1);
});

test('tryPromise handles an async function returing a value', async () => {
  const asyncFunc = jest.fn();
  asyncFunc.mockImplementation((a: number, b: number): Promise<number> => Promise.resolve(a + b));
  let result = null;

  try {
    result = await tryPromise(() => asyncFunc(1, 2), 10);
  } catch (error) {}
  expect(asyncFunc).toHaveBeenCalledTimes(1);
  expect(result).toBe(3);
});

test('tryPromise calls an async only once if the number of attempt is smaller than 1', async () => {
  let asyncFunc = jest.fn();
  asyncFunc.mockImplementation((): Promise<void> => Promise.resolve());

  try {
    await tryPromise(asyncFunc, 0);
  } catch (error) {}
  expect(asyncFunc).toHaveBeenCalledTimes(1);

  asyncFunc = jest.fn();
  asyncFunc.mockImplementation((): Promise<void> => Promise.resolve());

  try {
    await tryPromise(asyncFunc, -1);
  } catch (error) {}
  expect(asyncFunc).toHaveBeenCalledTimes(1);
});

test('tryPromise handles an async function which will be reject', async () => {
  let asyncFunc = jest.fn();
  asyncFunc.mockImplementation((): Promise<void> => Promise.reject('e'));

  try {
    await tryPromise(asyncFunc, 3);
  } catch (error) {}
  expect(asyncFunc).toHaveBeenCalledTimes(3);

  asyncFunc = jest.fn();
  asyncFunc.mockImplementation((): Promise<void> => Promise.reject('e'));

  try {
    await tryPromise(() => asyncFunc(1, 2, 3), 10);
  } catch (error) {}
  expect(asyncFunc).toHaveBeenCalledTimes(10);
});

test('tryPromise handles an async function which will be resolved at the n-th attempt', async () => {
  const getMockAsyncFunc = () => {
    const asyncFunc = jest.fn();
    let counter = 1;

    asyncFunc.mockImplementation(
      (succeedAt: number): Promise<void> => {
        if (counter < succeedAt) {
          counter++;
          return Promise.reject();
        }

        return Promise.resolve();
      }
    );
    return asyncFunc;
  };

  let asyncFunc = getMockAsyncFunc();
  try {
    await tryPromise(() => asyncFunc(5), 10);
  } catch (error) {}
  expect(asyncFunc).toHaveBeenCalledTimes(5);

  asyncFunc = getMockAsyncFunc();
  try {
    await tryPromise(() => asyncFunc(5), 5);
  } catch (error) {}
  expect(asyncFunc).toHaveBeenCalledTimes(5);

  asyncFunc = getMockAsyncFunc();
  try {
    await tryPromise(() => asyncFunc(5), 1);
  } catch (error) {}
  expect(asyncFunc).toHaveBeenCalledTimes(1);
});
