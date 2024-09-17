'use server';

export const printError = async (error) => {
  console.log(`\n Client error: \n${error}\n ${new Date().toISOString()}`);
};
