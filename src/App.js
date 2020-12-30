import React, { useState } from "react";
import "./App.css";
import { ListInvestors } from "./components/ListInvestors";
import { ListCompanies } from "./components/ListCompanies";
import { InvestorDetails } from "./components/InvestorDetails";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Home from "./Home";
import { Switch, Route, useHistory } from "react-router-dom";

// const useStyles = makeStyles({
//   root: {
//     flexGrow: 1,
//   },
// });

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`wrapped-tabpanel-${index}`}
//       aria-labelledby={`wrapped-tab-${index}`}
//       {...other}
//     >
//       {value === index && props.children}
//     </div>
//   );
// }

function App() {
  // const classes = useStyles();
  const [value, setValue] = useState(0);
  const history = useHistory();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{ position: "relative" }} className="App">
      <p className="logo" onClick={(e) => history.push("/")}></p>
      <Switch>
        <Route path="/investor/:id">
          <InvestorDetails />
        </Route>
        <Route path="/investors">
          <Home />
        </Route>
        <Route path="/companies">
          <Home />
        </Route>
        <Route path="/">
          <Home />
        </Route>
        <Route path="**">
          <Home />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
