const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token
    }); //* find a user who has this id & has a valid token.
    if (!user) {
      throw new Error();
    }
    req.token = token; //* to make the current token is the main token for the current session, so that when user logout from a single session(device), it will only remove the current session token and not logout from other sessions if any.
    req.user = user; //* adding a property to the request so that the next route handler can has access to the already-fetched user and not fetch it again.
    next();
    console.log(decoded);
  } catch (error) {
    res.status(401).send({ error: "please authenticate" });
  }
};

module.exports = auth;
