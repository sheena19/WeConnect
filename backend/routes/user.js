const express = require('express');
const User = require('../models/user');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
let secret = "abcdef";

const router = express.Router();
// const hashPwd = crypto.createHmac('sha256', secret);

router.post("/signup", (req, res, next) => {
  const hash = crypto.createHmac('sha256', secret)
    .update(req.body.password)
    .digest('hex');
  console.log(hash);
  const user = new User({
    email: req.body.email,
    password: hash
  });
  user.save()
    .then(result => {
      res.status(201).json({
        message: "User created!",
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post("/login", (req, res, next) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed!"
        });
      }
      fetchedUser = user;
      const hash = crypto.createHmac('sha256', secret).update(req.body.password).digest("hex");
      return (user.password === hash);
    })
    .then(result => {
      if (!result) {
        return res.statusCode(401).json({
          message: "Auth Failed!"
        });
      }
      const token = jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id},
        'secret_this_should_be_longer',
        {expiresIn: '1h'}
      );
      res.status(200).json({
        token: token
      });
    })
    .catch(err => {
      res.status(401).json({
        message: "Auth Failed!"
      });
    })
});

module.exports = router;
