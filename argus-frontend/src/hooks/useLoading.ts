import { useEffect } from "react";

export const useLoading = (isLoading, setIsLoading) => {
  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);
};
