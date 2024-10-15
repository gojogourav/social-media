import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
export const authMiddlware = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res
      .status(401)
      .json({ message: "authentication denied no token provided" });
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded) return res.status(401).json({ message: "Token not valid!" });

    const user = await User.findById(decoded.userId).select("-password")
    
    if (!user) return res.status(404).json({ message: "404 User not found!" });

    
    
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Token is expired!" });
  }
};
