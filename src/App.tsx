import React from "react";
import { Route, HashRouter, Switch } from "react-router-dom";
import LoginPage from "./pages/login";
import HomePage from "./pages/Home";
export default () => {
  return (
    <div>
      <HashRouter>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </HashRouter>
    </div>
  );
};
