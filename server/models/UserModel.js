import mongoose from "mongoose";
import bcrypt, { genSalt, hash } from "bcrypt";

const user = new mongoose.Schema({
    email: {
        type: String,
        require: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        require: [true, "Password is required"],
    },
    firstName: {
        type: String,
        require: false,
    },
    lastName: {
        type: String,
        require: false,
    },
    image: {
        type: String,
        require: false,
    },
    color: {
        type: Number,
        require: false,
    },
    profileSetup: {
        type: Boolean,
        default: false,
    }
});

user.pre("save", async function(next) {
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
    next();
})

const User = mongoose.model("Users", user);

export default User;