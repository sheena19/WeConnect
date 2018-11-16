const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // here we receive it as "Bearer sdjfhsdhflskd-token"
    // authorization name should be same as the one used as header name ser in auth interceptor
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, 'secret_this_should_be_longer');
    next();
  } catch (error) {
    res.status(401).json({
      message: "Auth Failed!"
    });
  }
};
