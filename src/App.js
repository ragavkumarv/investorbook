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


function App() {
  const history = useHistory();

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
