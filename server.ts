import dotenv from "dotenv";
import express from "express";
import cors from 'cors';
import authRouter, {authenticateToken} from "./router/auth-router";

dotenv.config()
const app = express()

app.use(express.json())

app.use(cors({
    origin: '*',
    methods : ['GET','POST','DELETE','PUT'],
    credentials : true
}))

console.log("Loaded secret key : " , process.env.SECRET_KEY)

app.use('/auth' , authRouter);
app.use(authenticateToken);

app.listen(3000 , (err) => {
    console.log("server running on port 3000")
})