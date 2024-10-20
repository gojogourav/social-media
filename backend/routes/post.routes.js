import express from 'express'
import { createComment, createPost, getLikedPosts, getPost, likeComments, likePosts } from '../controller/post.controller.js'
import { authMiddlware } from '../middleware/auth.middleware.js'
const router = express.Router()

router.get("/user/:username",authMiddlware,getPost)
router.post("/create",authMiddlware,createPost)
router.post("/comment/:postid",authMiddlware,createComment)
router.post("/like/:postid",authMiddlware,likePosts)
router.post("/like/:commentid",authMiddlware,likeComments)
router.get("/liked-posts/:userid",authMiddlware,getLikedPosts)

export default router