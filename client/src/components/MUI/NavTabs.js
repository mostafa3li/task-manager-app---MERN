import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import Assignment from "@material-ui/icons/Assignment";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
//==================
import Profile from "../../Pages/Tabs/Profile";
import Tasks from "../../Pages/Tabs/Tasks";
//==================
function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper
    // width: 500
  }
}));

function FullWidthTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function handleChangeIndex(index) {
    setValue(index);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab
            icon={
              <>
                <Assignment /> <span>My Tasks</span>
              </>
            }
            aria-label="Search"
          />
          <Tab
            icon={
              <>
                <PersonPinIcon /> <span>Profile</span>
              </>
            }
            aria-label="Person"
          />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabContainer dir={theme.direction}>
          <Tasks />
        </TabContainer>
        <TabContainer dir={theme.direction}>
          <Profile />
        </TabContainer>
      </SwipeableViews>
    </div>
  );
}

export default FullWidthTabs;
