import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import "./App.css";
import { CompanyDetails } from "./components/CompanyDetails";
import { InvestorDetails } from "./components/InvestorDetails";
import Home from "./Home";


function App() {
  const history = useHistory();

  return (
    <div style={{ position: "relative" }} className="App">
      <p className="logo" onClick={(e) => history.push("/")}></p>
      <Switch>
        <Route path="/investor/:id">
          <InvestorDetails />
        </Route>
        <Route path="/company/:id">
          <CompanyDetails />
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
