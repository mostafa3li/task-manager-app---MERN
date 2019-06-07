import React, { Component } from "react";

import axios from "../axios";

const { Provider: TasksContextProvider, Consumer: TasksContext } = React.createContext();

class TasksProvider extends Component {
  constructor(props) {
    super(props);

    const token = window.localStorage.getItem("token");
    this.state = {
      tasks: [],
      user: null,
      token,
      error: null,
      getTasks: this.getTasks,
      addTask: this.addTask,
      deleteTask: this.deleteTask,
      updateTask: this.updateTask
    };
  }

  // componentDidMount() {
  //   console.log("Tasks: provider");
  //   const token = window.localStorage.getItem("token");
  //   console.log("token: ", token);
  //   if (token) {
  //     console.log(token);

  //     axios
  //       .get("/tasks", {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       })
  //       .then((res) => {
  //         console.log(res.data);
  //         const tasks = res.data;
  //         this.setState({ tasks });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }

  //! get All Tasks
  getTasks = () => {
    const { token } = this.state;
    axios
      .get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //! add Task
  addTask = ({ description, completed }) => {
    const { token } = this.state;
    axios
      .post(
        "/tasks",
        { description, completed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )
      .then((res) => {
        const newTask = res.data;
        const tasks = [...this.state.tasks];
        tasks.push(newTask);
        this.setState({ tasks });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //! delete Task
  deleteTask = ({ _id }) => {
    const { token } = this.state;
    axios
      .delete(`/tasks/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        const oldTasks = [...this.state.tasks];
        const tasks = oldTasks.filter((task) => _id !== task._id);
        this.setState({ tasks });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //! update Task
  updateTask = ({ newData }) => {
    const { token } = this.state;
    const { description, completed, _id } = newData;
    axios
      .patch(
        `/tasks/${_id}`,
        { description, completed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )
      .then((res) => {
        const { description, completed } = res.data;
        const oldTasks = [...this.state.tasks];
        const tasks = oldTasks.map((task) =>
          task._id === _id ? { ...task, description, completed } : task
        );
        this.setState({ tasks });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { children } = this.props;
    return <TasksContextProvider value={this.state}>{children}</TasksContextProvider>;
  }
}

export { TasksContext };
export default TasksProvider;
