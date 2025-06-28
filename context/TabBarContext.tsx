import React, { createContext, useContext, useState } from 'react';

interface TabBarContextType {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const TabBarContext = createContext<TabBarContextType | undefined>(undefined);

export const TabBarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <TabBarContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
    </TabBarContext.Provider>
  );
};

export const useTabBar = () => {
  const context = useContext(TabBarContext);
  if (context === undefined) {
    throw new Error('useTabBar must be used within a TabBarProvider');
  }
  return context;
}; 