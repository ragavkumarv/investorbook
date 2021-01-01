import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import "./App.css";
import { CompanyDetails } from "./components/CompanyDetail/CompanyDetails";
import { InvestorDetails } from "./components/InvestorDetails/InvestorDetails";
import Home from "./Home";
import { useWindowSize, BackButton } from "./components/helper";

function App() {
  const history = useHistory();
  const size = useWindowSize();
  const small = size.width < 550;

  return (
    <div style={{ position: "relative" }} className="App">
      <BackButton
       marginTop="26px"
        display={small}
        content={
          <p
            className="logo"
            style={{ cursor: "pointer", marginTop: "40px", marginLeft: '10px' }}
            onClick={(e) => history.push("/")}
          ></p>
        }
      />
      <Switch>
        <Route path="/investor/:id">
          <BackButton marginTop="46px" display={!small} content={<InvestorDetails />} />
        </Route>
        <Route path="/company/:id">
        <BackButton marginTop="34px" display={!small} content={ <CompanyDetails />} />
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
