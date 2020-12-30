import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

interface ProtectedRouteProps extends RouteProps {
  children?: React.ReactNode;
  show: boolean;
  redirectTo: string;
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
