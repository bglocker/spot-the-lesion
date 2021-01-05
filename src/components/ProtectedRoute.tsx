import React, { ReactNode } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

interface ProtectedRouteProps extends RouteProps {
  show: boolean;
  redirectTo: string;
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  show,
  redirectTo,
  ...other
}: ProtectedRouteProps) => {
  // Props are properly destructured and passed
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Route {...other}>{show ? children : <Redirect to={redirectTo} />}</Route>;
};

export default ProtectedRoute;
