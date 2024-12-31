import React, { useState, useEffect } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { NotificationsOutlined } from '@mui/icons-material';
import { delData, getData } from "../../utils/localStorage";
import Notification from '../../components/Notification';
import { notificationApi } from "../../apis";
import { HTTP_STATUS } from "../../constants";
import Badge from '@mui/material/Badge';
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const colorMode = useContext(ColorModeContext);
  const user = getData("user");
  const token = getData("token");
  const [noti, setNoti] = useState(false);
  const [countNoti, setCountNoti] = useState(0);

  const fetchCountUnread = async () => {
    try {
      const { data, status } = await notificationApi.listNotificationsUnread(user?.id);
      if (status === HTTP_STATUS.OK) {
        if (data.statusCode === "00000") {
          setCountNoti(data.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  window.fetchCountUnread = fetchCountUnread;

  useEffect(() => {
    fetchCountUnread();
    const interval = setInterval(fetchCountUnread, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenNoti = () => {
    if(token) {
      setNoti(!noti);
    } else {
      navigate("/login");
    }
  };

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
        <IconButton onClick={handleOpenNoti}>
          <ExitToAppIcon
            onClick={() => {
              delData("isLogedIn");
              delData("token");
              delData("user");
              window.location.reload();
            }}
          />
        </IconButton>
        <IconButton  onClick={handleOpenNoti}>
          <Badge badgeContent={countNoti} color="error">
            <NotificationsOutlined/>
          </Badge>
        </IconButton>
        {noti && <Notification />}
      </Box>
    </Box>
  );
};

export default Topbar;
