import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
// import Dashboard from "./scenes/dashboard";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import SignInSide from "./components/SignInSide";
import { useSelector } from "react-redux";
import Book from "./scenes/books";
import User from "./scenes/users";
import Category from "./scenes/categories";
import Orders from "./scenes/orders";
import OrderDetail from "./scenes/orders/orderDetail";
import { AuthProvider, SnackbarProvider } from "./contexts";
const App = () => {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const { isLogedIn } = useSelector((state) => state.users);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <AuthProvider>
        <SnackbarProvider>
          <ThemeProvider theme={theme}>
            <div className="app">
              {isLogedIn ? <Sidebar isSidebar={isSidebar} /> : <></>}
              <main className="content">
                {isLogedIn ? <Topbar setIsSidebar={setIsSidebar} /> : <></>}
                <CssBaseline />
                <Routes>
                  {!isLogedIn ? (
                    <Route path="/login" element={<SignInSide />} />
                  ) : (
                    <Route path="/login" element={<Navigate to="/" />} />
                  )}
                  {/* {isLogedIn ? (
                    <Route path="/" element={<Dashboard />} />
                  ) : (
                    <Route path="*" element={<Navigate to="/login" />} />
                  )} */}
                  {isLogedIn ? (
                    <Route path="/users" element={<User />} />
                  ) : (
                    <Route path="*" element={<Navigate to="/login" />} />
                  )}
                  {isLogedIn ? (
                    <Route path="/books" element={<Book />} />
                  ) : (
                    <Route path="*" element={<Navigate to="/login" />} />
                  )}
                  {isLogedIn ? (
                    <Route path="/categories" element={<Category />} />
                  ) : (
                    <Route path="*" element={<Navigate to="/login" />} />
                  )}
                  {isLogedIn ? (
                    <Route path="/orders" exact element={<Orders />} />
                  ) : (
                    <Route path="*" element={<Navigate to="/login" />} />
                  )}
                  {isLogedIn ? (
                    <Route path="/orders/:id" exact element={<OrderDetail />} />
                  ) : (
                    <Route path="*" element={<Navigate to="/login" />} />
                  )}
                </Routes>
              </main>
            </div>
          </ThemeProvider>
        </SnackbarProvider>
      </AuthProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
