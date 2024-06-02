const key: string = "token";

export interface ILocalStorageTokenData {
  token: string;
  expiry: number;
}

export const getTokenFromLocalStorage = (): string => {
  const dataStr = localStorage.getItem(key);

  if (!dataStr) {
    return "";
  }

  const data: ILocalStorageTokenData = JSON.parse(dataStr);
  const now = new Date();

  if (now.getTime() > data.expiry) {
    localStorage.removeItem(key);
    return "";
  }

  return data.token;
};

export const setTokenToLocalStorage = (
  token: string,
  expiresIn: number
): void => {
  const now = new Date();

  const item = {
    token: token,
    expiry: now.getTime() + expiresIn * 1000,
  };

  localStorage.setItem(key, JSON.stringify(item));
};

export const removeTokenFromLocalStorage = (): void => {
  localStorage.removeItem(key);
};
