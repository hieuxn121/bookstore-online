import * as React from "react";

import { authProvider } from "./auth";
import { setData, delData, getData } from "../../utils/localStorage";

const AuthContext = React.createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(getData("user") || false);
  const [token, setToken] = React.useState(getData("token") || false);

  const signin = (newUser, token, callback) => {
    return authProvider.signin(() => {
      setUser(newUser);
      setToken(token);
      setData("user", newUser);
      setData("token", token);
      callback();
    });
  };

  const signout = (callback) => {
    return authProvider.signout(() => {
      setUser(null);
      setToken(null);
      delData("user");
      delData("token");
      callback();
    });
  };

  const value = { user, token, signin, signout, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return React.useContext(AuthContext);
};

export { AuthProvider, useAuth };
