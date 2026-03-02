import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";


import FooterSmall from "components/Footers/FooterSmall.js";

import AcceuilC from "views/candidat/AcceuilC";
import Applications from "views/candidat/Applications";
import Offre from "views/candidat/Offre";
import MonCV from "views/candidat/Moncv";

import AcceuilE from "views/employee/AcceuilE";
import Conge from "views/employee/Conge";
import Plainte from "views/employee/Plainte";



import AcceuilH from "views/hr/AcceuilH";
import Employeelist from "views/hr/Employeelist";
import Conges from "views/hr/Conges";
import Candidatures from "views/hr/Candidatures";
import Plaintes from "views/hr/Plaintes";
import Offres from "views/hr/Offres";



import Dashboard from "views/admin/Dashboard";
import Entreprises from "views/admin/Entreprises";

export default function User() {
  return (
    <>
      
      <main className="bg-blueGray-100">
        <Switch>

          {/* Candidat Routes */}
          <Route path="/candidat/accueil" exact component={AcceuilC} />
          <Route path="/candidat/applications" exact component={Applications} />
          <Route path="/candidat/offre" exact component={Offre} />
          <Route path="/candidat/moncv" exact component={MonCV} />
           <Redirect from="/candidat" to="/candidat/accueil" />

           {/* Employee Routes */}

          <Route path="/employee/accueil" exact component={AcceuilE} />
          <Route path="/employee/conge" exact component={Conge} />
          
          <Route path="/employee/plainte" exact component={Plainte} />

          <Redirect from="/employee" to="/employee/accueil" />


        
         


          {/* HR Routes */}
          <Route path="/hr/accueil" exact component={AcceuilH} />
      
          <Route path="/hr/conges" exact component={Conges} />
     <Route path="/hr/employeelist" exact component={Employeelist} />
      <Route path="/hr/candidatures" exact component={Candidatures} />
      <Route path="/hr/plaintes" exact component={Plaintes} />
      <Route path="/hr/offres" exact component={Offres} />

    
          <Redirect from="/hr" to="/hr/accueil" />

            {/* admin Routes */}
          <Route path="/admin/dashboard" exact component={Dashboard} />
          <Route path="/admin/entreprises" exact component={Entreprises} />
          <Redirect from="/admin" to="/admin/dashboard" />

          
        
         
          
        </Switch>
        <FooterSmall />
      </main>
    </>
  );
}
