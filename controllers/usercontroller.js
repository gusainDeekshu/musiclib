
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usermodel = require("../model/usermodel");
const artistmodel = require("../model/artistmodel");
const albummodel = require("../model/albummodel");

//add article
require("dotenv").config();
// login user
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

const loginuser = async (req, res) => {
  const { email, password } = req.body;
  try {
    var MissingField = "";
    if (!email || !password) {
      if (!email && !password) {
        MissingField = "email and password is missing";
      } else if (!email) {
        MissingField = "email is missing";
      } else {
        MissingField = "password is missing";
      }
      return res.status(400).json({
        status: 400,
        data: null,
        message: `Bad Request, Reason:${MissingField}`,
        error: null,
      });
    }
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "User not found.",
        error: null,
      });
    }

    const ismatch = await bcrypt.compare(
      password + process.env.Salt,
      user.password
    );

    if (!ismatch) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Pasword  Not Matched",
        error: nul,
      });
    }

    const token = createtoken(user._id);
    return res.status(200).json({
      status: 200,
      data: {
        token: token,
      },
      message: "Login successful.",
      error: null,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request",
      error: error,
    });
  }
};
const createtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const updatePassword = async (req, res) => {
  const { old_password, new_password } = req.body;

  try {
    var MissingField = "";
    if (!old_password || !new_password) {
      if (!old_password && !new_password) {
        MissingField = "old_password and new_password is missing";
      } else if (!old_password) {
        MissingField = "old_password is missing";
      } else {
        MissingField = "new_password is missing";
      }
      return res.status(400).json({
        status: 400,
        data: null,
        message: `Bad Request, Reason:${MissingField}`,
        error: null,
      });
    }
    const userExist = await usermodel.findById(req.body.id);

    if (!userExist) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "User not found.",
        error: null,
      });
    }
    const isMatch = await bcrypt.compare(
      old_password + process.env.Salt,
      userExist.password
    );
    if (!isMatch) {
      return res.status(403).json({
        status: 403,
        data: null,
        message: "Forbidden Access/Operation not allowed.",
        error: null,
      });
    }
    const hashedPassword = await bcrypt.hash(
      new_password + process.env.Salt,
      10
    );

    userExist.password = hashedPassword;
    await userExist.save();

    return res.status(204).json({});
  } catch (error) {
    return res.json({ success: false, message: error });
  }
};

const ListUser = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const offset = parseInt(req.query.offset) || 0;
    const role = req.query.role;
    console.log(role + "rolehg");
    let users = [];

    users = await usermodel.find({ roles: role }).skip(offset).limit(limit);

    return res.status(200).json({
      status: 200,
      data: users,
      message: "Users retrieved successfully.",
      error: null,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request",
      error: null,
    });
  }
};

const getdata = async (req, res) => {
  try {
 

    users = await usermodel.find();

    return res.status(200).json({
      status: 200,
      data: users,
      message: "Users retrieved successfully.",
      error: null,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request",
      error: null,
    });
  }
};



const removeuser = async (req, res) => {
  try {
    checkuserrole = await usermodel.findOne({ _id: req.body.id });
    if (!checkuserrole.roles.includes("Admin")) {
      return res.status(403).json({
        status: 403,
        data: null,
        message: "Forbidden Access/Operation not allowed.",
        error: null,
      });
    }
    const userExist = await usermodel.findById(req.params.id);
    if (!userExist) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "User not found.",
        error: null,
      });
    }

    await usermodel.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: 200,
      data: null,
      message: "User deleted successfully.",
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request",
      error: error,
    });
  }
};

//register user
const registeruser = async (req, res) => {
  const { email, password } = req.body;
  try {
    var MissingField = "";
    if (!email || !password) {
      if (!email && !password) {
        MissingField = "email and password is missing";
      } else if (!email) {
        MissingField = "email is missing";
      } else {
        MissingField = "password is missing";
      }
      return res.status(400).json({
        status: 400,
        data: null,
        message: `Bad Request, Reason:${MissingField}`,
        error: null,
      });
    }
    const customSalt = process.env.Salt; // Your custom salt value
    const hashedpassword = await bcrypt.hash(password + customSalt, 10);
    console.log(hashedpassword);
    const userExist = await usermodel.findOne({ email: email });
    if (userExist) {
      return res.status(409).json({
        status: 409,
        data: null,
        message: "Email already exists.",
        error: null,
      });
    }
    //creating new user
    const newuser = new usermodel({
      email: email,
      password: hashedpassword,
    });
    const user = await newuser.save();
    const token = createtoken(user._id);
    return res.status(201).json({
      status: 201,
      data: null,
      message: "User created successfully.",
      error: null,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request",
      error: error,
    });

    console.log(error);
  }
};

const tokenBlacklist = new Set();
const logoutuser= async (req,res)=>{
try {
  const token = req.headers["authorization"].split(" ")[1];

  if (!token) {
    return  res.status(400).json({
      "status": 400,
      "data": null,
      "message": "Bad Request",
      "error": null
     } );
  }
   // Decode token to get expiration time
   const decoded = jwt.decode(token);

   if (!decoded) {
     return  res.status(400).json({
      "status": 400,
      "data": null,
      "message": "Bad Request",
      "error": null
     } );
   }

   // Add token to blacklist
   tokenBlacklist.add(token);

   // Optionally set the blacklist to expire when the token expires
   const expiresIn = decoded.exp * 1000 - Date.now();
   setTimeout(() => tokenBlacklist.delete(token), expiresIn);

   return res.status(200).json({
    "status": 200,
    "data": null,
    "message": "User logged out successfully.",
    "error": null
   }
   );
} catch (error) {
  return res.status(400).json({
    "status": 400,
    "data": null,
    "message": "Bad Request.",
    "error": null
   }
   );
}
}
const registeruserbyadmin = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    var MissingField = "";
    if (!email || !password) {
      if (role == "Admin") {
        return res.status(403).json({
          status: 403,
          data: null,
          message: "Forbidden Access/Operation not allowed.",
          error: null,
        });
      }
      if (!email && !password) {
        MissingField = "email and password is missing";
      } else if (!email) {
        MissingField = "email is missing";
      } else {
        MissingField = "password is missing";
      }

      return res.status(400).json({
        status: 400,
        data: null,
        message: `Bad Request, Reason:${MissingField}`,
        error: null,
      });
    }
    const customSalt = process.env.Salt; // Your custom salt value
    const hashedpassword = await bcrypt.hash(password + customSalt, 10);
    console.log(hashedpassword);
    checkuserrole = await usermodel.findOne({ _id: req.body.id });
    console.log(checkuserrole.roles.includes("Admin"));
    if (!checkuserrole.roles.includes("Admin")) {
      return res.status(403).json({
        status: 403,
        data: null,
        message: "Forbidden Access/Operation not allowed.",
        error: null,
      });
    }
    const userExist = await usermodel.findOne({ email: email });
    if (userExist) {
      return res.status(409).json({
        status: 409,
        data: null,
        message: "Email already exists.",
        error: null,
      });
    }
    //creating new user
    const newuser = new usermodel({
      email: email,
      password: hashedpassword,
    });
    const user = await newuser.save();
    const token = createtoken(user._id);
    return res.status(201).json({
      status: 201,
      data: null,
      message: "User created successfully.",
      error: null,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request",
      error: error,
    });

    console.log(error);
  }
};

module.exports = {
  updatePassword,
  ListUser,
  removeuser,
  loginuser,
  logoutuser,
  registeruser,
  registeruserbyadmin,
  getdata
};
