import QueryString from "qs";
import * as auth from "auth-provider";
import { useAuth } from "context/auth-context";
import { useCallback } from "react";

const apiUrl = process.env.REACT_APP_API_URL;

interface Config extends RequestInit {
  token?: string;
  data?: object;
}

export const http = (
  endpoint: string,
  { data, token, headers, ...customConfig }: Config = {}
) => {
  const config = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": data ? "application/json" : "",
    },
    ...customConfig,
  };

  if (config.method.toUpperCase() === "GET") {
    endpoint += `?${QueryString.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data || {});
  }

  return window.fetch(`${apiUrl}/${endpoint}`, config).then((res) => {
    if (res.status === 401) {
      auth.logout();
      window.location.reload();
      return Promise.reject({ message: "请重新登录" });
    }
    if (res.ok) {
      return res.json().then((result) => {
        return result;
      });
    } else {
      return Promise.reject(Error("请求失败，请联系服务器管理员。"));
    }
  });
};

export const useHttp = () => {
  const { user } = useAuth();
  return useCallback(
    (...[endpoint, config]: Parameters<typeof http>) =>
      http(endpoint, { ...config, token: user?.token }),
    [user?.token]
  );
};
