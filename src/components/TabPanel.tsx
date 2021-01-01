import React, { ReactNode } from "react";

interface TabPanelProps {
  children: ReactNode;
  value: number;
  index: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }: TabPanelProps) => {
  if (value !== index) {
    return null;
  }

  return <>{children}</>;
};

export default TabPanel;
