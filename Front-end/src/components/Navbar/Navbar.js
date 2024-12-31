import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Typography,
  Avatar,
} from "@material-ui/core";
import { ShoppingCart, NotificationsActiveRounded } from "@material-ui/icons";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ViewListIcon from "@material-ui/icons/ViewList";
import { Link } from "react-router-dom";
import logo from "../../assets/circles.png";
import useStyles from "./styles";
import { getData, delData } from "../../utils/localStorage";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useHistory } from "react-router-dom";
import { notificationApi } from "../../apis";
import { HTTP_STATUS } from "../../constants";
import Notification from '../Notification/Notification';

const Navbar = ({ totalItems }) => {
  const classes = useStyles();
  const history = useHistory();
  const token = getData("token");
  const user = getData("user");
  const [anchorEl, setAnchorEl] = useState(null);
  const [noti, setNoti] = useState(false);
  const [countNoti, setCountNoti] = useState(0);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      history.push("/login");
    }
  };

  return (
    <div>
      <AppBar position="fixed" className={classes.appBar} color="inherit">
        <Toolbar>
          <Typography
            component={Link}
            to="/"
            variant="h5"
            className={classes.title}
            color="inherit"
          >
            <img
              src={logo}
              alt="Book Store App"
              height="50px"
              className={classes.image}
              style={{
                cursor: 'pointer'
              }}
            />
            <strong>Nta-bookstore</strong>
          </Typography>

          <div className={classes.grow} />
          <div className={classes.button}>
            {token ? (
              <>
                <>
                  <Typography variant="h5" color="inherit">
                    <h5 style={{ paddingTop: "12px", paddingRight: "10px" }}>
                      {user.email}
                    </h5>
                  </Typography>
                  <Avatar onClick={handleClick} style={{ marginTop: "5px" , cursor: 'pointer' }} />
                </>
                <Menu
                  id="vertical-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  style={{ marginTop: "50px" }}
                >
                  <MenuItem onClick={handleClose}>
                    <div onClick={() => history.push("/user-profile")}>
                      <Badge
                        color="secondary"
                      >
                        <PersonIcon />
                        <h5>Hồ sơ</h5>
                      </Badge>
                    </div>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Badge
                      color="secondary"
                      onClick={() => history.push("/orders-history")}
                    >
                      <ViewListIcon />
                      <h5>Lịch sử đơn hàng</h5>
                    </Badge>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Badge
                      color="secondary"
                      onClick={() => {
                        delData("token");
                        delData("user");
                        delData("isLogedIn");
                        window.location.href = "/";
                      }}
                    >
                      <ExitToAppIcon />
                      <h5>Đăng xuất</h5>
                    </Badge>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <IconButton
                component={Link}
                to="/login"
                aria-label="Show cart items"
                color="inherit"
              >
                <Badge color="secondary">
                  <ExitToAppIcon />
                </Badge>
              </IconButton>
            )}
            <IconButton
              component={Link}
              to="/cart"
              aria-label="Show cart items"
              color="inherit"
            >
              <Badge badgeContent={totalItems} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
            <IconButton
              aria-label="Show cart items"
              color="inherit"
              onClick={handleOpenNoti}
            >
              <Badge badgeContent={countNoti} color="secondary">
                <NotificationsActiveRounded />
              </Badge>
            </IconButton>
            {noti && <Notification />}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
