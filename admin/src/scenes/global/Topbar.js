import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { delData } from "../../utils/localStorage";

const Topbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Box display="flex" justifyContent="flex-end" p={2}>
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <ExitToAppIcon
            onClick={() => {
              delData("isLogedIn");
              delData("token");
              delData("user");
              window.location.reload();
            }}
          />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
