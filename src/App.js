import React, { useState } from "react";
import "./App.css";
import { SearchTable } from "./components/SearchTable";
import { ListCompanies } from "./components/ListCompanies";
import Investors from "./Investors";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

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

function App() {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{ position: "relative" }} className="App">
      <p className="logo"></p>
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
          <SearchTable />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ListCompanies />
        </TabPanel>
      </div>
    </div>
  );
}

export default App;
