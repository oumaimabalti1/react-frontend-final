import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";


// layouts


import Auth from "layouts/Auth.js";
import User from "layouts/User.js";
// views without layouts




import Landing from "views/Landing.js";
import Profile from "views/Profile.js";
import Index from "views/Index.js";
import Aboutus from "views/Aboutus.js";
import Whyus from "views/Whyus";


ReactDOM.render(
  <BrowserRouter>
    <Switch>
      {/* add routes with layouts */}
     
      <Route path="/auth" component={Auth} />
      <Route path="/candidat" component={User} />
      <Route path="/employee" component={User} />
      <Route path="/admin" component={User} />
      <Route path="/hr" component={User} />
      {/* add routes without layouts */}
      

      <Route path="/landing" exact component={Landing} />
      <Route path="/whyus" exact component={Whyus} />
    <Route path="/aboutus" exact component={Aboutus} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/" exact component={Index} />
      {/* add redirect for first page */}
      <Redirect from="*" to="/" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
