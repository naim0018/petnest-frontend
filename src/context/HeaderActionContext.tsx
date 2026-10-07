"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface HeaderActionContextType {
  headerAction: ReactNode | null;
  setHeaderAction: (action: ReactNode | null) => void;
}

const HeaderActionContext = createContext<HeaderActionContextType>({
  headerAction: null,
  setHeaderAction: () => {},
});

export function HeaderActionProvider({ children }: { children: ReactNode }) {
  const [headerAction, setHeaderAction] = useState<ReactNode | null>(null);

  return (
    <HeaderActionContext.Provider value={{ headerAction, setHeaderAction }}>
      {children}
    </HeaderActionContext.Provider>
  );
}

export function useHeaderAction() {
  return useContext(HeaderActionContext);
}
