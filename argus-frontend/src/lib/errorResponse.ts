import { TOAST_SEVERITY } from "@/ts/constants/ui";
import { showToast } from "@/providers/QueryClientProvider";

export interface CustomError extends Error {
  status?: number;
}

export const errorNotification = (
  isError: boolean,
  title: string,
  error: CustomError | null = null
) => {
  if (isError && error) {
    showToast(
      TOAST_SEVERITY.ERROR,
      `${error.status}: ${title}`,
      error.message,
      5000
    );
  }
};
