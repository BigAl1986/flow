import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";

export const isFalsy = (val: unknown) => (val === 0 ? false : !val);

export const isVoid = (val: unknown) =>
  val === undefined || val === null || val === "";

export const cleanObj = (obj: { [key: string]: unknown }) => {
  const res = { ...obj };
  Object.keys(res).forEach((key) => {
    const val = obj[key];
    if (isVoid(val)) delete res[key];
  });
  return res;
};

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
  }, [callback]);
};

export const useDebounce = <V>(value: V, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};

export const useArray = <T>(arr: T[]) => {
  const [value, setValue] = useState(arr);
  const clear = () => setValue([]);
  const removeIndex = (index: number) => {
    const copy = [...value];
    copy.splice(index, 1);
    setValue(copy);
  };
  const add = (item: T) => setValue([item, ...value]);
  return {
    value,
    setValue,
    clear,
    removeIndex,
    add,
  };
};

export const useDocumentTitle = (title: string, keepOnUnmount = true) => {
  // useRef.current返回一个在组件生命周期内永远不变的值；
  const oldTitle = useRef(document.title).current;

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (!keepOnUnmount) document.title = oldTitle;
    };
  }, [keepOnUnmount, title, oldTitle]);
};

export const toIndex = () => {
  window.location.href = window.location.origin;
};

export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return [
    useMemo(
      () =>
        keys.reduce((pre, key) => {
          return { ...pre, [key]: searchParams.get(key) || "" };
        }, {} as { [key in K]: string }),
      [searchParams, keys]
    ),
    useCallback(
      (params: Partial<{ [key in K]: unknown }>) => {
        const obj = cleanObj({
          ...Object.fromEntries(searchParams),
          ...params,
        }) as URLSearchParamsInit;
        return setSearchParams(obj);
      },
      [setSearchParams, searchParams]
    ),
  ] as const;
};

export const useMountedRef = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  });

  return mountedRef;
};
