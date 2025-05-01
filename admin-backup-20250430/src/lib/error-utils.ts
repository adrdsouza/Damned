/**
 * This is a simplified replacement for the react-router-dom json function
 * to avoid build errors with newer versions of react-router-dom
 */
export function createError(message: string | object, status: number = 400): Error {
  const error = new Error(typeof message === 'string' ? message : JSON.stringify(message));
  (error as any).status = status;
  return error;
}