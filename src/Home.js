import React, { useState } from "react";
import "./App.css";
import { ListInvestors } from "./components/ListInvestors";
import { ListCompanies } from "./components/ListCompanies";
import { InvestorDetails } from "./components/InvestorDetails";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  Switch,
  Route,
  useHistory
} from "react-router-dom";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && props.children}
    </div>
  );
}

function Home() {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
      <div className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Investors" />
          <Tab label="Companies" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <ListInvestors />
          {/* <InvestorDetails /> */}
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ListCompanies />
        </TabPanel>
      </div>
  );
}

export default Home;
