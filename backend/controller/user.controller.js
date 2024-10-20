import bcrypt from "bcrypt";
import User from "../model/user.model.js";

export const userProfile = async (req, res) => {
  try {
    const username = req.params.username;

    if (!username)
      return res.status(400).json({ message: "username can't be blank!" });
    const user = await User.findOne({ username }).select("-password");
    if (!user)
      return res.status(404).json({ message: "Error 404 user not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.log(`error in userProfile controller ${error}`);
    res.status(400).json({ message: "Internal server error" });
  }
};

export const followUnfollowHandler = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "User id not provided" });

    const currentUser = await User.findById(req.user._id);
    if (!currentUser)
      return res.status(404).json({ message: "Unauthorized access" });

    const userToModify = await User.findById(id).select("-password");
    if (!userToModify)
      return res.status(404).json({ message: "Error user not found 404!" });

    if (id === req.user._id.toString())
      return res.status(400).json({ message: "You cannot follow yourself" });

    const isFollowing = currentUser.following.includes(id.toString());

    if (isFollowing) {
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });

      return res
        .status(200)
        .json({ message: `unfollowed ${userToModify.username}` });
    } else {
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });

      return res
        .status(200)
        .json({ message: `followed ${userToModify.username}` });
    }
  } catch (error) {
    console.log(`error in followUnfollowHandler in user controller ${error}`);
    res.status(400).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, fullname, bio, email, currentPassword, newPassword } =
      req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;
    let user = await User.findById(userId);

    if (!user)
      return res.status(404).json({ message: "Error 404 user not found" });

    if (!currentPassword && newPassword)
      return res
        .status(400)
        .json({ message: "Enter current password to update profile" });

    if (currentPassword && newPassword) {
      const passCheck = await bcrypt.compare(currentPassword, user.password);
      if (!passCheck)
        return res
          .status(401)
          .json({ message: "Incorrect password please try again" });

      if (newPassword.length < 6)
        return res
          .status(400)
          .json({ message: "new password must be atleast 6 characters long" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (fullname) user.fullname = fullname;
    if (bio) user.bio = bio;

    if (username || email) {
      const passCheck = bcrypt.compare(currentPassword, user.password);
      if (!passCheck)
        return res.status(401).json({ message: "incorrect password" });

      if (email) user.email = email;
      if (username) user.username = username;
    }

    user = await user.save();

    res.status(200).json(user.toObject({
      versionKey:false,
      transform:(doc,ret)=>{
        delete ret.password
        return ret
      }
    }))
  } catch (error) {
    console.log(`error in update user controller ${error}`);
    res.status(400).json({ message: "Internal server error" });
  }
};

