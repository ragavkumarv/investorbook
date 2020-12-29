import React, { useState } from "react";
import "./App.css";
import { SearchTable } from "./components/SearchTable";
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

function App() {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="App">
      <h2 class="logo">INVESTORBOOK</h2>
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
        <SearchTable value={value} index={0} />
      </div>
    </div>   
  );
}

export default App;
