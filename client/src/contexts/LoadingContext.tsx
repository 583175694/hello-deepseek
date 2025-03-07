"use client";

import React, { createContext, useContext, useState } from "react";
import { Loading } from "@/components/ui/loading";

interface LoadingContextType {
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  showLoading: () => {},
  hideLoading: () => {},
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      <Loading isLoading={isLoading} />
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);
