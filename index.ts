export const tryPromise = async (asyncFunc: (...args: any) => Promise<any>, numberOfAttempts: number): Promise<any> => {
  try {
    const result = await asyncFunc();
    return Promise.resolve(result);
  } catch (error) {
    numberOfAttempts--;

    if (numberOfAttempts > 0) {
      return tryPromise(asyncFunc, numberOfAttempts);
    }

    return Promise.reject(error);
  }
};
