import React from "react";
import { Switch, Route,  } from "react-router-dom";

// components


// views

import Login from "views/auth/Login.js";
import Register from "views/auth/Register.js";


export default function Auth() {
  return (
    <>
   
      <main className="min-h-screen w-screen">
  <section className="relative min-h-screen w-full">
    <Switch>
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />
       

    </Switch>
  </section>
</main>

    </>
  );
}
