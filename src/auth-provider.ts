import { User } from "types";

const apiUrl = process.env.REACT_APP_API_URL;
const localStorageKey = "__auth_provider_token__";

export const getToken = () => window.localStorage.getItem(localStorageKey);

export const handleUserResponse = ({ user }: { user: User }) => {
  window.localStorage.setItem(localStorageKey, user.token || "");
  return user;
};

export const login = (param: { username: string; password: string }) => {
  return fetch(`${apiUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(param),
  }).then((res) => {
    return res.json().then((result) => {
      if (res.ok) {
        return handleUserResponse(result);
      } else {
        return Promise.reject(result);
      }
    });
  });
};

export const register = (param: { username: string; password: string }) => {
  return fetch(`${apiUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(param),
  }).then((res) => {
    return res.json().then((result) => {
      if (res.ok) {
        return handleUserResponse(result);
      } else {
        return Promise.reject(result);
      }
    });
  });
};

export const logout = () => window.localStorage.removeItem(localStorageKey);
