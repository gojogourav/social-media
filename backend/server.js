import express from 'express'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'
import connectDB from './dbConnect/connect.database.js'
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express()

app.use(cookieParser())
app.use(express.json({limit:"1000kb"}))
app.use(express.json({extended:true}))
// app.use(cookieParser())

const PORT = process.env.PORT||3000

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/post",postRoutes)

app.listen(PORT,()=>{
    console.log(`App is listening at port - http://localhost:${PORT}`);
    connectDB()
})