//this is post controller used for posting

import Post from "../model/post.model.js";
import User from "../model/user.model.js";
import User from "../model/user.model.js";

export const getPost = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");
    if (!user) return res.status(404).json({ message: "Error 404 not found" });

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "-password",
        },
      });

    if (!posts) return res.status(404).json({ message: "Nothing here..." });

    return res.status(200).json(posts);
  } catch (error) {
    console.log(`Error in getPost controller ${error}`);
    res.status(400).json({ message: "Internal server error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const { img } = req.body;
    const userId = req.user._id;

    const user = await User.findById(req.user._id).select("-password");
    if (!user)
      return res.status(404).json({ message: "error 404 user not found" });

    if (!text && !img)
      return res.status(400).json({ message: "post cannot be empty" });

    const post = new Post({
      user: userId,
      text,
      img,
    });
    await post.save();

    return res.status(200).json(post);
  } catch (error) {
    console.log(`error in createPost controller ${error}`);
    res
      .status(400)
      .json({ message: "Unable to create post please try again later" });
  }
};

export const createComment = async (req, res) => {
  try {
    const { postid } = req.params;
    const { text, img } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "user not found" });

    const post = await Post.findById(postid);
    if (!post) return res.status(404).json({ message: "Post not found!!" });

    const newComment = new Comment({
      text,
      img,
      user: userId,
    });

    await newComment.save();

    post.comments.push(newComment._id);
    await post.save();

    await post.populate({
      path: "comments",
      populate: {
        path: "user",
        select: "-password -likedPost -email -createdAt -updatedAt -community",
      },
    });

    res.status(200).json(newComment);
  } catch (error) {
    console.log(`Error in createComment controller ${error}`);
    res.status(400).json({ message: "Please try again" });
  }
};

export const likePosts = async (req, res) => {
  try {
    const { postid } = req.params;
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");

    if (!user) return res.status(404).json({ message: "error user not found" });

    const post = await Post.findById(postid);
    if (!post) return res.status(400).json({ message: "Error post not found" });

    const checkIfAlreadyLiked = post.likes.includes(userId);

    if (checkIfAlreadyLiked) {
      post.likes.splice(post.likes.indexOf(userId), 1);
      user.likedPost.splice(user.likedPost.indexOf(postid), 1);
      return res.status(200).json({ message: "Post unliked successfully" });
    } else {
      post.likes.push(userId);
      user.likedPost.push(postid);
      return res.status(200).json({ message: "post liked successfully" });
    }
  } catch (error) {
    console.log(`Error in upvoteDownvotePost: ${error}`);
    res.status(400).json({ message: "Internal server error please try again" });
  }
};
export const likeComments = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    if (!user)
      return res.status(404).json({ message: "Error 404 user not found" });

    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({ message: "Error 404 post not found" });

    const comment = await Comment.findById(commentId);
    if (!comment)
      return res.status(404).json({ message: "Error 404 comment not found" });

    const hasLiked = comment.likes.includes(userId);

    hasLiked
      ? comment.likes.splice(comment.likes.indexOf(userId), 1)
      : comment.likes.push(userId);

    await comment.save();

    return res.status(200).json(comment);
  } catch (error) {
    console.log(`Error in upvoteDownvotePost: ${error}`);
    res.status(400).json({ message: "Internal server error please try again" });
  }
};

export const getLikedPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "Error user not found" });

    const likedPost = await Post.find({ _id: { $in: user.likedPost } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "-password",
        },
      });

    return res.status(200).json(likedPost);
  } catch (error) {
    console.log(`Error in getLikedPosts controller ${error}`);
    res
      .status(400)
      .json({ message: "internal server error! please try again later" });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .select("-password")
      .select("-password");
    if (!user)
      return res.status(404).json({ message: "Error 404 user not found " });

    const following = user.following;
    const FeedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comment",
        populate: {
          path: "user",
          select: "-password",
        },
      });

    res.status(200).json(FeedPosts);
  } catch (error) {
    console.log(`Error in getFollowingPosts controller ${error}`);
    res.status(400).json({ message: "internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "User",
        select: "-password -email",
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "-password -email",
        },
      });

    if (posts.length == 0 || !posts)
      return res.status(200).json({ message: "No posts available " });

    return res.status(200).json(posts);
  } catch (error) {
    console.log(`Error in getAllPosts controller ${error}`);
    res.status(400).json({ message: "Internal server error" });
  }
};
