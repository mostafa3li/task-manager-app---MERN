import React, { Component } from "react";
// import { Redirect } from "react-router-dom";

import axios from "../axios";

const { Provider: AuthContextProvider, Consumer: AuthContext } = React.createContext();

class AuthProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      userImage: null,
      registeredUser: null,
      error: null,
      logIn: this.logIn,
      signUp: this.signUp,
      logOut: this.logOut
    };
  }

  componentDidMount() {
    // console.log("AUTH: provider");

    const token = window.localStorage.getItem("token");
    if (token) {
      if (!this.state.user) {
        console.log("token: ", token);
        axios
          .get("/users/me", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((res) => {
            const user = res.data;
            console.log("user: ", user);
            this.setState({ user });
          })
          .catch((err) => {
            console.error(err);
            localStorage.removeItem("token");
          });
      }
    }
  }

  //! log in
  logIn = ({ email, password }) => {
    axios
      .post("/users/login", { email, password })
      .then((res) => {
        const { user, token } = res.data;
        window.localStorage.setItem("token", token);
        window.localStorage.setItem("_id", user._id);
        this.setState({ user });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ error: "Invalid email or password" });
      });
  };

  //! register
  signUp = ({ name, email, password }) => {
    axios
      .post("/users", { name, email, password })
      .then((res) => {
        console.log(res.data);
        if (res.status === 201) {
          const { user } = res.data;
          this.setState({ registeredUser: user });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: "Invalid Data" });
      });
  };

  //! log out
  logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("_id");
    this.setState({ user: null, error: null });
    // window.location.reload();
  };

  render() {
    const { children } = this.props;
    return <AuthContextProvider value={this.state}>{children}</AuthContextProvider>;
  }
}

export { AuthContext };
export default AuthProvider;
