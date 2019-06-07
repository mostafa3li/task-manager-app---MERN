import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Container } from "@material-ui/core";

import Login from "./Pages/Auth/Login";
import HomePage from "./Pages/HomePage";
import Signup from "./Pages/Auth/Signup";
import Navbar from "./components/Navbar/Navbar";
import { AuthContext } from "./context/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthContext>
      {({ user }) => {
        return (
          <BrowserRouter>
            {user ? <Navbar /> : null}
            <main>
              <Container>
                <Switch>
                  <Route path="/" exact component={HomePage} />
                  <Route path="/login" component={Login} />
                  <Route path="/signup" component={Signup} />
                </Switch>
              </Container>
            </main>
          </BrowserRouter>
        );
      }}
    </AuthContext>
  );
}

export default App;

// const ProtectedRoute = ({ component: Component, ...rest }) => (
//   <Route
//     {...rest}
//     render={(params) => (
//       <AuthContext>
//         {({ user }) => (user ? <Component {...params} /> : <Redirect to="/login" />)}
//       </AuthContext>
//     )}
//   />
// );
