import React, { ReactNode } from "react";

interface TabPanelProps {
  children: ReactNode;
  className?: string;
  value: number;
  index: number;
}

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  className,
  value,
  index,
}: TabPanelProps) => {
  return (
    <div className={className} style={{ display: value !== index ? "none" : "" }}>
      {value !== index ? null : children}
    </div>
  );
};

export default TabPanel;
