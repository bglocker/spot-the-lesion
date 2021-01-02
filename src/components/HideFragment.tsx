import React, { ReactNode } from "react";

interface HideFragmentProps {
  hide?: boolean;
  children: ReactNode;
}

const HideFragment: React.FC<HideFragmentProps> = ({
  children,
  hide = false,
}: HideFragmentProps) => {
  if (hide) {
    return null;
  }

  return <>{children}</>;
};

export default HideFragment;
