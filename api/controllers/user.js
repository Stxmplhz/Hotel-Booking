import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { currentPassword, password, ...others } = req.body;

    const user = await User.findById(userId);
    if (!user) return next(createError(404, "User not found!"));

    let updateData = { ...others };

    if (password) {
      if (!currentPassword) {
        return next(createError(400, "Please provide your current password."));
      }

      const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordCorrect) {
        return next(createError(400, "Current password is incorrect!"));
      }

      const salt = bcrypt.genSaltSync(10);
      updateData.password = bcrypt.hashSync(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    const { password: pw, ...otherDetails } = updatedUser._doc;
    res.status(200).json(otherDetails);
  } catch (err) {
    next(err);
  }
};
