import express from 'express'
import { createComment, createPost, getAllPosts, getFollowingPosts, getLikedPosts, getPost, likeComments, likePosts } from '../controller/post.controller.js'
import { authMiddlware } from '../middleware/auth.middleware.js'
const router = express.Router()

router.get("/user/:username",authMiddlware,getPost)
router.post("/create",authMiddlware,createPost)
router.post("/comment/:postid",authMiddlware,createComment)
router.post("/posts/:postid/like",authMiddlware,likePosts)
router.post("/posts/:postId/comments/:commentId/like",authMiddlware,likeComments)
router.get("/liked-posts/:userId",authMiddlware,getLikedPosts)
router.get("/",authMiddlware,getAllPosts)
router.get("/feed",authMiddlware,getFollowingPosts)

export default router