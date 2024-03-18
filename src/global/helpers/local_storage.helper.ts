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

  console.log("now.getTime()", now.getTime());
  console.log("data.expiry", data.expiry);

  if (now.getTime() > data.expiry) {
    console.log("TOKEN REMOVED --- getTokenFromLocalStorage");
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

  console.log("item", item);

  localStorage.setItem(key, JSON.stringify(item));
};

export const removeTokenFromLocalStorage = (): void => {
  localStorage.removeItem(key);
  console.log("TOKEN REMOVED --- removeTokenFromLocalStorage");
};
