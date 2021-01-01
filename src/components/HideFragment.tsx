import React, { ReactNode } from "react";

interface HideFragmentProps {
  children: ReactNode;
  hide?: boolean;
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
