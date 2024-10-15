import express from "express";
import { getUser, login, logout, signup } from "../controller/auth.controller.js";
import { authMiddlware } from "../middleware/auth.middleware.js";

const router = express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.get("/me",authMiddlware,getUser)
// router.post("/me",me)

export default router