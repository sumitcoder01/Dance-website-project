const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');



//ROUTE 1:Create a User using: POST "/api/auth/createuser". No login required
router.post("/createuser", [
  body("name", "Name must be atleast 5 characters").isLength({ min: 3 }),
  body("age", "Age must be number").isNumeric(),
  body("mobileNumber", "mobileNumber must be 10 digit number").isNumeric().isLength(10),
  body("email", "Enter Valid Email").isEmail(),
  body("password", "Password must be atleast 5 characters").isLength({
    min: 5,
  }),
],
  async (req, res) => {
    let success=false;
    //If There are returns bad Request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success,errors: errors.array() });
    }

    //check weather the user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({success,error: "Sorry a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //Create a  new User
      user = await User.create({
        name: req.body.name,
        age: req.body.age,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email,
        password: secPass,
      });

      success=true;
      res.json({success});

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
