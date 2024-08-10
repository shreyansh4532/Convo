import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { rename, renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userID) => {
  return jwt.sign({ email, userID }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email & password required");
    }

    const user = await User.create({
      email,
      password,
    });

    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email & password required");
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).send("User not found!");
    }

    const auth = compare(password, user.password);

    if (!auth) {
      return res.status(400).send("Password is incorrect!");
    }

    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const userData = await User.findById(req.userID);
    if (!userData) res.status(404).send("User with given id not found!");

    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
      profileSetup: userData.profileSetup,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userID } = req;
    const { firstName, lastName, color } = req.body;
    if (!firstName || !lastName)
      res.status(400).send("First name, last name and color are required!");

    const userData = await User.findByIdAndUpdate(
      userID,
      { firstName, lastName, color, profileSetup: true },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
      profileSetup: userData.profileSetup,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const addProfileImage = async (req, res) => {
  try {
    console.log(req.file);

    if (!req.file) {
      return res.status(400).send("File not present!");
    }

    const date = Date.now();
    const fileName = "uploads/profiles/" + date + req.file.originalname;

    renameSync(req.file.path, fileName);

    const updatedUserData = await User.findByIdAndUpdate(
      req.userID,
      { image: fileName },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      id: updatedUserData._id,
      image: updatedUserData.image,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const removeProfileImage = async (req, res) => {
  try {
    const { userID } = req;

    const user = await User.findById(userID);

    console.log(user);
    if (!user) return res.status(404).send("User not found!");

    if (user.image) {
      unlinkSync(user.image);
    }

    user.image = null;
    await user.save();

    return res.status(200).send("Profile image deleted successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const logout = async (req, res) => {
  try {
    
    res.cookie("jwt", "", {maxAge: 1, sameSite: "None", secure: true});

    return res.status(200).send("Logout Successfull.");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
