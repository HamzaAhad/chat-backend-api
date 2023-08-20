const db = require("../../models/index");
const UserModel = db.users;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("../../config/auth.config");

//middlewares

module.exports.checkDuplicateUsernameOrEmail = async (req, res, next) => {
  // Username
  UserModel.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.send({
        message: "Failed! Username is already in use!",
      });
      return;
    }
    next();
  });
};

//Signup Login

module.exports.signup = async (req, res) => {
  UserModel.create({
    username: req?.body?.username,
    password: bcrypt.hashSync(req.body.password, 8),
    playerId: req.body.playerId,
    loggedInAt: new Date(),
  }).then(() => {
    res.send({ message: "USER REGISTERED" });
  });
};

module.exports.signin = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 1.577e8, // 24 hours
    });
    const data = await UserModel.update(
      { playerId: req.body.playerId, loggedInAt: new Date() },
      {
        where: {
          username: req.body.username,
        },
      }
    );
    res.status(200).send({
      id: user.id,
      name: user.username,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports.changePassword = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(
      req.body.currentPassword,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    await UserModel.update(
      {
        password: bcrypt.hashSync(req.body.newPassword, 8),
      },
      {
        where: { id: user?.id },
      }
    );
    return res.status(200).send({ message: "Password Updated" });
  } catch {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};
