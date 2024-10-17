import express from 'express'
import { createComment, createPost, getPost, likePosts } from '../controller/post.controller.js'
import { authMiddlware } from '../middleware/auth.middleware.js'
const router = express.Router()

router.get("/user/:username",authMiddlware,getPost)
router.post("/create",authMiddlware,createPost)
router.post("/comment/:postid",authMiddlware,createComment)
router.post("/like/:postid",authMiddlware,likePosts)
// router.post("/like/:commentid",authMiddlware,createComment)


export default router