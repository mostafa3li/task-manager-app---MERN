import React from "react";
import axios from "../../axios";
import { Paper, Typography } from "@material-ui/core";

import classes from "./Home.module.scss";
import { AuthContext } from "../../context/AuthContext";

import UserInfo from "../../components/Modals/UserInfo";
import UserImage from "../../components/Modals/UserImage";

class PaperSheet extends React.Component {
  state = {
    userImage: "https://i.pravatar.cc/250",
    updatedImage: null,
    name: "",
    updatedName: null,
    email: "",
    updatedEmail: null,
    age: "",
    updatedAge: null
  };

  //! get user data
  getUserData = () => {
    const token = window.localStorage.getItem("token");
    axios
      .get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        const { name, email, age } = res.data;
        this.setState({ name, email, age });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  //! get user image
  getUserImage = () => {
    const _id = window.localStorage.getItem("_id");
    const token = window.localStorage.getItem("token");
    axios
      .get(`/users/${_id}/avatar`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          const userImage = `${process.env.REACT_APP_BASE_URL}/users/${_id}/avatar`;
          this.setState({ userImage });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getUserImage();
    this.getUserData();
  }

  //! inputs change handler
  changeDataHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  //! submit updated data
  submitDataHandler = (e) => {
    e.preventDefault();
    const token = window.localStorage.getItem("token");
    const { name, email, age } = this.state;
    axios
      .patch(
        "/users/me",
        { name, email, age },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((res) => {
        console.log(res.data);
        const { name, email, age } = res.data;
        this.setState({ name, email, age });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //! image change handler
  changeImageHandler = (e) => {
    let updatedImage = e.target.files[0];
    this.setState({ updatedImage });
  };

  //! submit image handler
  submitImageHandler = (e) => {
    e.preventDefault();
    const token = window.localStorage.getItem("token");
    let formData = new FormData();
    formData.append("avatar", this.state.updatedImage);

    axios({
      method: "POST",
      url: "/users/me/avatar",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data"
      },
      data: formData
    })
      .then((res) => {
        console.log(res);
        this.setState({ userImage: this.state.updatedImage });
        this.getUserImage();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <AuthContext>
        {({ error, user }) => {
          let joinedAt;
          if (user) {
            // name = user.name;
            // email = user.email;
            // age = user.age;
            const date = new Date(user.createdAt);
            joinedAt = date.toLocaleString();
          }
          let { name, email, age } = this.state;

          return (
            <section>
              <Paper className={classes.profile}>
                <Typography variant="h5" component="h3">
                  My Profile
                </Typography>
                <hr />
                <div className="media">
                  <div>
                    <img
                      src={this.state.userImage}
                      className="mr-3 img-thumbnail"
                      alt={name}
                      width="250"
                      height="250"
                    />
                  </div>
                  <div className="media-body">
                    <h5 className="mt-0">{name}</h5>
                    <hr />
                    <h6 className="mt-0">
                      Email: <strong>{email}</strong>
                    </h6>
                    <hr />
                    <h6 className="mt-0">
                      Age: <strong>{age}</strong>
                    </h6>
                    <hr />
                    <h6 className="mt-0">
                      Joined at: <strong>{joinedAt}</strong>
                    </h6>
                    <hr />
                    <div className="d-flex justify-content-around">
                      <UserImage
                        changeHandler={this.changeImageHandler}
                        submitHandler={this.submitImageHandler}
                      />
                      <UserInfo
                        changeHandler={this.changeDataHandler}
                        submitHandler={this.submitDataHandler}
                        userInfo={this.state}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <Typography component="p">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempore modi quasi
                  cupiditate vero porro dolorum nobis eaque aliquam perferendis velit quam, magni
                  ipsum sequi numquam aperiam odio ab sapiente reiciendis. Lorem ipsum dolor sit
                  amet consectetur adipisicing elit. Iusto quibusdam nemo, cum officia corrupti
                  expedita cumque similique suscipit minima consequatur quae, alias enim dolorem
                  labore provident.
                </Typography>
              </Paper>
            </section>
          );
        }}
      </AuthContext>
    );
  }
}

export default PaperSheet;
