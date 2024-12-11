import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
  }

  try {
    const hashPassword = await bcryptjs.hash(password, 8);
    const UserExist = await User.findOne({ email });
    if (UserExist) {
      return res
        .status(400)
        .json({ message: "Email đã tồn tại " });
    }
    const newUser = new User({ name, email, password: hashPassword });
    await newUser.save();
    return res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Thông tin không hợp lệ" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Thông tin không hợp lệ" });
    }

    const { password: userPassword, ...rest } = user.toObject();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    return res
      .status(200)
      .clearCookie("access_token")
      .json({ message: "Đăng xuất thành công" });
  } catch (error) {
    next(error);
  }
};
