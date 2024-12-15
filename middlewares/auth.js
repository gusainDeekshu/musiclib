const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).json({
          status: 401,
          data: null,
          message: "Unauthorized Access",
          error: null,
        });
      } else {
        req.body.id = decode.id;
        console.log( decode.id)
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request",
      error: null,
    });
  }
};

module.exports = { authMiddleware };
