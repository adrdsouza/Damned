'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Good {
  name: string;
  price: string;
}

interface GoodContextType {
  good: Good[] | null;
  setGood: (update: Good[] | null) => void;
}

const GoodContext = createContext<GoodContextType | undefined>(undefined);

export const GoodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [good, setGood] = useState<Good[] | null>(null);

  return (
    <GoodContext.Provider value={{ good, setGood }}>
      {children}
    </GoodContext.Provider>
  );
};

export const useGood = (): GoodContextType => {
  const context = useContext(GoodContext);
  if (context === undefined) {
    throw new Error('useGood must be used within a GoodProvider');
  }
  return context;
};
