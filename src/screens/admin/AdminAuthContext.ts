import { createContext } from "react";

const AdminAuthContext = createContext({
  adminLoggedIn: false,
  adminLogIn: () => {},
});

export default AdminAuthContext;
