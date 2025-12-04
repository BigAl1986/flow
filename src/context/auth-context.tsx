import React, { ReactNode, useCallback, useMemo } from "react";
import * as auth from "auth-provider";
import { http } from "utils/http";
import { useMount } from "utils";
import { useAsync } from "utils/async";
import { FullPageErrorFallBack, FullPageLoading } from "components/lib";
import { useQueryClient } from "react-query";
import { User } from "types";

const AuthContext = React.createContext<
  | {
      user: User | null;
      login: (form: AuthForm) => Promise<void>;
      register: (form: AuthForm) => Promise<void>;
      logout: () => void;
    }
  | undefined
>(undefined);
AuthContext.displayName = "AuthContext";

interface AuthForm {
  username: string;
  password: string;
}

const initUser = () => {
  let user = null;
  const token = auth.getToken();
  if (token) {
    return http("me", { token }).then((res) => {
      user = res.user;
      return user;
    });
  } else {
    return Promise.resolve(user);
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    run,
    setData: setUser,
  } = useAsync<User | null>();

  const queryClient = useQueryClient();

  const login = useCallback(
    (form: AuthForm) => auth.login(form).then(setUser),
    [setUser]
  );
  const register = useCallback(
    (form: AuthForm) => auth.register(form).then(setUser),
    [setUser]
  );
  const logout = useCallback(() => {
    auth.logout();
    queryClient.clear();
    setUser(null);
  }, [setUser, queryClient]);
  const params = useMemo(
    () => ({ user, login, register, logout }),
    [user, login, register, logout]
  );

  useMount(
    useCallback(() => {
      run(initUser());
    }, [run])
  );

  if (isIdle || isLoading) {
    return <FullPageLoading />;
  }

  if (isError) {
    return <FullPageErrorFallBack error={error} />;
  }

  return <AuthContext.Provider children={children} value={params} />;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth必须在 AuthProvider 中使用");
  return context;
};
