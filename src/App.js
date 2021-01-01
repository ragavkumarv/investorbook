import React from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import "./App.css";
import { CompanyDetails } from "./components/CompanyDetails";
import { InvestorDetails } from "./components/InvestorDetails";
import Home from "./Home";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

function App() {
  const history = useHistory();
  const location = useLocation();

  const homePaths = ["/", "/investors", "/companies"];

  return (
    <div style={{ position: "relative" }} className="App">
      <div
        style={{
          display: "flex",
          marginBottom: "10px",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {homePaths.find((path) => location.pathname === path) ? (
          ""
        ) : (
          <IconButton
            aria-label="back"
            style={{
              marginTop: "24px",
            }}
            onClick={() => history.goBack()}
          >
            <ArrowBackIosIcon fontSize="large" />
          </IconButton>
        )}

        <p
          className="logo"
          style={{ cursor: "pointer", marginTop: "40px" }}
          onClick={(e) => history.push("/")}
        ></p>
        
      </div>
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
