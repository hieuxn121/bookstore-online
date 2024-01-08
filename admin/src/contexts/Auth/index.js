import * as React from "react";

import { authProvider } from "./auth";
import { setData, delData, getData } from "../../utils/localStorage";

const AuthContext = React.createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(getData("user") || false);
  const [token, setToken] = React.useState(getData("token") || false);
  const [isLogedIn, setIsLogedIn] = React.useState(
    getData("isLogedIn") || false
  );

  const signin = (newUser, token, callback) => {
    return authProvider.signin(() => {
      setUser(newUser);
      setToken(token);
      setIsLogedIn(true);
      setData("user", newUser);
      setData("token", token);
      setData("isLogedIn", true);
      callback();
    });
  };

  const signout = (callback) => {
    return authProvider.signout(() => {
      setUser(null);
      setToken(null);
      setIsLogedIn(null);
      delData("user");
      delData("token");
      delData("isLogedIn");
      callback();
    });
  };

  const value = { user, token, isLogedIn, signin, signout, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return React.useContext(AuthContext);
};

export { AuthProvider, useAuth };
