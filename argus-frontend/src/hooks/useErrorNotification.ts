import { useEffect } from "react";
import { errorNotification } from "@/lib/errorResponse";
import { CustomError } from "@/interfaces/global/customError";

export const useErrorNotification = (
  isError: boolean,
  title: string,
  error: CustomError | null = null
) => {
  useEffect(() => {
    errorNotification(isError, title, error);
  }, [error, isError, title]);
};
