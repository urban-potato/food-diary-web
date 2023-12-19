const key = "token";

export const getTokenFromLocalStorage = (): string => {
  const data = localStorage.getItem(key);
  const token: string = data ? data : "";
  return token;
};

export const setTokenToLocalStorage = (token: string): void => {
  localStorage.setItem(key, token);
};

export const removeTokenFromLocalStorage = (): void => {
  localStorage.removeItem(key);
};
