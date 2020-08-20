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

// Why isn't the following approach working?

// new Promise(async (resolve, reject) => {
//   try {
//     const result = await asyncFunc();
//     return resolve(result);
//   } catch (error) {
//     numberOfAttempts--;

//     if (numberOfAttempts > 0) {
//       return tryPromise(asyncFunc, numberOfAttempts);
//     }

//     return reject(error);
//   }
// });
