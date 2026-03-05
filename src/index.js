import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/styles/tailwind.css";

import Auth from "layouts/Auth.js";
import User from "layouts/User.js";
import Landing from "views/Landing.js";
import Profile from "views/Profile.js";
import Index from "views/Index.js";
import Aboutus from "views/Aboutus.js";
import Whyus from "views/Whyus";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route path="/candidat" component={User} />
      <Route path="/employee" component={User} />
      <Route path="/admin" component={User} />
      <Route path="/hr" component={User} />
      <Route path="/landing" exact component={Landing} />
      <Route path="/whyus" exact component={Whyus} />
      <Route path="/aboutus" exact component={Aboutus} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/" exact component={Index} />
      <Redirect from="*" to="/" />
    </Switch>
  </BrowserRouter>
);