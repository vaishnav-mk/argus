"use client";
import React, { createContext, useRef } from "react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toast } from 'primereact/toast';
import { TOAST_SEVERITY } from "@/ts/constants/ui";

let globalToast: React.RefObject<Toast> | null = null;

export const showToast = (
  severity: TOAST_SEVERITY,
  summary: string,
  detail: string,
  life: number = 5000
) => {
  globalToast?.current?.show({ severity, summary, detail, life });
};

export function ReactQueryProvider({ children }: React.PropsWithChildren) {
  const toastRef = useRef<Toast>(null);
  globalToast = toastRef;

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error: any, query) => {
        console.error(JSON.stringify(error));
      },
    }),
    mutationCache: new MutationCache({
      onError: (error: any, query) => {
        console.error(JSON.stringify(error));
      },
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Toast ref={toastRef} />
      {children}
    </QueryClientProvider>
  );
}
