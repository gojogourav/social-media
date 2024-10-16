import express from "express";
import { authMiddlware } from "../middleware/auth.middleware.js";
import { followUnfollowHandler, updateProfile, userProfile } from "../controller/user.controller.js";
const router = express.Router()

router.get("/profile/:username",authMiddlware,userProfile)
router.post("/follow/:id",authMiddlware,followUnfollowHandler)
router.post("/update/",authMiddlware,updateProfile)

export default router