export const tryPromise = async (
  asyncFunc: (...args: any) => Promise<any>,
  numberOfAttempts: number,
  delay: number = 0
): Promise<any> => {
  try {
    const result = await asyncFunc();

    // returns a new Promise object that is resolved by asyncFunc
    return Promise.resolve(result);
  } catch (error) {
    numberOfAttempts--;

    if (numberOfAttempts > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return tryPromise(asyncFunc, numberOfAttempts);
    }

    // returns a new Promise object that is rejected by asyncFunc
    return Promise.reject(error);
  }
};
