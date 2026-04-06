export const useAuthParser = () => {
  const extractToken = (payload: any): string =>
    payload?.token ||
    payload?.data?.token ||
    payload?.message?.access_token ||
    '';

  const extractUser = <T>(payload: any): T | null =>
    payload?.message?.data ||
    payload?.data?.data ||
    payload?.data ||
    null;

  const extractData = <T>(payload: any): T =>
    payload && typeof payload === 'object' && 'data' in payload
      ? payload.data
      : payload;

  return { extractToken, extractUser, extractData };
};