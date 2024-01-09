import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Typography,
  Avatar,
} from "@material-ui/core";
import { ShoppingCart } from "@material-ui/icons";
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

const Navbar = ({ totalItems }) => {
  const classes = useStyles();
  const history = useHistory();
  const token = getData("token");
  const user = getData("user");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
                  <Avatar onClick={handleClick} style={{ marginTop: "5px" }} />
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
                    <Badge
                      color="secondary"
                      onClick={() => history.push("/user-profile")}
                    >
                      <PersonIcon />
                      <h5>Hồ sơ</h5>
                    </Badge>
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
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
