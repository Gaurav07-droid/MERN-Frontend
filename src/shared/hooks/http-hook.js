import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);

      const httpAbrtControl = new AbortController();
      activeHttpRequests.current.push(httpAbrtControl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbrtControl.signal,
        });

        const resData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbrtControl
        );

        if (resData.status !== "success") {
          throw new Error(resData.message);
        }

        setIsLoading(false);
        return resData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abotCtr) => abotCtr.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
