const express = require("express");
const cors = require("cors");
require("./db/mongoose");
const path = require("path");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT;

app.use(cors());
//! automatically parse incoming JSON to an OBJECT
app.use(express.json());
//*=======================================
//! user routes
app.use(userRouter);
//*=======================================
//! task routes
app.use(taskRouter);
//*=======================================

// SERVE static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
  console.log("--------------------------");
});
