import { useLoaderStore } from "@/stores/loader-store";
import { CustomError } from "@/ts/interfaces/global/customError";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { useLoading } from "@/hooks/useLoading";

interface UseDataFetchingParams {
  isLoading: boolean;
  isError: boolean;
  error: CustomError | null;
  errorMessage: string;
}

export const useDataFetching = ({
  isLoading,
  isError,
  error,
  errorMessage,
}: UseDataFetchingParams) => {
  const { setIsLoading } = useLoaderStore();
  useErrorNotification(isError, errorMessage, error);
  useLoading(isLoading, setIsLoading);
};
