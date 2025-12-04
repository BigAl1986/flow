import { useCallback, useReducer, useState } from "react";

interface State<D> {
  error: Error | null;
  data: D | null;
  stat: "idle" | "loading" | "error" | "success";
}

const defaultState: State<null> = {
  stat: "idle",
  data: null,
  error: null,
};

export const useAsync = <D>(customState?: State<D>) => {
  const [state, dispatch] = useReducer(
    (state: State<D>, action: Partial<State<D>>) => ({
      ...state,
      ...action,
    }),
    {
      ...defaultState,
      ...customState,
    }
  );
  const [retry, setRetry] = useState(() => () => {});

  const setData = useCallback(
    (data: D) =>
      dispatch({
        data,
        stat: "success",
        error: null,
      }),
    []
  );

  const setError = (error: Error) =>
    dispatch({
      data: null,
      stat: "error",
      error,
    });

  const run = useCallback(
    (promise: Promise<D>, needRetry?: { retry: () => Promise<D> }) => {
      if (!promise || !promise.then) {
        throw new Error("请传入 Promise 类型");
      }
      dispatch({ stat: "loading" });
      setRetry(() => () => {
        needRetry?.retry && run(needRetry?.retry(), needRetry);
      });

      return promise
        .then((data) => {
          setData(data);
          return data;
        })
        .catch((error) => {
          setError(error);
          return error;
        });
    },
    [setData]
  );

  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    run,
    setData,
    setError,
    retry,
    ...state,
  };
};
