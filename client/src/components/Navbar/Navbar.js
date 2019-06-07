import React from "react";
import { Link } from "react-router-dom";

import { AppBar, Toolbar, Button, Typography } from "@material-ui/core";
import { AuthContext } from "../../context/AuthContext";

import classes from "./Navbar.module.scss";
// import NavTabs from "../NavTabs";

const NavBar = () => {
  return (
    <AuthContext>
      {({ error, user, logOut }) => {
        return (
          <header>
            <AppBar position="static">
              <Toolbar className={classes.nav}>
                <div>
                  <Link to="/" className={classes.logo}>
                    <Typography variant="h6">Task Manager App</Typography>
                  </Link>
                </div>
                <div>
                  <span className="mr-5">{user.name}</span>
                  <Button onClick={logOut} variant="contained" color="secondary">
                    Log out
                  </Button>
                </div>
              </Toolbar>
            </AppBar>
          </header>
        );
      }}
    </AuthContext>
  );
};

export default NavBar;
