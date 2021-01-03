import React, { ReactNode } from "react";

interface TabPanelProps {
  value: number;
  index: number;
  children: ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }: TabPanelProps) => {
  if (value !== index) {
    return null;
  }

  return <>{children}</>;
};

export default TabPanel;
