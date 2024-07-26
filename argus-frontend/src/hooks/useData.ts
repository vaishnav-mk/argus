import { LogApi } from "./../api/logApi";
import { useQuery } from "@tanstack/react-query";
import { useDataFetching } from "@/hooks/useDataFetching";
import { useQueryProps } from "@/app/ts/interfaces/configs/types";
// import { ERROR_FETCHING_CARS } from "@/app/ts/constants/messages";

export const useData = ({
  filterObject = undefined,
  active = false,
  enabled = true,
}: any) => {
  const errorMessage = "ERROR_FETCHING_LOGS";
  const getLogs = async () => {
    if (
      Object.keys(filterObject || {}).length === 0 ||
      filterObject === undefined
    )
      return await LogApi.getAllLogs();
    return await LogApi.getSpecificLog(filterObject.id);
  };

  //   const getFilteredCars = async () => {
  //     if (
  //       Object.keys(filterObject || {}).length === 0 ||
  //       filterObject === undefined
  //     )
  //       return await CarApi.getActiveCars();
  //     return await CarApi.getCarsWithSpecificBrand(filterObject.id, active);
  //   };

  const {
    data: logs,
    isLoading,
    refetch,
    error,
    isError,
  } = useQuery({
    queryKey: ["data"],
    queryFn: getLogs,
    retry: 0,
    enabled,
  });

  useDataFetching({
    isLoading,
    isError,
    error,
    errorMessage,
  });

  return { logs, isLoadingLogs, refetchLogs, errorLogs };
};
